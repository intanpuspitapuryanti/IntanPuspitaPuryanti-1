// Fungsi untuk membuat gelembung animasi
function createBubbles() {
    const bubbleContainer = document.querySelector('.bubble-effect');
    const bubbleCount = 10;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Ukuran acak
        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Posisi acak
        const left = Math.random() * 100;
        bubble.style.left = `${left}%`;
        
        // Delay acak
        const animationDelay = Math.random() * 15;
        bubble.style.animationDelay = `${animationDelay}s`;
        
        // Durasi acak
        const animationDuration = Math.random() * 5 + 5;
        bubble.style.animationDuration = `${animationDuration}s`;
        
        bubbleContainer.appendChild(bubble);
    }
}

// Fungsi untuk membuat efek konfeti
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        
        // Hapus konfeti setelah animasi selesai
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 5000);
    }
}

// Fungsi untuk warna acak
function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd166', '#6a5acd', '#ff9f1c'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Tambahkan animasi konfeti untuk kuis
function addConfettiEffect() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
        }
        
        .float-animation {
            animation: float 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Tambahkan efek mengapung ke gambar pertanyaan
function addFloatEffect() {
    const questionImage = document.getElementById("question-image");
    questionImage.classList.add('float-animation');
}

// Export fungsi untuk digunakan di file lain
export { 
    createBubbles, 
    createConfetti, 
    getRandomColor, 
    addConfettiEffect, 
    addFloatEffect 
};
