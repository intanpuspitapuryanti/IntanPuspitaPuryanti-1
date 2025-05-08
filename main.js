// Import fungsi dari file lain
import { 
    createBubbles, 
    createConfetti, 
    addConfettiEffect, 
    addFloatEffect 
} from './animations.js';

import { 
    initAudio, 
    toggleMusic, 
    playCorrectSound, 
    playIncorrectSound, 
    addHoverSoundToButtons,
    debug, 
    audioInitialized 
} from './audio.js';

// Data kuis dengan gambar dari folder assets
const questions = [
    {
        question: "Hewan apa ini?",
        image: "assets/images/cat.jpg",
        imageAlt: "Kucing",
        options: ["Kucing", "Anjing", "Kelinci", "Hamster"],
        answer: "Kucing"
    },
    {
        question: "Hewan apa ini?",
        image: "assets/images/elephant.jpg",
        imageAlt: "Gajah",
        options: ["Jerapah", "Gajah", "Singa", "Harimau"],
        answer: "Gajah"
    },
    {
        question: "Hewan apa ini?",
        image: "assets/images/monkey.jpg",
        imageAlt: "Monyet",
        options: ["Gorila", "Orangutan", "Monyet", "Simpanse"],
        answer: "Monyet"
    },
    {
        question: "Hewan apa ini?",
        image: "assets/images/fish.jpg",
        imageAlt: "Ikan",
        options: ["Ikan", "Ubur-ubur", "Gurita", "Lumba-lumba"],
        answer: "Ikan"
    },
    {
        question: "Hewan apa ini?",
        image: "assets/images/bird.jpg",
        imageAlt: "Burung",
        options: ["Ayam", "Bebek", "Burung", "Angsa"],
        answer: "Burung"
    }
];

// Variabel global
let currentQuestion = 0;
let score = 0;
let answersDisabled = false;
let hasInitializedAudio = false;

// Memuat gambar di awal
function preloadImages() {
    debug("Mulai pre-loading gambar...");
    
    questions.forEach(q => {
        const img = new Image();
        img.src = q.image;
        img.onload = () => debug(`Gambar berhasil dimuat: ${q.image}`);
        img.onerror = () => debug(`Gagal memuat gambar: ${q.image}`);
    });
}

// Inisialisasi kuis
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    initAudio();
    preloadImages();
    createBubbles();
    
    // Dapatkan elemen-elemen DOM
    const questionImage = document.getElementById("question-image");
    const restartButton = document.getElementById("restart-button");
    const feedbackContainer = document.getElementById("feedback");
    
    // Reset tampilan
    questionImage.style.display = "block";
    restartButton.style.display = "none";
    feedbackContainer.innerHTML = "";
    
    showQuestion();
    updateScore();
    
    // Menampilkan pop-up untuk memulai musik
    setTimeout(() => {
        alert("Selamat datang di Kuis Hewan untuk Anak-anak! Klik tombol musik di pojok kanan bawah untuk memulai musik latar.");
    }, 1000);
}

// Menampilkan pertanyaan dengan transisi
function showQuestion() {
    // Dapatkan elemen-elemen DOM
    const questionContainer = document.getElementById("question-container");
    const questionText = document.getElementById("question-text");
    const questionImage = document.getElementById("question-image");
    const optionsContainer = document.getElementById("options");
    const feedbackContainer = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");
    const progressBar = document.getElementById("progress");
    
    // Transisi fade out
    questionContainer.classList.add("fade-out");
    
    setTimeout(() => {
        nextButton.style.display = "none";
        feedbackContainer.innerHTML = "";
        feedbackContainer.classList.remove("show");
        answersDisabled = false;
        
        if (currentQuestion >= questions.length) {
            showResults();
            return;
        }
        
        const question = questions[currentQuestion];
        questionText.textContent = question.question;
        
        // Pastikan gambar selalu ditampilkan
        questionImage.style.display = "block";
        questionImage.src = question.image;
        questionImage.alt = question.imageAlt;
        
        // Reset classes untuk animasi baru
        questionImage.classList.remove("zoomIn");
        void questionImage.offsetWidth; // Trigger reflow
        questionImage.classList.add("zoomIn");
        
        // Error handling untuk gambar
        questionImage.onerror = function() {
            debug(`Failed to load image: ${question.image}`);
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'%3E%3Crect width='250' height='250' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E";
        };
        
        optionsContainer.innerHTML = "";
        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.className = "option";
            // Tambahkan variabel CSS untuk delay animasi
            button.style.setProperty('--i', index);
            button.addEventListener("click", () => {
                if (!answersDisabled) {
                    checkAnswer(option);
                }
            });
            optionsContainer.appendChild(button);
        });
        
        // Hapus kelas fade-out dan tambahkan rotate-in untuk efek masuk
        questionContainer.classList.remove("fade-out");
        questionContainer.classList.add("rotate-in");
        
        // Update progress bar dengan animasi
        progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
    }, 500); // Tunggu fade out selesai
}

