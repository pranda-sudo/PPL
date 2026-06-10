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
  categories: new Set(),
  aircraft: new Set(),
  answered: new Map(),
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
  navigatorSummary: document.querySelector("#navigatorSummary"),
  questionNavigator: document.querySelector("#questionNavigator"),
  sourceText: document.querySelector("#sourceText"),
  questionText: document.querySelector("#questionText"),
  answers: document.querySelector("#answers"),
  showAnswerBtn: document.querySelector("#showAnswerBtn"),
  markKnownBtn: document.querySelector("#markKnownBtn"),
  cardPrevBtn: document.querySelector("#cardPrevBtn"),
  cardNextBtn: document.querySelector("#cardNextBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
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

  els.aircraftFilters.innerHTML = "";
  unique("aircraft").forEach((aircraft) => {
    state.aircraft.add(aircraft);
    els.aircraftFilters.append(
      makeCheckbox(aircraft, true, (checked) => {
        checked ? state.aircraft.add(aircraft) : state.aircraft.delete(aircraft);
        buildDeck();
      }),
    );
  });
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

  let selected;
  if (state.mode === "mock") {
    selected = buildMockDeck();
  } else {
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
  els.timeLimitText.textContent = state.mode === "mock" ? `${MOCK_EXAM_TOTAL_MINUTES} min` : "-";
  els.progressText.textContent = `${state.deck.length ? state.index + 1 : 0} / ${state.deck.length}`;
  renderStats();
  renderNavigator();

  if (!question) {
    els.currentMeta.textContent = "Žádný výběr";
    els.currentTitle.textContent = "Není co zobrazit";
    els.sourceText.textContent = "";
    els.questionText.textContent = "Pro vybrané filtry nejsou žádné otázky.";
    els.answers.innerHTML = "";
    els.cardPrevBtn.disabled = true;
    els.cardNextBtn.disabled = true;
    return;
  }

  const answer = state.answered.get(question.id);
  const stat = state.stats[question.id];
  els.currentMeta.textContent = `${question.category} · ${question.aircraft}`;
  els.currentTitle.textContent = modeTitle();
  els.sourceText.textContent = `${question.sourceFile} · otázka ${question.sourceNumber} · strana ${question.page} · pokusy ${stat?.attempts || 0}, chyby ${stat?.wrong || 0}`;
  els.questionText.textContent = question.question;
  els.answers.innerHTML = "";
  els.cardPrevBtn.disabled = state.index === 0;
  els.cardNextBtn.disabled = state.index >= state.deck.length - 1;

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
els.markKnownBtn.addEventListener("click", () => {
  const question = currentQuestion();
  if (!question) return;
  const stat = questionStats(question.id);
  stat.correct += 1;
  stat.attempts += 1;
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
