const DEBUG = false;

const questions = [
  {
    question: "Hewan apa yang bersuara 'Guk guk'?",
    options: ["Kucing", "Ayam", "Anjing", "Kambing"],
    correctAnswer: "Anjing"
  },
  {
    question: "Hewan apa yang bersuara 'Meong'?",
    options: ["Kucing", "Bebek", "Sapi", "Kuda"],
    correctAnswer: "Kucing"
  },
  {
    question: "Hewan apa yang bersuara 'Moo'?",
    options: ["Bebek", "Sapi", "Ayam", "Kucing"],
    correctAnswer: "Sapi"
  },
  {
    question: "Hewan apa yang bersuara 'Petok petok'?",
    options: ["Ayam", "Sapi", "Kucing", "Anjing"],
    correctAnswer: "Ayam"
  }
];

let currentQuestionIndex = 0;
let score = 0;

function playSound(name) {
  if (!DEBUG) {
    const audio = new Audio(`https://api-obeng.cyclic.app/static/sound/${name}.mp3`);
    audio.play();
  }
}

function showQuestion() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");
  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });

  scoreElement.textContent = `Skor: ${score}`;
}

function checkAnswer(selectedOption) {
  const correctAnswer = questions[currentQuestionIndex].correctAnswer;

  if (selectedOption === correctAnswer) {
    playSound("benar");
    score++;
  } else {
    playSound("salah");
  }

  document.getElementById("score").textContent = `Skor: ${score}`;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const nextButton = document.getElementById("next-button");

  questionElement.textContent = "Kuis selesai!";
  optionsContainer.innerHTML = `<p>Skor akhir Anda adalah ${score} dari ${questions.length}.</p>`;
  nextButton.style.display = "none";
}

window.onload = showQuestion;
