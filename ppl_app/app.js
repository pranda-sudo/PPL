const STORAGE_KEYS = {
  mistakes: "ppl-mistakes",
  stats: "ppl-stats",
};

const state = {
  all: [],
  pool: [],
  deck: [],
  index: 0,
  mode: "practice",
  aircraftMode: "both",
  categories: new Set(),
  aircraft: new Set(),
  answered: new Map(),
  examRemainingSeconds: null,
  examTimerId: null,
  examCompleted: false,
  mistakes: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.mistakes) || "[]")),
  stats: JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || "{}"),
};

const MOCK_EXAM_PLAN = [
  { category: "Pravo", count: 12, minutes: 20 },
  { category: "Lidska vykonnost", count: 12, minutes: 20 },
  { category: "Meteorologie", count: 12, minutes: 20 },
  { category: "Komunikace", count: 12, minutes: 25 },
  { category: "Letove zasady", count: 12, minutes: 25 },
  { category: "Provozni postupy", count: 12, minutes: 25 },
  { category: "Provedeni a planovani letu", count: 16, minutes: 35 },
  { category: "Obecna znalost o letadle", count: 16, minutes: 35 },
  { category: "Navigace", count: 16, minutes: 35 },
];

const MOCK_EXAM_TOTAL_MINUTES = MOCK_EXAM_PLAN.reduce((sum, item) => sum + item.minutes, 0);

const els = {
  questionCount: document.querySelector("#questionCount"),
  categoryFilters: document.querySelector("#categoryFilters"),
  aircraftFilters: document.querySelector("#aircraftFilters"),
  examSize: document.querySelector("#examSize"),
  shuffleAnswers: document.querySelector("#shuffleAnswers"),
  smartRepeat: document.querySelector("#smartRepeat"),
  totalStat: document.querySelector("#totalStat"),
  successStat: document.querySelector("#successStat"),
  savedMistakeStat: document.querySelector("#savedMistakeStat"),
  resetStatsBtn: document.querySelector("#resetStatsBtn"),
  mockPlan: document.querySelector("#mockPlan"),
  currentMeta: document.querySelector("#currentMeta"),
  currentTitle: document.querySelector("#currentTitle"),
  progressText: document.querySelector("#progressText"),
  scoreText: document.querySelector("#scoreText"),
  mistakeText: document.querySelector("#mistakeText"),
  sessionRateText: document.querySelector("#sessionRateText"),
  timeLimitText: document.querySelector("#timeLimitText"),
  subjectSummary: document.querySelector("#subjectSummary"),
  subjectStats: document.querySelector("#subjectStats"),
  navigatorSummary: document.querySelector("#navigatorSummary"),
  questionNavigator: document.querySelector("#questionNavigator"),
  sourceText: document.querySelector("#sourceText"),
  questionText: document.querySelector("#questionText"),
  questionImageWrap: document.querySelector("#questionImageWrap"),
  questionImage: document.querySelector("#questionImage"),
  questionImageCaption: document.querySelector("#questionImageCaption"),
  answers: document.querySelector("#answers"),
  showAnswerBtn: document.querySelector("#showAnswerBtn"),
  markKnownBtn: document.querySelector("#markKnownBtn"),
  finishExamBtn: document.querySelector("#finishExamBtn"),
  cardPrevBtn: document.querySelector("#cardPrevBtn"),
  cardNextBtn: document.querySelector("#cardNextBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  resultPanel: document.querySelector("#resultPanel"),
  resultHeadline: document.querySelector("#resultHeadline"),
  resultCorrect: document.querySelector("#resultCorrect"),
  resultWrong: document.querySelector("#resultWrong"),
  resultRate: document.querySelector("#resultRate"),
  resultTime: document.querySelector("#resultTime"),
  resultSubjects: document.querySelector("#resultSubjects"),
};

const letters = ["A", "B", "C", "D", "E", "F"];

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDuration(totalSeconds) {
  if (totalSeconds === null || Number.isNaN(totalSeconds)) return "-";
  const seconds = Math.max(0, totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function stopExamTimer() {
  if (state.examTimerId) {
    clearInterval(state.examTimerId);
    state.examTimerId = null;
  }
}

function startExamTimer() {
  stopExamTimer();
  state.examRemainingSeconds = MOCK_EXAM_TOTAL_MINUTES * 60;
  state.examCompleted = false;
  state.examTimerId = setInterval(() => {
    if (state.mode !== "mock" || state.examCompleted) {
      stopExamTimer();
      return;
    }
    state.examRemainingSeconds -= 1;
    if (state.examRemainingSeconds <= 0) {
      state.examRemainingSeconds = 0;
      finishExam("Čas vypršel");
      return;
    }
    renderTime();
  }, 1000);
}

function renderTime() {
  if (state.mode === "mock") {
    els.timeLimitText.textContent = formatDuration(state.examRemainingSeconds);
  } else {
    els.timeLimitText.textContent = "-";
  }
}

function saveMistakes() {
  localStorage.setItem(STORAGE_KEYS.mistakes, JSON.stringify([...state.mistakes]));
}

function saveStats() {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(state.stats));
}

function questionStats(id) {
  if (!state.stats[id]) {
    state.stats[id] = { attempts: 0, correct: 0, wrong: 0 };
  }
  return state.stats[id];
}

function unique(key) {
  return [...new Set(state.all.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "cs"));
}

function makeCheckbox(label, checked, onChange) {
  const row = document.createElement("label");
  row.className = "check-row";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  const span = document.createElement("span");
  span.textContent = label;
  row.append(input, span);
  return row;
}

function aircraftValuesForMode(mode) {
  if (mode === "airplane") return ["Letoun", "Spolecne"];
  if (mode === "helicopter") return ["Vrtulnik", "Spolecne"];
  return unique("aircraft");
}

function setAircraftMode(mode) {
  state.aircraftMode = mode;
  state.aircraft = new Set(aircraftValuesForMode(mode));
  renderAircraftControls();
  buildDeck();
}

function renderAircraftControls() {
  const options = [
    { mode: "airplane", label: "Letoun", detail: "PPL(A)" },
    { mode: "helicopter", label: "Vrtulník", detail: "PPL(H)" },
    { mode: "both", label: "Obojí", detail: "A + H" },
  ];
  els.aircraftFilters.innerHTML = "";
  els.aircraftFilters.className = "aircraft-toggle";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "aircraft-option";
    button.classList.toggle("active", state.aircraftMode === option.mode);
    button.innerHTML = `<strong>${option.label}</strong><span>${option.detail}</span>`;
    button.addEventListener("click", () => setAircraftMode(option.mode));
    els.aircraftFilters.append(button);
  });
}

