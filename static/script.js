let selectedFile = null;
let outputFilename = null;
let isProcessing = false;
let currentLanguage = 'tr';

// Language translations
const translations = {
    tr: {
        title: 'Depixelization',
        subtitle: 'Pixelli fotoğraflarınızı temizleyin',
        howItWorks: 'Nasıl çalışır?',
        uploadTitle: 'Fotoğraf Yükle',
        uploadDesc: 'Pixelli fotoğrafınızı sürükleyip bırakın veya tıklayın',
        selectFile: 'Dosya Seç',
        fileInfo: 'PNG veya JPG formatında, maksimum 16MB',
        uploadedPhoto: 'Yüklenen Fotoğraf',
        change: 'Değiştir',
        advancedSettings: 'Gelişmiş Ayarlar',
        averageType: 'Ortalama Tipi:',
        backgroundColor: 'Arkaplan Rengi (R,G,B):',
        bgColorPlaceholder: 'Örn: 40,41,35',
        bgColorHelp: 'Editör arkaplan rengini filtrelemek için (opsiyonel)',
        searchImage: 'Search Image:',
        searchImageHelp: 'Karakter desenlerini aramak için kullanılan referans görüntü',
        processBtn: 'Fotoğrafı Temizle',
        processing: 'Fotoğraf işleniyor...',
        processingWait: 'Bu işlem birkaç saniye sürebilir',
        processingLong: 'İşlem devam ediyor...',
        processingLongWait: 'Büyük fotoğraflar veya karmaşık desenler daha uzun sürebilir (30-60 saniye)',
        cancelProcess: 'İşlemi Durdur',
        resultTitle: '✨ Temizlenmiş Fotoğraf',
        download: 'İndir',
        newPhoto: 'Yeni Fotoğraf',
        errorTitle: 'Hata Oluştu',
        tryAgain: 'Tekrar Dene',
        errorNoFile: 'Lütfen önce bir dosya seçin.',
        errorInvalidType: 'Geçersiz dosya tipi. Lütfen PNG veya JPG formatında bir dosya yükleyin.',
        errorTooLarge: 'Dosya çok büyük. Maksimum dosya boyutu 16MB.',
        errorProcessing: 'Zaten bir işlem devam ediyor. Lütfen bekleyin veya işlemi durdurun.',
        footerText: 'Depix algoritması kullanılarak geliştirilmiştir',
        footerNote: '⚡ Bu araç pixellenmiş metinleri kurtarmak için tasarlanmıştır'
    },
    en: {
        title: 'Depixelization',
        subtitle: 'Clean your pixelated photos',
        howItWorks: 'How it works?',
        uploadTitle: 'Upload Photo',
        uploadDesc: 'Drag and drop your pixelated photo or click',
        selectFile: 'Select File',
        fileInfo: 'PNG or JPG format, maximum 16MB',
        uploadedPhoto: 'Uploaded Photo',
        change: 'Change',
        advancedSettings: 'Advanced Settings',
        averageType: 'Average Type:',
        backgroundColor: 'Background Color (R,G,B):',
        bgColorPlaceholder: 'e.g: 40,41,35',
        bgColorHelp: 'To filter editor background color (optional)',
        searchImage: 'Search Image:',
        searchImageHelp: 'Reference image used to search for character patterns',
        processBtn: 'Clean Photo',
        processing: 'Processing photo...',
        processingWait: 'This may take a few seconds',
        processingLong: 'Processing continues...',
        processingLongWait: 'Large photos or complex patterns may take longer (30-60 seconds)',
        cancelProcess: 'Cancel Process',
        resultTitle: '✨ Cleaned Photo',
        download: 'Download',
        newPhoto: 'New Photo',
        errorTitle: 'Error Occurred',
        tryAgain: 'Try Again',
        errorNoFile: 'Please select a file first.',
        errorInvalidType: 'Invalid file type. Please upload a PNG or JPG file.',
        errorTooLarge: 'File too large. Maximum file size is 16MB.',
        errorProcessing: 'A process is already running. Please wait or cancel it.',
        footerText: 'Developed using Depix algorithm',
        footerNote: '⚡ This tool is designed to recover pixelated text'
    }
};

function switchLanguage(lang) {
    currentLanguage = lang;
    updatePageLanguage();
    localStorage.setItem('preferredLanguage', lang);
}