// Memeriksa jawaban
function checkAnswer(selectedOption) {
    // Dapatkan elemen-elemen DOM
    const optionsContainer = document.getElementById("options");
    const feedbackContainer = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");
    
    // Prevent multiple clicks
    if (answersDisabled) return;
    answersDisabled = true;
    
    const question = questions[currentQuestion];
    const isCorrect = selectedOption === question.answer;
    
    // Pastikan audio sudah diinisialisasi
    if (!audioInitialized) {
        initAudio();
    }
    
    // Play sound feedback
    if (isCorrect) {
        playCorrectSound();
    } else {
        playIncorrectSound();
    }
    
    // Nonaktifkan semua tombol opsi dengan animasi
    const optionButtons = document.querySelectorAll(".option");
    optionButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.answer) {
            button.style.backgroundColor = "#4CAF50"; // Hijau untuk jawaban benar
            if (button.textContent === selectedOption) {
                button.style.transform = "scale(1.1)";
                button.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.8)";
            }
        } else if (button.textContent === selectedOption && !isCorrect) {
            button.style.backgroundColor = "#F44336"; // Merah untuk jawaban salah yang dipilih
            button.style.transform = "scale(0.95)";
        }
    });
    
    // Tampilkan feedback dengan GIF dan animasi
    if (isCorrect) {
        score++;
        feedbackContainer.innerHTML = `
            <p style='color: green; font-weight: bold; font-size: 24px;'>Benar!</p>
            <img src="assets/gifs/correct1.gif" class="feedback-gif" alt="Correct feedback">
        `;
    } else {
        feedbackContainer.innerHTML = `
            <p style='color: red; font-weight: bold; font-size: 24px;'>Oops! Jawaban yang benar adalah ${question.answer}</p>
            <img src="assets/gifs/incorrect1.gif" class="feedback-gif" alt="Incorrect feedback">
        `;
    }
    
    // Animasi untuk feedback
    setTimeout(() => {
        feedbackContainer.classList.add("show");
    }, 100);
    
    updateScore();
    
    // Tampilkan tombol selanjutnya dengan animasi
    setTimeout(() => {
        nextButton.style.display = "block";
        nextButton.classList.remove("slideInFromBottom");
        void nextButton.offsetWidth; // Trigger reflow
        nextButton.classList.add("slideInFromBottom");
    }, 800);
}

// Update skor dengan animasi
function updateScore() {
    const scoreElement = document.getElementById("score");
    // Animasi untuk perubahan skor
    scoreElement.classList.remove("score-update");
    void scoreElement.offsetWidth; // Trigger reflow
    scoreElement.classList.add("score-update");
    scoreElement.textContent = `Skor: ${score}`;
}

// Menampilkan hasil akhir
function showResults() {
    // Dapatkan elemen-elemen DOM
    const questionText = document.getElementById("question-text");
    const questionImage = document.getElementById("question-image");
    const optionsContainer = document.getElementById("options");
    const feedbackContainer = document.getElementById("feedback");
    const questionContainer = document.getElementById("question-container");
    const restartButton = document.getElementById("restart-button");
    const progressBar = document.getElementById("progress");
    
    questionText.textContent = "Kuis Selesai!";
    questionImage.style.display = "none";
    optionsContainer.innerHTML = "";
    feedbackContainer.innerHTML = "";
    
    const percentage = (score / questions.length) * 100;
    let message;
    let resultGif;
    
    if (percentage >= 80) {
        message = "Luar biasa! Kamu sangat pintar!";
        resultGif = "assets/gifs/correct1.gif";
    } else if (percentage >= 60) {
        message = "Bagus! Kamu melakukannya dengan baik!";
        resultGif = "assets/gifs/correct1.gif";
    } else {
        message = "Jangan menyerah! Coba lagi ya!";
        resultGif = "assets/gifs/incorrect1.gif";
    }
    
    // Tambahkan animasi untuk hasil
    questionContainer.classList.add("bounce");
    
    feedbackContainer.innerHTML = `
        <p style='font-size: 24px; font-weight: bold;'>${message}</p>
        <img src="${resultGif}" class="feedback-gif" alt="Result feedback">
        <p>Kamu mendapatkan ${score} dari ${questions.length} soal.</p>
    `;
    
    // Tampilkan feedback dengan animasi
    setTimeout(() => {
        feedbackContainer.classList.add("show");
    }, 100);
    
    // Tampilkan tombol mulai ulang dengan animasi
    setTimeout(() => {
        restartButton.style.display = "block";
        restartButton.classList.remove("slideInFromBottom");
        void restartButton.offsetWidth; // Trigger reflow
        restartButton.classList.add("slideInFromBottom");
    }, 800);
    
    // Animasi progress bar selesai
    progressBar.style.width = "100%";
    
    // Tambahkan efek konfeti untuk hasil yang baik
    if (percentage >= 60) {
        createConfetti();
    }
}

// Setup event listeners
function setupEventListeners() {
    const nextButton = document.getElementById("next-button");
    const restartButton = document.getElementById("restart-button");
    const musicToggle = document.getElementById("music-toggle");
    
    nextButton.addEventListener("click", () => {
        // Animasi transisi
        document.getElementById("question-container").classList.add("fade-out");
        
        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 500);
    });
    
    restartButton.addEventListener("click", () => {
        // Animasi untuk restart
        document.querySelector(".container").classList.add("fade-out");
        
        setTimeout(() => {
            document.querySelector(".container").classList.remove("fade-out");
            initQuiz();
        }, 500);
    });
    
    musicToggle.addEventListener("click", toggleMusic);
    
    // Inisialisasi audio hanya sekali saat interaksi pertama dengan dokumen
    document.addEventListener("click", function initAudioOnFirstInteraction() {
        if (!hasInitializedAudio) {
            initAudio();
            hasInitializedAudio = true;
            document.removeEventListener("click", initAudioOnFirstInteraction);
            debug("Audio initialized on first interaction");
        }
    }, { once: true });
}

// Fungsi yang berjalan saat halaman dimuat
window.onload = function() {
    addConfettiEffect();
    initQuiz();
    setupEventListeners();
    
    // Tambahkan efek mengapung ke gambar setelah beberapa detik
    setTimeout(addFloatEffect, 2000);
    
    // Tambahkan efek suara hover pada tombol
    addHoverSoundToButtons();
};
