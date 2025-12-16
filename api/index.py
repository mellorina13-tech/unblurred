import sys
import os

# Add parent directory to path for imports to work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Export the Flask app for Vercel
# Vercel will automatically detect and use this
