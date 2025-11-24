let questions = [];
let index = 0;
let score = 0;

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
    try{ localStorage.setItem('theme', next); }catch(e){}
}

function initTheme(){
    try{
        const stored = localStorage.getItem('theme');
        if(stored) setTheme(stored);
        else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
        else setTheme('light');
    }catch(e){ setTheme('light'); }
    if(themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
}

initTheme();

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreBox = document.getElementById("scoreBox");
const newGameBtn = document.getElementById("newGame");

function fetchQuestions() {
    questionEl.textContent = "Loading questions...";
    optionsEl.innerHTML = "";
    scoreBox.textContent = "";

    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
    .then(res => res.json())
    .then(data => {
        questions = data.results.map(q => formatQuestion(q));
        index = 0;
        score = 0;
    })
    .catch(() => {
        questionEl.textContent = "Failed to load questions. Try again.";
    });
}

function formatQuestion(q) {
    const options = [...q.incorrect_answers];
    const correctPosition = Math.floor(Math.random() * 5);
    options.splice(correctPosition, 0, q.correct_answer);

    return {
    question: q.question,
    options: options,
    answer: correctPosition
    };
}

function loadQuestion() {
    if (index >= questions.length) return endQuiz();

    const q = questions[index];
    questionEl.innerHTML = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = opt;

        div.onclick = () => checkAnswer(i, div);
        optionsEl.appendChild(div);
    });
}

function checkAnswer(selected, selectedDiv) {
    const correct = questions[index].answer;

    Array.from(optionsEl.children).forEach(opt => opt.style.pointerEvents = "none");

    if (selected === correct) {
        selectedDiv.style.background = "#4caf50";
        score++;
    } 
    else {
        selectedDiv.style.background = "#f44336";
        optionsEl.children[correct].style.background = "#4caf50";
    }

    setTimeout(() => {
        index++;
        loadQuestion();
    }, 900);
}

function endQuiz() {
    questionEl.innerHTML = score >= 3 ? "<center>🎉 Congratulations! You Won!</center" : "<center>You finished the quiz!</center";

    optionsEl.innerHTML = "";
    scoreBox.innerHTML = `Your Score: <strong>${score} / ${questions.length}</strong>`;
    newGameBtn.style.display = "block";
}

newGameBtn.onclick = () => {
    newGameBtn.style.display = "none";
    fetchQuestions();
};

fetchQuestions();