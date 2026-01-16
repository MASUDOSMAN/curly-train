const facts = [];

const factInput = document.getElementById("factInput");
const addFactButton = document.getElementById("addFact");
const factsList = document.getElementById("factsList");
const questionSuggestions = document.getElementById("questionSuggestions");
const closingSuggestions = document.getElementById("closingSuggestions");

const timerDisplay = document.getElementById("timerDisplay");
const startTimerButton = document.getElementById("startTimer");
const pauseTimerButton = document.getElementById("pauseTimer");
const resetTimerButton = document.getElementById("resetTimer");

let remainingSeconds = 600;
let timerId = null;

const questionTemplates = [
  "Would you like to share more about {fact}?",
  "How does {fact} make you feel today?",
  "What is a favorite memory connected to {fact}?",
  "What would you like me to know about {fact}?",
  "Is there anything about {fact} you want to talk about right now?",
];

const closingTemplates = [
  "Thank you for sharing about {fact}. I appreciate hearing that.",
  "I heard that {fact} matters to you. We can return to that anytime.",
  "It was nice to hear about {fact}. We will follow your lead next time.",
];

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const updateTimerDisplay = () => {
  timerDisplay.textContent = formatTime(remainingSeconds);
};

const startTimer = () => {
  if (timerId) {
    return;
  }
  timerId = window.setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      updateTimerDisplay();
    } else {
      window.clearInterval(timerId);
      timerId = null;
    }
  }, 1000);
};

const pauseTimer = () => {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
};

const resetTimer = () => {
  pauseTimer();
  remainingSeconds = 600;
  updateTimerDisplay();
};

const renderFacts = () => {
  factsList.innerHTML = "";
  if (facts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "facts__empty";
    empty.textContent = "No facts yet. Add at least 2 to unlock suggestions.";
    factsList.append(empty);
    return;
  }

  facts.forEach((fact, index) => {
    const item = document.createElement("div");
    item.className = "fact-item";
    const text = document.createElement("span");
    text.textContent = fact;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.type = "button";
    removeButton.addEventListener("click", () => {
      facts.splice(index, 1);
      updateSuggestions();
      renderFacts();
    });

    item.append(text, removeButton);
    factsList.append(item);
  });
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildSuggestionCards = (container, suggestions, emptyMessage) => {
  container.innerHTML = "";
  if (suggestions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "suggestions__empty";
    empty.textContent = emptyMessage;
    container.append(empty);
    return;
  }

  suggestions.forEach((suggestion) => {
    const card = document.createElement("div");
    card.className = "suggestion";
    const title = document.createElement("h3");
    title.textContent = suggestion.title;
    const detail = document.createElement("p");
    detail.textContent = suggestion.body;
    card.append(title, detail);
    container.append(card);
  });
};

const buildQuestions = () => {
  if (facts.length < 2) {
    return [];
  }
  const shuffledFacts = shuffle(facts);
  return shuffledFacts.slice(0, 4).map((fact, index) => {
    const template = questionTemplates[index % questionTemplates.length];
    return {
      title: `Question ${index + 1}`,
      body: template.replace("{fact}", fact),
    };
  });
};

const buildClosings = () => {
  if (facts.length === 0) {
    return [];
  }
  return closingTemplates.slice(0, 3).map((template, index) => ({
    title: `Closing ${index + 1}`,
    body: template.replace("{fact}", facts[index % facts.length]),
  }));
};

const updateSuggestions = () => {
  buildSuggestionCards(
    questionSuggestions,
    buildQuestions(),
    "Add facts to see safe, tailored questions."
  );
  buildSuggestionCards(
    closingSuggestions,
    buildClosings(),
    "Add facts to see closing prompts."
  );
};

const addFact = () => {
  const value = factInput.value.trim();
  if (!value) {
    return;
  }
  facts.push(value);
  factInput.value = "";
  updateSuggestions();
  renderFacts();
};

addFactButton.addEventListener("click", addFact);
factInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addFact();
  }
});

startTimerButton.addEventListener("click", startTimer);
pauseTimerButton.addEventListener("click", pauseTimer);
resetTimerButton.addEventListener("click", resetTimer);

updateTimerDisplay();
updateSuggestions();
renderFacts();
