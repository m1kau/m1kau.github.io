document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizForm");
  const questions = Array.from(form.querySelectorAll(".question"));
  const resultsSection = document.getElementById("results");
  const scoreDisplay = document.getElementById("score");
  const passFailDisplay = document.getElementById("passFail");

  const correctAnswers = {
    q1: "WorldWideWeb",
    q2: "C",
    q3: "B",
    q4: "C",
    q5: ["A", "B", "D"]
  };

  const totalQuestions = questions.length;
  let currentIndex = 0;
  let score = 0;

  let resetBtn = document.getElementById("resetBtn");
  if (!resetBtn) {
    resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.id = "resetBtn";
    resetBtn.className = "buttons";
    resetBtn.textContent = "Retake Quiz";
    resultsSection.appendChild(resetBtn);
  }

  /*Doing 1 question at a time*/

  function showQuestion(index) {
    questions.forEach((q, i) => {
      if (i === index) {
        q.style.display = "block";
        q.style.opacity = "1";
      } else {
        q.style.display = "none";
        q.style.opacity = "0";
      }
    });
  }

  /*Progress bar for the quiz*/

  const progressBarWrapper = document.createElement("div");
  progressBarWrapper.id = "progressWrapper";
  progressBarWrapper.innerHTML = `<div id="progressBar"></div>`;
  form.insertBefore(progressBarWrapper, form.firstElementChild);
  const progressBar = document.getElementById("progressBar");

  function updateProgress() {
    const percent = (currentIndex / totalQuestions) * 100;
    progressBar.style.width = `${percent}%`;
  }

  /*Buttons*/

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "buttons";
  nextBtn.textContent = "Next ➜";
  nextBtn.style.marginTop = "1rem";
  form.appendChild(nextBtn);

  /*Auto clicking next when the enter key is pressed
  this has been bugging me when doing the fill in the blank */
  
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  if (resultsSection.style.display === "block") return;
  if (e.target.type === "checkbox") return;
  if (!document.activeElement) return;
  nextBtn.click();
});

  resetBtn.style.display = "none";

  /*Answers*/

  function isAnswered(index) {
    const q = questions[index];
    const text = q.querySelector('input[type="text"]');
    const radios = q.querySelectorAll('input[type="radio"]');
    const checkboxes = q.querySelectorAll('input[type="checkbox"]');

    let answered = false;
    if (text) answered = text.value.trim() !== "";
    if (radios.length) answered = Array.from(radios).some(r => r.checked);
    if (checkboxes.length) answered = Array.from(checkboxes).some(c => c.checked);

    return answered;
  }

  function checkQuestion(index) {
    const q = questions[index];
    const input = q.querySelector("input,textarea,select");
    const name = input.name;
    const correct = correctAnswers[name];

    if (q.querySelector('[type="radio"]')) {
      const val = (form[name].value || "").trim();
      return val === correct;
    }

    if (q.querySelector('[type="checkbox"]')) {
      const selected = Array.from(form[name])
        .filter(c => c.checked)
        .map(c => c.value);
      return (
        selected.length === correct.length &&
        selected.every(v => correct.includes(v))
      );
    }

    const txt = (form[name].value || "").trim();
    return txt.toLowerCase() === String(correct).toLowerCase();
  }

  /*Results*/

  function showResults() {
  form.style.display = "none";
  results.style.display = "block";
  resetBtn.style.display = "inline-block";

  const percent = (score / questions.length) * 100;
  const passed = percent >= 70;

  scoreDisplay.textContent = `Score: ${score}/${questions.length} (${percent.toFixed(0)}%)`;
  passFailDisplay.textContent = passed ? "Result: PASS" : "Result: FAIL";
  passFailDisplay.className = passed ? "correct" : "incorrect";

  const detailed = document.getElementById("detailedResults");
  detailed.innerHTML = "";

  questions.forEach((q, i) => {
    const input = q.querySelector("input");
    const name = input.name;
    const correct = correctAnswers[name];

    let userAnswer = "";

    if (q.querySelector('[type="radio"]')) {
      userAnswer = form[name].value || "No answer";
    }
    else if (q.querySelector('[type="checkbox"]')) {
      const selected = [...form[name]]
        .filter(c => c.checked)
        .map(c => c.value);
      userAnswer = selected.length ? selected.join(", ") : "No answer";
    }
    else {
      userAnswer = form[name].value || "No answer";
    }

    /* Answer compare */
    let isCorrect = false;
    if (Array.isArray(correct)) {
      const selected = userAnswer.split(", ").map(s => s.trim());
      isCorrect =
        selected.length === correct.length &&
        selected.every(v => correct.includes(v));
    } else {
      isCorrect = userAnswer.toLowerCase() === correct.toLowerCase();
    }

    const block = document.createElement("div");
    block.className = "answer-block";

    block.innerHTML = `
      <p><strong>Question ${i + 1}:</strong></p>
      <p class="${isCorrect ? "result-correct" : "result-wrong"}">
        ${isCorrect ? "Correct" : "Incorrect"}
      </p>
      <p><strong>Your Answer:</strong> ${userAnswer}</p>
      <p><strong>Correct Answer:</strong> ${
        Array.isArray(correct) ? correct.join(", ") : correct
      }</p>
    `;

    detailed.appendChild(block);
  });
}


  nextBtn.addEventListener("click", () => {
    if (!isAnswered(currentIndex)) {
      alert("Please answer the question before proceeding.");
      return;
    }
    if (checkQuestion(currentIndex)) score++;
    if (currentIndex < totalQuestions - 1) {
      currentIndex++;
      showQuestion(currentIndex);
      updateProgress();
      if (currentIndex === totalQuestions - 1) {
        nextBtn.textContent = "Submit Quiz";
      }
    } else {
      showResults();
    }
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "block";
    resultsSection.style.display = "none";
    resetBtn.style.display = "none";
    score = 0;
    currentIndex = 0;
    nextBtn.textContent = "Next ➜";
    showQuestion(0);
    updateProgress();
  });

  showQuestion(0);
  updateProgress();
});