function renderFilters() {
  els.categoryFilters.innerHTML = "";
  unique("category").forEach((category) => {
    state.categories.add(category);
    els.categoryFilters.append(
      makeCheckbox(category, true, (checked) => {
        checked ? state.categories.add(category) : state.categories.delete(category);
        buildDeck();
      }),
    );
  });

  state.aircraft = new Set(aircraftValuesForMode(state.aircraftMode));
  renderAircraftControls();
}

function filteredPool() {
  let pool = state.all.filter(
    (question) => state.categories.has(question.category) && state.aircraft.has(question.aircraft),
  );
  if (state.mode === "mistakes") {
    pool = pool.filter((question) => state.mistakes.has(question.id));
  }
  return pool;
}

function weightFor(question) {
  const stat = state.stats[question.id];
  if (!els.smartRepeat.checked || !stat) return 1;
  return clamp(1 + stat.wrong * 2 - stat.correct, 1, 8);
}

function smartShuffle(pool) {
  if (!els.smartRepeat.checked || state.mode === "exam" || state.mode === "mock") {
    return shuffle(pool);
  }
  const weighted = pool.flatMap((question) => Array.from({ length: weightFor(question) }, () => question));
  const seen = new Set();
  return shuffle(weighted).filter((question) => {
    if (seen.has(question.id)) return false;
    seen.add(question.id);
    return true;
  });
}

