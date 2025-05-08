// Variabel global untuk audio
let audioInitialized = false;
let isMusicPlaying = false;

// Fungsi untuk inisialisasi audio
function initAudio() {
    if (!audioInitialized) {
        // Dapatkan elemen audio
        const correctSound = document.getElementById("correct-sound");
        const incorrectSound = document.getElementById("incorrect-sound");
        const backgroundMusic = document.getElementById("bg-music");
        
        // Set volume untuk audio background music
        backgroundMusic.volume = 0.5;
        
        // Pre-load audio untuk mengurangi delay
        correctSound.load();
        incorrectSound.load();
        backgroundMusic.load();
        
        // Pastikan audio tidak tumpang tindih
        correctSound.oncanplaythrough = function() {
            debug("Correct sound ready");
        };
        
        incorrectSound.oncanplaythrough = function() {
            debug("Incorrect sound ready");
        };
        
        // Menghindari multiple play
        correctSound.onplay = function() {
            debug("Correct sound playing");
        };
        
        incorrectSound.onplay = function() {
            debug("Incorrect sound playing");
        };
        
        debug("Audio elements initialized");
        audioInitialized = true;
    }
}

// Fungsi untuk mengontrol musik
function toggleMusic() {
    const musicToggle = document.getElementById("music-toggle");
    const backgroundMusic = document.getElementById("bg-music");
    
    if (!audioInitialized) {
        initAudio();
    }
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggle.innerHTML = "♫";
    } else {
        backgroundMusic.play().catch(e => {
            debug("Error memutar musik latar: " + e);
            alert("Klik tombol musik sekali lagi untuk memulai musik!");
        });
        musicToggle.innerHTML = "⏸";
    }
    isMusicPlaying = !isMusicPlaying;
    
    // Animasi tombol musik
    musicToggle.classList.remove("pulse");
    void musicToggle.offsetWidth; // Trigger reflow
    musicToggle.classList.add("pulse");
}

// Fungsi untuk memutar suara jawaban benar
function playCorrectSound() {
    const correctSound = document.getElementById("correct-sound");
    try {
        // Berhenti dan reset suara terlebih dahulu
        correctSound.pause();
        correctSound.currentTime = 0;
        
        // Menghapus event handler sebelumnya jika ada
        correctSound.onended = null;
        
        // Putar audio dengan satu instance
        setTimeout(() => {
            correctSound.play().catch(e => debug("Error playing correct sound: " + e));
        }, 10);
    } catch (e) {
        debug("Error playing correct sound: " + e);
    }
}

// Fungsi untuk memutar suara jawaban salah
function playIncorrectSound() {
    const incorrectSound = document.getElementById("incorrect-sound");
    try {
        // Berhenti dan reset suara terlebih dahulu
        incorrectSound.pause();
        incorrectSound.currentTime = 0;
        
        // Putar audio dengan satu instance
        setTimeout(() => {
            incorrectSound.play().catch(e => debug("Error playing incorrect sound: " + e));
        }, 10);
    } catch (e) {
        debug("Error playing incorrect sound: " + e);
    }
}

// Fungsi untuk menambahkan efek suara hover pada tombol
function addHoverSoundToButtons() {
    // Buat elemen audio untuk hover sound
    const hoverSound = document.createElement('audio');
    hoverSound.id = 'hover-sound';
    hoverSound.preload = 'auto';
    hoverSound.volume = 0.3; // Set volume lebih rendah agar tidak mengganggu
    
    // Tambahkan source untuk file hover.mp3
    const hoverSoundSource = document.createElement('source');
    hoverSoundSource.src = 'assets/audio/hover.mp3';
    hoverSoundSource.type = 'audio/mpeg';
    
    // Tambahkan source ke audio element
    hoverSound.appendChild(hoverSoundSource);
    
    // Tambahkan ke body
    document.body.appendChild(hoverSound);
    
    // Fungsi untuk memutar suara hover
    function playHoverSound() {
        // Reset dan putar audio
        const sound = document.getElementById('hover-sound');
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Tangani error jika browser belum siap memutar audio
                console.log("Error playing hover sound: " + e);
            });
        }
    }
    
    // Tambahkan event listener ke semua tombol yang ada saat ini
    document.querySelectorAll('.option, .control-button, .music-button').forEach(button => {
        button.addEventListener('mouseenter', playHoverSound);
    });
    
    // Untuk tombol yang dibuat dinamis (seperti opsi jawaban)
    // Gunakan event delegation untuk menangkap semua hover event pada container
    document.querySelector('.container').addEventListener('mouseenter', function(e) {
        // Cek apakah target adalah tombol
        if (e.target.classList.contains('option') || 
            e.target.classList.contains('control-button') || 
            e.target.classList.contains('music-button')) {
            playHoverSound();
        }
    }, true);
    
    console.log("Hover sound effect added to buttons");
}

// Fungsi debug untuk menampilkan pesan debug
function debug(message) {
    const DEBUG = false;
    if (DEBUG) {
        const debugInfo = document.getElementById("debug-info");
        debugInfo.style.display = "block";
        debugInfo.innerHTML += message + "<br>";
        console.log(message);
    }
}

// Export fungsi untuk digunakan di file lain
export { 
    initAudio, 
    toggleMusic, 
    playCorrectSound, 
    playIncorrectSound, 
    addHoverSoundToButtons,
    debug, 
    audioInitialized, 
    isMusicPlaying 
};
