from flask import Flask, render_template, request, send_file, jsonify
import os
import logging
from werkzeug.utils import secure_filename
from datetime import datetime
import uuid
import sys
import threading
import time

# Add current directory to path for depixlib imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from depixlib.helpers import check_color
from depixlib.functions import (
    dropEmptyRectangleMatches,
    findGeometricMatchesForSingleResults,
    findRectangleMatches,
    findRectangleSizeOccurences,
    findSameColorSubRectangles,
    removeMootColorRectangles,
    splitSingleMatchAndMultipleMatches,
    writeAverageMatchToImage,
    writeFirstMatchToImage
)
from depixlib.LoadedImage import LoadedImage
from depixlib.Rectangle import Rectangle

# Configure logging
logging.basicConfig(format="%(asctime)s - %(message)s", level=logging.INFO)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Create necessary folders
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

# Job tracking dictionary
jobs = {}
jobs_lock = threading.Lock()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def process_image_background(job_id, pixelated_path, search_path, background_color, average_type):
    """
    Background worker to process image asynchronously
    """
    try:
        with jobs_lock:
            jobs[job_id]['status'] = 'processing'
            jobs[job_id]['progress'] = 10

        output_path, error = depixelize_image(pixelated_path, search_path, background_color, average_type)

        with jobs_lock:
            if error:
                jobs[job_id]['status'] = 'failed'
                jobs[job_id]['error'] = error
            else:
                jobs[job_id]['status'] = 'completed'
                jobs[job_id]['output_file'] = os.path.basename(output_path)
                jobs[job_id]['progress'] = 100

        # Clean up uploaded file
        try:
            if os.path.exists(pixelated_path):
                os.remove(pixelated_path)
        except:
            pass

    except Exception as e:
        logging.error(f"Background processing error: {str(e)}")
        with jobs_lock:
            jobs[job_id]['status'] = 'failed'
            jobs[job_id]['error'] = str(e)


