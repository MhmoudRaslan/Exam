const img = document.querySelector("img");
const next = document.querySelector("#nextquestion");
const par = document.querySelector("p");
const div = document.querySelector("div");
const progressRing = document.getElementById("progressRing");
const progressText = document.getElementById("progressText");

let progressDisplay = document.createElement("span");
progressDisplay.style.marginLeft = "20px";
let timerDisplay = document.createElement("span");
timerDisplay.style.marginLeft = "20px";
par.parentNode.insertBefore(progressDisplay, par.nextSibling);
par.parentNode.insertBefore(timerDisplay, progressDisplay.nextSibling);

let questions = [];
let currentIndex;
let usedIndexes = [];
let timer = null;
let timeLeft;
let Count = 0;
let correctCount = 0;
// Load questions and show the first one
window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("questions.json");
  questions = await res.json();
  currentIndex = Math.floor(Math.random() * questions.length);
  usedIndexes.push(currentIndex);
  showQuestion(currentIndex);
});

const updateProgress = function () {
  // Draw ring
  let percent = questions.length
    ? Math.round((Count / questions.length) * 100)
    : 0;
  drawRing(percent);
  progressText.textContent = `You have asnwered ${Count} out of ${questions.length}  questions`;
};

const drawRing = function (percent) {
  const ctx = progressRing.getContext("2d");
  ctx.clearRect(0, 0, progressRing.width, progressRing.height);
  // Background ring
  ctx.beginPath();
  ctx.arc(60, 60, 50, 0, 2 * Math.PI);
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 10;
  ctx.stroke();
  // Progress ring
  ctx.beginPath();
  ctx.arc(
    60,
    60,
    50,
    -Math.PI / 2,
    2 * Math.PI * (percent / 100) - Math.PI / 2
  );
  if (percent < 50) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.stroke();
  } else {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 10;
    ctx.stroke();
  }
  // Text
  ctx.font = "24px Arial";
  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(percent + "%", 60, 60);
};

const startTimer = function () {
  timeLeft = 60;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      timerDisplay.textContent = "Time's up!";
      div.querySelectorAll(".option").forEach((btn) => (btn.disabled = true));
      next.disabled = false;
    }
  }, 1000);
};

const showQuestion = function (index) {
  const q = questions[index];
  par.textContent = q.question;
  img.src = q.img;
  img.style.display = "block";

  // Remove old options
  const oldOptions = div.querySelectorAll(".option");
  oldOptions.forEach((opt) => opt.remove());

  // Add new options
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option";
    btn.onclick = () => {
      clearInterval(timer);
      if (opt === q.answer) {
        correctCount++;
      }
      Count++;
      // Disable all options after answer
      div.querySelectorAll(".option").forEach((b) => (b.disabled = true));
      next.disabled = false;
      updateProgress();
    };
    div.appendChild(btn);
  });

  next.disabled = true;
  updateProgress();
  startTimer();
};

next.addEventListener("click", async () => {
  if (questions.length === 0) {
    // Load questions once
    const res = await fetch("questions.json");
    questions = await res.json();
  }
  persent = (correctCount / questions.length) * 100;
  // Pick a random unused question
  if (usedIndexes.length === questions.length) {
    drawRing(persent);
    timerDisplay.textContent = "";
    par.textContent = `Exam finished! you answered ${correctCount} out of ${questions.length} questions correctly.`;
    img.style.display = "none";
    next.disabled = true;
    return;
  }
  let idx;
  do {
    idx = Math.floor(Math.random() * questions.length);
  } while (usedIndexes.includes(idx));
  usedIndexes.push(idx);
  currentIndex = idx;
  showQuestion(idx);
});