function prepareQuestion(question) {
  const mapped = question.options.map((text, originalIndex) => ({
    text,
    originalIndex,
    correct: originalIndex === question.correctIndex,
  }));
  const options = els.shuffleAnswers.checked ? shuffle(mapped) : mapped;
  return { ...question, displayOptions: options };
}

function aircraftPool() {
  return state.all.filter((question) => state.aircraft.has(question.aircraft));
}

function buildMockDeck() {
  const pool = aircraftPool();
  const selected = [];
  MOCK_EXAM_PLAN.forEach((plan) => {
    const categoryPool = pool.filter((question) => question.category === plan.category);
    selected.push(...shuffle(categoryPool).slice(0, plan.count));
  });
  return shuffle(selected);
}

function buildDeck() {
  state.answered.clear();
  state.pool = filteredPool();
  const selectedCategoryCount = state.categories.size;
  els.resultPanel.hidden = true;
  stopExamTimer();

  let selected;
  if (state.mode === "mock") {
    selected = buildMockDeck();
    startExamTimer();
  } else {
    state.examRemainingSeconds = null;
    state.examCompleted = false;
    const ordered = smartShuffle(state.pool);
    const fullSingleSubjectTest = state.mode === "exam" && selectedCategoryCount === 1;
    const limit = state.mode === "exam" && !fullSingleSubjectTest ? Number(els.examSize.value || 25) : ordered.length;
    selected = ordered.slice(0, limit);
  }

  state.deck = selected.map(prepareQuestion);
  state.index = 0;
  renderQuestion();
}

function currentQuestion() {
  return state.deck[state.index];
}

function sessionScore() {
  let correct = 0;
  let wrong = 0;
  state.answered.forEach((value) => {
    if (value.correct) correct += 1;
    else wrong += 1;
  });
  const total = correct + wrong;
  const rate = total ? Math.round((correct / total) * 100) : 0;
  return { correct, wrong, total, rate };
}

function subjectBreakdown() {
  const byCategory = new Map();
  state.deck.forEach((question) => {
    if (!byCategory.has(question.category)) {
      byCategory.set(question.category, { total: 0, answered: 0, correct: 0, wrong: 0 });
    }
    const item = byCategory.get(question.category);
    item.total += 1;
    const answer = state.answered.get(question.id);
    if (answer) {
      item.answered += 1;
      answer.correct ? (item.correct += 1) : (item.wrong += 1);
    }
  });
  return [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0], "cs"));
}

function globalStats() {
  return Object.values(state.stats).reduce(
    (acc, item) => {
      acc.attempts += item.attempts || 0;
      acc.correct += item.correct || 0;
      acc.wrong += item.wrong || 0;
      return acc;
    },
    { attempts: 0, correct: 0, wrong: 0 },
  );
}

function renderStats() {
  const totals = globalStats();
  const rate = totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) : 0;
  els.totalStat.textContent = String(totals.attempts);
  els.successStat.textContent = `${rate} %`;
  els.savedMistakeStat.textContent = String(state.mistakes.size);
}

function renderMockPlan() {
  els.mockPlan.innerHTML = "";
  MOCK_EXAM_PLAN.forEach((item, index) => {
    const row = document.createElement("div");
    row.innerHTML = `<span>${index + 1}. ${item.category}</span><strong>${item.count} / ${item.minutes} min</strong>`;
    els.mockPlan.append(row);
  });
  const total = document.createElement("div");
  total.className = "exam-plan-total";
  total.innerHTML = `<span>Celkem</span><strong>120 / ${MOCK_EXAM_TOTAL_MINUTES} min</strong>`;
  els.mockPlan.append(total);
}

function renderSubjectStats() {
  const breakdown = subjectBreakdown();
  const answered = breakdown.reduce((sum, [, item]) => sum + item.answered, 0);
  const total = breakdown.reduce((sum, [, item]) => sum + item.total, 0);
  els.subjectSummary.textContent = `${answered} / ${total} zodpovězeno`;
  els.subjectStats.innerHTML = "";

  breakdown.forEach(([category, item]) => {
    const rate = item.answered ? Math.round((item.correct / item.answered) * 100) : 0;
    const card = document.createElement("div");
    card.className = "subject-card";
    card.innerHTML = `
      <div>
        <strong>${category}</strong>
        <span>${item.answered} / ${item.total} hotovo</span>
      </div>
      <b>${rate} %</b>
    `;
    els.subjectStats.append(card);
  });
}