def depixelize_image(pixelated_path, search_path, background_color=None, average_type='gammacorrected'):
    """
    Depixelize an image using the depix algorithm
    """
    try:
        logging.info(f"Loading pixelated image from {pixelated_path}")
        pixelatedImage = LoadedImage(pixelated_path)
        unpixelatedOutputImage = pixelatedImage.getCopyOfLoadedPILImage()

        logging.info(f"Loading search image from {search_path}")
        searchImage = LoadedImage(search_path)

        logging.info("Finding color rectangles from pixelated space")
        pixelatedRectange = Rectangle(
            (0, 0), (pixelatedImage.width - 1, pixelatedImage.height - 1)
        )

        pixelatedSubRectanges = findSameColorSubRectangles(
            pixelatedImage, pixelatedRectange
        )
        logging.info(f"Found {len(pixelatedSubRectanges)} same color rectangles")

        pixelatedSubRectanges = removeMootColorRectangles(
            pixelatedSubRectanges, background_color
        )
        logging.info(f"{len(pixelatedSubRectanges)} rectangles left after moot filter")

        rectangeSizeOccurences = findRectangleSizeOccurences(pixelatedSubRectanges)
        logging.info(f"Found {len(rectangeSizeOccurences)} different rectangle sizes")

        if len(rectangeSizeOccurences) > max(10, pixelatedRectange.width * pixelatedRectange.height * 0.01):
            logging.warning("Too many variants on block size. Re-cropping the image might help.")

        logging.info("Finding matches in search image")
        rectangleMatches = findRectangleMatches(
            rectangeSizeOccurences, pixelatedSubRectanges, searchImage, average_type
        )

        logging.info("Removing blocks with no matches")
        pixelatedSubRectanges = dropEmptyRectangleMatches(
            rectangleMatches, pixelatedSubRectanges
        )

        logging.info("Splitting single matches and multiple matches")
        singleResults, pixelatedSubRectanges = splitSingleMatchAndMultipleMatches(
            pixelatedSubRectanges, rectangleMatches
        )

        logging.info(f"[{len(singleResults)} straight matches | {len(pixelatedSubRectanges)} multiple matches]")

        logging.info("Trying geometrical matches on single-match squares")
        singleResults, pixelatedSubRectanges = findGeometricMatchesForSingleResults(
            singleResults, pixelatedSubRectanges, rectangleMatches
        )

        logging.info(f"[{len(singleResults)} straight matches | {len(pixelatedSubRectanges)} multiple matches]")

        logging.info("Trying another pass on geometrical matches")
        singleResults, pixelatedSubRectanges = findGeometricMatchesForSingleResults(
            singleResults, pixelatedSubRectanges, rectangleMatches
        )

        logging.info(f"[{len(singleResults)} straight matches | {len(pixelatedSubRectanges)} multiple matches]")

        logging.info("Writing single match results to output")
        writeFirstMatchToImage(
            singleResults, rectangleMatches, searchImage, unpixelatedOutputImage
        )

        logging.info("Writing average results for multiple matches to output")
        writeAverageMatchToImage(
            pixelatedSubRectanges, rectangleMatches, searchImage, unpixelatedOutputImage
        )

        # Generate unique output filename
        output_filename = f"depixelized_{uuid.uuid4().hex[:8]}.png"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        
        logging.info(f"Saving output image to: {output_path}")
        unpixelatedOutputImage.save(output_path)
        
        return output_path, None

    except Exception as e:
        logging.error(f"Error during depixelization: {str(e)}")
        return None, str(e)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pixelated_image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['pixelated_image']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload PNG or JPG'}), 400

    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        # Get search image (default or custom)
        search_image_path = request.form.get('search_image', 'images/searchimages/debruinseq_notepad_Windows10_closeAndSpaced.png')

        # Get optional parameters
        background_color = None
        if request.form.get('background_color'):
            try:
                bg_color_str = request.form.get('background_color')
                background_color = tuple(map(int, bg_color_str.split(',')))
            except:
                pass

        average_type = request.form.get('average_type', 'gammacorrected')

        # Create job
        job_id = uuid.uuid4().hex

        with jobs_lock:
            jobs[job_id] = {
                'status': 'queued',
                'progress': 0,
                'created_at': datetime.now().isoformat()
            }

        # Start background processing
        thread = threading.Thread(
            target=process_image_background,
            args=(job_id, filepath, search_image_path, background_color, average_type)
        )
        thread.daemon = True
        thread.start()

        # Return job ID immediately
        return jsonify({
            'success': True,
            'job_id': job_id
        })

    except Exception as e:
        logging.error(f"Upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/job-status/<job_id>')
def job_status(job_id):
    """Check the status of a processing job"""
    with jobs_lock:
        if job_id not in jobs:
            return jsonify({'error': 'Job not found'}), 404

        job = jobs[job_id].copy()

    return jsonify(job)


@app.route('/download/<filename>')
def download_file(filename):
    try:
        filepath = os.path.join(app.config['OUTPUT_FOLDER'], secure_filename(filename))
        return send_file(filepath, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@app.route('/preview/<filename>')
def preview_file(filename):
    try:
        filepath = os.path.join(app.config['OUTPUT_FOLDER'], secure_filename(filename))
        return send_file(filepath, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@app.route('/manifest.json')
def manifest():
    return send_file('static/manifest.json', mimetype='application/manifest+json')


@app.route('/info')
def info():
    return render_template('info.html')


@app.route('/health')
def health():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


if __name__ == '__main__':
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get('PORT', 5000))
    
    print("=" * 60)
    print("🚀 Depixelization Web Application")
    print("=" * 60)
    print(f"📍 Server starting at: http://0.0.0.0:{port}")
    print(f"🌍 Environment: {'Production' if not os.environ.get('FLASK_DEBUG') else 'Development'}")
    print("📝 Press CTRL+C to stop the server")
    print("=" * 60)
    
    # Use debug=False in production
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    app.run(
        debug=debug_mode,
        host='0.0.0.0',
        port=port
    )
