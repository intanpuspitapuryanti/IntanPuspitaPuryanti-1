// errorHandling.js - Error Handling untuk Kuis Hewan

// Debug mode - set ke false untuk menyembunyikan pesan debug
const DEBUG = false;

// Fungsi untuk menambahkan pesan debug
function debug(message) {
    if (DEBUG) {
        const debugInfo = document.getElementById("debug-info");
        debugInfo.style.display = "block";
        debugInfo.innerHTML += message + "<br>";
        console.log(message);
    }
}

// Error handling untuk loading gambar
function setupImageErrorHandling(image, questionImage) {
    image.onerror = function() {
        debug(`Failed to load image: ${image.src}`);
        this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'%3E%3Crect width='250' height='250' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E";
        
        // Tambahkan notifikasi visual
        const container = document.querySelector('.question-container');
        const errorNotice = document.createElement('div');
        errorNotice.className = 'error-notice';
        errorNotice.textContent = 'Gambar tidak dapat dimuat';
        errorNotice.style.color = '#ff6b6b';
        errorNotice.style.fontStyle = 'italic';
        errorNotice.style.fontSize = '14px';
        errorNotice.style.marginTop = '5px';
        
        // Hapus notifikasi sebelumnya jika ada
        const existingNotice = container.querySelector('.error-notice');
        if (existingNotice) {
            container.removeChild(existingNotice);
        }
        
        container.insertBefore(errorNotice, questionImage.nextSibling);
    };
}

// Error handling untuk pemutaran audio
function handleAudioError(audioElement, errorMessage) {
    audioElement.onerror = function(e) {
        debug(`Error playing audio: ${errorMessage} - ${e}`);
        
        // Tampilkan notifikasi error audio jika diperlukan
        const musicControls = document.querySelector('.music-controls');
        
        // Hapus notifikasi sebelumnya jika ada
        const existingNotice = musicControls.querySelector('.audio-error-notice');
        if (existingNotice) {
            musicControls.removeChild(existingNotice);
        }
        
        const errorNotice = document.createElement('div');
        errorNotice.className = 'audio-error-notice';
        errorNotice.textContent = 'Masalah audio';
        errorNotice.style.color = '#ff6b6b';
        errorNotice.style.fontSize = '12px';
        errorNotice.style.marginTop = '5px';
        
        musicControls.appendChild(errorNotice);
        
        // Hapus notifikasi setelah beberapa detik
        setTimeout(() => {
            if (errorNotice.parentNode) {
                errorNotice.parentNode.removeChild(errorNotice);
            }
        }, 3000);
    };
}

// Fungsi untuk mengamankan audio play
function safePlayAudio(audioElement) {
    if (audioElement) {
        // Berhenti dan reset audio terlebih dahulu
        audioElement.pause();
        audioElement.currentTime = 0;
        
        // Putar audio dengan penanganan error
        audioElement.play().catch(e => {
            debug(`Error playing audio: ${e}`);
            
            // Jika error adalah karena interaksi pengguna, beri tahu pengguna
            if (e.name === 'NotAllowedError') {
                // Tampilkan notifikasi yang perlu interaksi pengguna
                const musicControls = document.querySelector('.music-controls');
                musicControls.style.animation = 'pulse 0.5s infinite alternate';
                
                const helpText = document.createElement('span');
                helpText.textContent = 'Klik untuk aktifkan audio';
                helpText.style.fontSize = '12px';
                helpText.style.color = '#ff6b6b';
                
                musicControls.appendChild(helpText);
                
                // Hapus animasi dan teks setelah klik
                musicControls.addEventListener('click', function removeHelpText() {
                    musicControls.style.animation = '';
                    if (helpText.parentNode) {
                        helpText.parentNode.removeChild(helpText);
                    }
                    musicControls.removeEventListener('click', removeHelpText);
                });
            }
        });
    }
}

// Fungsi untuk mengamankan preloading gambar
function safePreloadImage(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imagePath;
        
        img.onload = () => {
            debug(`Gambar berhasil dimuat: ${imagePath}`);
            resolve(img);
        };
        
        img.onerror = () => {
            debug(`Gagal memuat gambar: ${imagePath}`);
            reject(new Error(`Gagal memuat gambar: ${imagePath}`));
        };
        
        // Timeout untuk mencegah hanging jika gambar tidak bisa dimuat
        setTimeout(() => {
            if (!img.complete) {
                debug(`Timeout memuat gambar: ${imagePath}`);
                reject(new Error(`Timeout memuat gambar: ${imagePath}`));
            }
        }, 5000);
    });
}

// Fungsi untuk memastikan data kuis valid sebelum menampilkan
function validateQuizData(questions) {
    let isValid = true;
    
    if (!Array.isArray(questions) || questions.length === 0) {
        debug("Error: Data kuis tidak valid atau kosong");
        isValid = false;
    } else {
        questions.forEach((q, index) => {
            if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length === 0 || !q.answer) {
                debug(`Error: Pertanyaan #${index + 1} tidak memiliki properti yang diperlukan`);
                isValid = false;
            }
            
            // Verifikasi jawaban ada dalam opsi
            if (q.options && !q.options.includes(q.answer)) {
                debug(`Error: Jawaban untuk pertanyaan #${index + 1} tidak ada dalam opsi`);
                isValid = false;
            }
        });
    }
    
    return isValid;
}

// Fungsi utama untuk penanganan error dalam kuis
function setupErrorHandling(questionImage, correctSound, incorrectSound, backgroundMusic) {
    // Setup error handling untuk gambar
    setupImageErrorHandling(questionImage, questionImage);
    
    // Setup error handling untuk audio
    handleAudioError(correctSound, "correct sound");
    handleAudioError(incorrectSound, "incorrect sound");
    handleAudioError(backgroundMusic, "background music");
    
    // Tangani error tidak terduga
    window.onerror = function(message, source, lineno, colno, error) {
        debug(`Unhandled error: ${message} at ${source}:${lineno}:${colno}`);
        return false; // Biarkan browser juga menangani error
    };
    
    // Tangani penolakan promise yang tidak ditangani
    window.onunhandledrejection = function(event) {
        debug(`Unhandled promise rejection: ${event.reason}`);
    };
}

// Export fungsi-fungsi untuk digunakan di file lain
export {
    debug,
    setupImageErrorHandling,
    handleAudioError,
    safePlayAudio,
    safePreloadImage,
    validateQuizData,
    setupErrorHandling
};