function answerState(question) {
  const answer = state.answered.get(question.id);
  if (!answer) return "pending";
  return answer.correct ? "correct" : "wrong";
}

function renderNavigator() {
  els.questionNavigator.innerHTML = "";
  const answeredCount = state.deck.filter((question) => state.answered.has(question.id)).length;
  els.navigatorSummary.textContent = `${answeredCount} / ${state.deck.length} zodpovězeno`;

  state.deck.forEach((question, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `question-dot ${answerState(question)}`;
    if (index === state.index) button.classList.add("active");
    button.textContent = String(index + 1);
    button.title = `Otázka ${index + 1}`;
    button.addEventListener("click", () => {
      state.index = index;
      renderQuestion();
    });
    els.questionNavigator.append(button);
  });
}

function modeTitle() {
  if (state.mode === "exam") return "Ostrý test";
  if (state.mode === "mock") return "Kontrolní test";
  if (state.mode === "mistakes") return "Opakování chyb";
  return "Procvičování";
}

function renderQuestion() {
  const question = currentQuestion();
  const score = sessionScore();
  els.questionCount.textContent = `${state.all.length} otázek v databázi`;
  els.scoreText.textContent = String(score.correct);
  els.mistakeText.textContent = String(score.wrong);
  els.sessionRateText.textContent = `${score.rate} %`;
  renderTime();
  els.progressText.textContent = `${state.deck.length ? state.index + 1 : 0} / ${state.deck.length}`;
  renderStats();
  renderSubjectStats();
  renderNavigator();

  if (!question) {
    els.currentMeta.textContent = "Žádný výběr";
    els.currentTitle.textContent = "Není co zobrazit";
    els.sourceText.textContent = "";
    els.questionText.textContent = "Pro vybrané filtry nejsou žádné otázky.";
    renderQuestionImage(null);
    els.answers.innerHTML = "";
    els.cardPrevBtn.disabled = true;
    els.cardNextBtn.disabled = true;
    els.finishExamBtn.hidden = true;
    return;
  }

  const answer = state.answered.get(question.id);
  const stat = state.stats[question.id];
  els.currentMeta.textContent = `${question.category} · ${question.aircraft}`;
  els.currentTitle.textContent = modeTitle();
  els.sourceText.textContent = `${question.sourceFile} · otázka ${question.sourceNumber} · strana ${question.page} · pokusy ${stat?.attempts || 0}, chyby ${stat?.wrong || 0}`;
  els.questionText.textContent = question.question;
  renderQuestionImage(question);
  els.answers.innerHTML = "";
  els.cardPrevBtn.disabled = state.index === 0;
  els.cardNextBtn.disabled = state.index >= state.deck.length - 1;
  els.finishExamBtn.hidden = state.mode !== "mock";

  question.displayOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    if (answer?.revealed || answer?.selectedIndex === index) {
      if (option.correct) button.classList.add("correct");
      if (answer?.selectedIndex === index && !option.correct) button.classList.add("wrong");
    }
    button.innerHTML = `<span class="letter">${letters[index]}</span><span>${option.text}</span>`;
    button.addEventListener("click", () => chooseAnswer(index));
    els.answers.append(button);
  });
}

function renderQuestionImage(question) {
  if (!question?.image) {
    els.questionImageWrap.hidden = true;
    els.questionImage.removeAttribute("src");
    els.questionImage.alt = "";
    els.questionImageCaption.textContent = "";
    return;
  }

  els.questionImage.src = question.image;
  els.questionImage.alt = `Obrázek k otázce ${question.imageCode || ""}`.trim();
  els.questionImageCaption.textContent = question.imageCode ? `Obrázek ${question.imageCode}` : "Obrázek k otázce";
  els.questionImageWrap.hidden = false;
}

