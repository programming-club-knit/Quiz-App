// ==========================
//       QUIZ DATA
// ==========================
let questions = [
    { question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], answer: 1 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: 2 },
    { question: "Who wrote the National Anthem of India?", options: ["Bankim Chandra", "Sarojini Naidu", "Tagore", "Premchand"], answer: 2 },
    { question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
    { question: "HTML stands for?", options: ["Hyper Text Makeup Language","HighText Markup Language","Hyper Text Markup Language","Hyper Tool Multi Language"], answer: 2 }
];

let index = 0;
let score = 0;
let timer;
let timeLeft = 10;

// === Theme toggle (persists to localStorage) ===
const themeToggleBtn = document.getElementById('theme-toggle');

function setTheme(theme){
    if(theme === 'dark'){
        document.documentElement.setAttribute('data-theme','dark');
        if(themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if(themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }
}

function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
}

function initTheme(){
    const stored = localStorage.getItem('theme');
    if(stored) setTheme(stored);
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    else setTheme('light');
    if(themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
}
initTheme();

// === Quiz Elements ===
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreBox = document.getElementById("scoreBox");
const newGameBtn = document.getElementById("newGame");

// ==========================
//       LOAD QUESTION
// ==========================
function loadQuestion() {
    if (index >= questions.length) return endQuiz();

    timeLeft = 10;
    updateTimer();

    clearInterval(timer);
    timer = setInterval(countDown, 1000);

    const q = questions[index];
    questionEl.innerHTML = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = opt;
        div.onclick = () => checkAnswer(i, div);
        optionsEl.appendChild(div);
        div.style.pointerEvents = "auto";
        div.style.background = "#e3e3e3";
    });
}

// ==========================
//         TIMER
// ==========================
function countDown() {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
        clearInterval(timer);
        timeUp();
    }
}

function updateTimer() {
    scoreBox.innerHTML = `⏳ Time Left: <strong>${timeLeft}</strong> seconds<br>Score: ${score}`;
}

// ==========================
//        TIME UP LOGIC
// ==========================
function timeUp() {
    questionEl.innerHTML += "<br><span style='color:red; font-size:16px;'>Time Up!</span>";
    const correct = questions[index].answer;
    Array.from(optionsEl.children).forEach(opt => opt.style.pointerEvents = "none");
    optionsEl.children[correct].style.background = "#4caf50"; // highlight correct
    setTimeout(() => { index++; loadQuestion(); }, 1000);
}

// ==========================
//     CHECK ANSWER
// ==========================
function checkAnswer(selected, selectedDiv) {
    clearInterval(timer);
    const correct = questions[index].answer;
    Array.from(optionsEl.children).forEach(opt => opt.style.pointerEvents = "none");

    if (selected === correct) {
        selectedDiv.style.background = "#4caf50";
        score++;
    } else {
        selectedDiv.style.background = "#f44336";
        if (optionsEl.children[correct]) optionsEl.children[correct].style.background = "#4caf50";
    }
    setTimeout(() => { index++; loadQuestion(); }, 900);
}

// ==========================
//         END QUIZ
// ==========================
function endQuiz() {
    clearInterval(timer);
    questionEl.innerHTML = score >= 3 ? "<center>🎉 Congratulations! You Won!</center>" : "<center>You finished the quiz!</center>";
    optionsEl.innerHTML = "";
    scoreBox.innerHTML = `Your Score: <strong>${score} / ${questions.length}</strong>`;
    newGameBtn.style.display = "block";
}

// ==========================
//        NEW GAME
// ==========================
newGameBtn.onclick = () => {
    newGameBtn.style.display = "none";
    index = 0;
    score = 0;
    loadQuestion();
};

// START GAME
loadQuestion();
