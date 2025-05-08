// eventHandlers.js - Event Handlers untuk Kuis Hewan

import { debug, safePlayAudio } from './errorHandling.js';

// Konfigurasi event handlers untuk kuis
function setupEventHandlers(props) {
    const {
        nextButton, 
        restartButton, 
        musicToggle, 
        backgroundMusic, 
        correctSound, 
        incorrectSound,
        showQuestion,
        initQuiz
    } = props;
    
    let isMusicPlaying = false;
    let audioInitialized = false;
    
    // Event handler untuk tombol next
    function setupNextButtonHandler() {
        nextButton.addEventListener("click", () => {
            // Animasi transisi
            document.getElementById("question-container").classList.add("fade-out");
            
            // Nonaktifkan tombol sementara untuk mencegah multiple clicks
            nextButton.disabled = true;
            
            // Efek suara klik jika diperlukan
            playButtonClickSound();
            
            setTimeout(() => {
                props.currentQuestion++;
                showQuestion();
                nextButton.disabled = false;
            }, 500);
        });
        
        debug("Next button handler set up");
    }
    
    // Event handler untuk tombol restart
    function setupRestartButtonHandler() {
        restartButton.addEventListener("click", () => {
            // Animasi untuk restart
            document.querySelector(".container").classList.add("fade-out");
            
            // Nonaktifkan tombol sementara
            restartButton.disabled = true;
            
            // Efek suara klik
            playButtonClickSound();
            
            setTimeout(() => {
                document.querySelector(".container").classList.remove("fade-out");
                initQuiz();
                restartButton.disabled = false;
            }, 500);
        });
        
        debug("Restart button handler set up");
    }
    
    // Event handler untuk tombol musik
    function setupMusicToggleHandler() {
        musicToggle.addEventListener("click", () => {
            if (!audioInitialized) {
                initAudio();
            }
            
            if (isMusicPlaying) {
                backgroundMusic.pause();
                musicToggle.innerHTML = "♫";
                musicToggle.setAttribute('aria-label', 'Play music');
            } else {
                backgroundMusic.play().catch(e => {
                    debug("Error memutar musik latar: " + e);
                    alert("Klik tombol musik sekali lagi untuk memulai musik!");
                });
                musicToggle.innerHTML = "⏸";
                musicToggle.setAttribute('aria-label', 'Pause music');
            }
            isMusicPlaying = !isMusicPlaying;
            
            // Animasi tombol musik
            musicToggle.classList.remove("pulse");
            void musicToggle.offsetWidth; // Trigger reflow
            musicToggle.classList.add("pulse");
        });
        
        debug("Music toggle handler set up");
    }
    
    // Event handler untuk opsi jawaban
    function setupOptionClickHandler(optionElement, option, checkAnswer) {
        optionElement.addEventListener("click", () => {
            checkAnswer(option);
            
            // Hapus fokus dari tombol setelah klik
            optionElement.blur();
        });
    }
    
    // Event handler untuk keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            
            // Jika tombol space atau enter ditekan pada elemen yang berfokus
            if ((e.key === ' ' || e.key === 'Enter') && 
                (activeElement.classList.contains('option') || 
                 activeElement.classList.contains('control-button') || 
                 activeElement.classList.contains('music-button'))) {
                e.preventDefault();
                activeElement.click();
            }
            
            // Navigasi dengan tombol panah
            else if (e.key === 'ArrowRight' && !nextButton.disabled && nextButton.style.display !== 'none') {
                e.preventDefault();
                nextButton.click();
            }
            
            // Tombol escape untuk menampilkan menu (jika ada)
            else if (e.key === 'Escape') {
                e.preventDefault();
                // Implementasi menu jika diperlukan
            }
        });
        
        debug("Keyboard navigation set up");
    }
    
    // Event handler untuk drag and drop pada gambar (fitur opsional)
    function setupDragAndDrop() {
        const questionImage = document.getElementById('question-image');
        
        questionImage.addEventListener('dragstart', (e) => {
            e.preventDefault(); // Mencegah drag default
            
            // Tambahkan efek visual saat gambar ditekan
            questionImage.classList.add('being-dragged');
            
            // Logika drag and drop lainnya jika diperlukan
        });
        
        questionImage.addEventListener('dragend', () => {
            questionImage.classList.remove('being-dragged');
        });
    }
    
    // Event handler untuk swipe pada mobile (fitur opsional)
    function setupSwipeHandler() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const container = document.querySelector('.container');
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 100; // Minimal jarak untuk mendeteksi swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe ke kiri - lanjut ke pertanyaan berikutnya
                if (nextButton.style.display !== 'none' && !nextButton.disabled) {
                    nextButton.click();
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe ke kanan - fitur opsional, misalnya kembali ke pertanyaan sebelumnya
                // (tidak diimplementasikan dalam kuis ini)
            }
        }
        
        debug("Swipe handler set up");
    }
    
    // Inisialisasi audio hanya sekali saat interaksi pertama dengan dokumen
    function setupFirstInteractionAudio() {
        let hasInitializedAudio = false;
        
        document.addEventListener("click", function initAudioOnFirstInteraction() {
            if (!hasInitializedAudio) {
                initAudio();
                hasInitializedAudio = true;
                document.removeEventListener("click", initAudioOnFirstInteraction);
                debug("Audio initialized on first interaction");
            }
        }, { once: true });
    }
    
    // Fungsi untuk membuat suara klik tombol
    function playButtonClickSound() {
        // Buat audio element on-the-fly untuk click sound
        const clickSound = new Audio();
        clickSound.src = 'assets/audio/click.mp3'; // Pastikan file ada
        clickSound.volume = 0.3;
        
        safePlayAudio(clickSound);
    }
    
    // Fungsi untuk inisialisasi audio
    function initAudio() {
        if (!audioInitialized) {
            // Set volume untuk audio background music
            backgroundMusic.volume = 0.5;
            
            // Pre-load audio untuk mengurangi delay
            correctSound.load();
            incorrectSound.load();
            backgroundMusic.load();
            
            debug("Audio elements initialized");
            audioInitialized = true;
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
                safePlayAudio(sound);
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
        
        debug("Hover sound effect added to buttons");
    }
    
    // Fungsi setup utama untuk semua event handlers
    function setupAllEventHandlers() {
        setupNextButtonHandler();
        setupRestartButtonHandler();
        setupMusicToggleHandler();
        setupKeyboardNavigation();
        setupDragAndDrop();
        setupSwipeHandler();
        setupFirstInteractionAudio();
        addHoverSoundToButtons();
        
        debug("All event handlers set up");
        
        return {
            setupOptionClickHandler
        };
    }
    
    // Return fungsi-fungsi yang perlu diakses dari luar
    return setupAllEventHandlers();
}

// Export fungsi setup event handlers
export { setupEventHandlers };