function finishExam(reason = "Vyhodnoceno") {
  if (state.mode !== "mock") return;
  stopExamTimer();
  state.examCompleted = true;
  const score = sessionScore();
  const total = state.deck.length;
  const answered = score.total;
  const usedSeconds = MOCK_EXAM_TOTAL_MINUTES * 60 - (state.examRemainingSeconds || 0);
  els.resultPanel.hidden = false;
  els.resultHeadline.textContent = `${reason} · ${answered} / ${total} zodpovězeno`;
  els.resultCorrect.textContent = String(score.correct);
  els.resultWrong.textContent = String(score.wrong);
  els.resultRate.textContent = `${score.rate} %`;
  els.resultTime.textContent = formatDuration(usedSeconds);
  els.resultSubjects.innerHTML = "";

  subjectBreakdown().forEach(([category, item]) => {
    const rate = item.answered ? Math.round((item.correct / item.answered) * 100) : 0;
    const row = document.createElement("div");
    row.innerHTML = `
      <span>${category}</span>
      <strong>${item.correct}/${item.answered || 0} · ${rate} %</strong>
    `;
    els.resultSubjects.append(row);
  });
  renderQuestion();
  els.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function recordAnswer(question, correct) {
  const stat = questionStats(question.id);
  stat.attempts += 1;
  correct ? (stat.correct += 1) : (stat.wrong += 1);

  if (correct) {
    const shouldClear = stat.wrong === 0 || stat.correct >= stat.wrong + 2;
    if (shouldClear) state.mistakes.delete(question.id);
  } else {
    state.mistakes.add(question.id);
  }

  saveStats();
  saveMistakes();
}

function chooseAnswer(index) {
  const question = currentQuestion();
  if (!question || state.answered.has(question.id)) return;
  const option = question.displayOptions[index];
  recordAnswer(question, option.correct);
  state.answered.set(question.id, { selectedIndex: index, correct: option.correct, revealed: true });
  renderQuestion();
}

function revealAnswer() {
  const question = currentQuestion();
  if (!question) return;
  const correctIndex = question.displayOptions.findIndex((option) => option.correct);
  state.answered.set(question.id, { selectedIndex: correctIndex, correct: true, revealed: true });
  renderQuestion();
}

function next(delta) {
  if (!state.deck.length) return;
  state.index = clamp(state.index + delta, 0, state.deck.length - 1);
  renderQuestion();
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  buildDeck();
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

els.restartBtn.addEventListener("click", buildDeck);
els.prevBtn.addEventListener("click", () => next(-1));
els.nextBtn.addEventListener("click", () => next(1));
els.cardPrevBtn.addEventListener("click", () => next(-1));
els.cardNextBtn.addEventListener("click", () => next(1));
els.showAnswerBtn.addEventListener("click", revealAnswer);
els.finishExamBtn.addEventListener("click", () => finishExam());
els.markKnownBtn.addEventListener("click", () => {
  const question = currentQuestion();
  if (!question) return;
  const stat = questionStats(question.id);
  stat.correct += 1;
  stat.attempts += 1;
  state.answered.set(question.id, { selectedIndex: null, correct: true, revealed: true });
  state.mistakes.delete(question.id);
  saveStats();
  saveMistakes();
  next(1);
});
els.resetStatsBtn.addEventListener("click", () => {
  state.stats = {};
  state.mistakes.clear();
  state.answered.clear();
  saveStats();
  saveMistakes();
  buildDeck();
});
els.examSize.addEventListener("change", buildDeck);
els.shuffleAnswers.addEventListener("change", buildDeck);
els.smartRepeat.addEventListener("change", buildDeck);

function loadData(data) {
  state.all = data.questions || [];
  renderFilters();
  renderMockPlan();
  buildDeck();
}

if (window.PPL_QUESTIONS) {
  loadData(window.PPL_QUESTIONS);
} else {
  fetch("./data/questions.json")
    .then((response) => {
      if (!response.ok) throw new Error("questions.json nenalezen");
      return response.json();
    })
    .then(loadData)
    .catch((error) => {
      els.questionCount.textContent = "Chybí data";
      els.questionText.textContent = `Nejde načíst data: ${error.message}`;
    });
}

if ("serviceWorker" in navigator) {
window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

window.addEventListener("beforeunload", stopExamTimer);