function updatePageLanguage() {
    const t = translations[currentLanguage];

    // Update all translatable elements
    document.querySelector('.logo h1').textContent = t.title;
    document.querySelector('.subtitle').textContent = t.subtitle;
    document.querySelector('a[href="/info"]').innerHTML = `ℹ️ ${t.howItWorks}`;

    document.querySelector('.upload-area h2').textContent = t.uploadTitle;
    document.querySelector('.upload-area p').textContent = t.uploadDesc;
    document.querySelector('.btn-primary').textContent = t.selectFile;
    document.querySelector('.file-info').textContent = t.fileInfo;

    document.querySelector('.preview-card h3').textContent = t.uploadedPhoto;
    document.querySelector('.preview-card .btn-secondary').textContent = t.change;

    document.querySelector('.settings-toggle span').textContent = t.advancedSettings;

    const labels = document.querySelectorAll('.setting-item label');
    labels[0].textContent = t.averageType;
    labels[1].textContent = t.backgroundColor;
    labels[2].textContent = t.searchImage;

    document.querySelector('#backgroundColor').placeholder = t.bgColorPlaceholder;

    const smalls = document.querySelectorAll('.setting-item small');
    smalls[0].textContent = t.bgColorHelp;
    smalls[1].textContent = t.searchImageHelp;

    document.querySelector('.btn-process').innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
        </svg>
        ${t.processBtn}
    `;

    document.querySelector('.result-card h3').textContent = t.resultTitle;
    document.querySelector('.btn-download').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2V14M10 14L6 10M10 14L14 10M3 18H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${t.download}
    `;
    document.querySelector('.result-actions .btn-secondary').textContent = t.newPhoto;

    document.querySelector('.error-card h3').textContent = t.errorTitle;
    document.querySelector('.error-card .btn-secondary').textContent = t.tryAgain;

    document.querySelectorAll('.footer p')[0].textContent = t.footerText;
    document.querySelector('.footer-note').textContent = t.footerNote;

    // Update cancel button
    document.getElementById('cancelBtn').textContent = t.cancelProcess;
}

// Initialize language on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'tr';
    currentLanguage = savedLang;
    updatePageLanguage();
    document.getElementById('langSelect').value = savedLang;
});

// File input change handler
document.getElementById('fileInput').addEventListener('change', function (e) {
    handleFileSelect(e.target.files[0]);
});

// Drag and drop handlers
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// Click to upload
uploadArea.addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// Handle file selection
function handleFileSelect(file) {
    if (!file) return;

    const t = translations[currentLanguage];

    // Check if already processing
    if (isProcessing) {
        showError(t.errorProcessing);
        return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        showError(t.errorInvalidType);
        return;
    }

    // Validate file size (16MB)
    if (file.size > 16 * 1024 * 1024) {
        showError(t.errorTooLarge);
        return;
    }

    selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('previewImage').src = e.target.result;
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('previewSection').style.display = 'block';
        document.getElementById('actionSection').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Reset upload
function resetUpload() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('actionSection').style.display = 'none';
}

// Reset all
function resetAll() {
    isProcessing = false;
    resetUpload();
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    outputFilename = null;
}

// Toggle settings
function toggleSettings() {
    const content = document.getElementById('settingsContent');
    const toggle = document.querySelector('.settings-toggle');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.classList.add('active');
    } else {
        content.style.display = 'none';
        toggle.classList.remove('active');
    }
}

// Process image
async function processImage() {
    const t = translations[currentLanguage];

    if (!selectedFile) {
        showError(t.errorNoFile);
        return;
    }

    if (isProcessing) {
        showError(t.errorProcessing);
        return;
    }

    isProcessing = true;

    // Hide sections
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('actionSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';

    // Show loading
    const loadingSection = document.getElementById('loadingSection');
    loadingSection.querySelector('p').textContent = t.processing;
    loadingSection.querySelector('small').textContent = t.processingWait;
    loadingSection.style.display = 'block';

    // Update loading message after 10 seconds
    const loadingTimeout = setTimeout(() => {
        const loadingText = loadingSection.querySelector('p');
        loadingText.textContent = t.processingLong;
        const loadingSmall = loadingSection.querySelector('small');
        loadingSmall.textContent = t.processingLongWait;
    }, 10000);

    // Prepare form data
    const formData = new FormData();
    formData.append('pixelated_image', selectedFile);

    // Add optional parameters
    const averageType = document.getElementById('averageType').value;
    formData.append('average_type', averageType);

    const backgroundColor = document.getElementById('backgroundColor').value.trim();
    if (backgroundColor) {
        formData.append('background_color', backgroundColor);
    }

    const searchImage = document.getElementById('searchImage').value;
    formData.append('search_image', searchImage);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        clearTimeout(loadingTimeout);

        const data = await response.json();

        if (response.ok && data.success) {
            // Success
            outputFilename = data.output_file;
            showResult(outputFilename);
        } else {
            // Error
            showError(data.error || 'Bir hata oluştu.');
        }
    } catch (error) {
        clearTimeout(loadingTimeout);
        showError('Server connection failed: ' + error.message);
    } finally {
        document.getElementById('loadingSection').style.display = 'none';
        isProcessing = false;
    }
}

// Cancel processing
function cancelProcess() {
    isProcessing = false;
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('actionSection').style.display = 'block';
}

// Show result
function showResult(filename) {
    const resultImage = document.getElementById('resultImage');
    resultImage.src = `/preview/${filename}?t=${Date.now()}`;

    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.onclick = () => {
        window.location.href = `/download/${filename}`;
    };

    document.getElementById('resultSection').style.display = 'block';
}

// Show error
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorSection').style.display = 'block';
    document.getElementById('loadingSection').style.display = 'none';
}
