function showFeatures() {
  const allElems = document.querySelectorAll(".elem");
  const fullElemPage = document.querySelectorAll(".fullElem");
  const fullElemPageBackButton = document.querySelectorAll(".back-button");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackButton.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
    });
  });
}

showFeatures();

function todoList() {
  const form = document.querySelector(".addTask form");
  const taskInput = document.querySelector(".addTask form #task-input");
  const taskDetailsInput = document.querySelector(".addTask form textarea");
  const taskCheckbox = document.querySelector(".addTask form #check");

  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  }

  function showTasks() {
    const allTask = document.querySelector(".todo-container .allTask");

    let sum = "";

    currentTask.forEach(function (elem, idx) {
      sum += `
        <details class="task">
            <summary>
                <div class="task-left">
                    <span class="task-title">${elem.task}</span>
                    <span class="${elem.imp}">imp</span>
                </div>

                <i class="ri-arrow-right-wide-line"></i>
            </summary>

            <p>${elem.details}</p>

            <button id=${idx}>Mark as Completed</button>
        </details>
    `;
    });

    allTask.innerHTML = sum;
  }
  showTasks();

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();

    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });

    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    showTasks();
    markTaskCompleted();

    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckbox.checked = false;
  });

  function markTaskCompleted() {
    const markCompletedBtn = document.querySelectorAll(".task button");

    markCompletedBtn.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(Number(btn.id), 1);

        localStorage.setItem("currentTask", JSON.stringify(currentTask));

        showTasks();
        markTaskCompleted();
      });
    });
  }

  markTaskCompleted();
}

todoList();

function dailyPlanner() {
  const dayPlanner = document.querySelector(".day-planner");

  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  const hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  let wholeDay = "";

  hours.forEach(function (elem, idx) {
    wholeDay += `<div class="day-planner-time">
            <p>${elem}</p>
            <input id=${idx} autocomplete="off" type="text" placeholder="...">
          </div>`;
  });

  dayPlanner.innerHTML = wholeDay;

  let dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach(function (elem) {
    elem.value = dayPlanData[elem.id] || "";

    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}

dailyPlanner();

function motivation() {
  const quoteEl = document.querySelector(".motivation-2 h1");
  const authorEl = document.querySelector(".author h2");
  const reloadIcon = document.querySelector(".motivation-1 i");

  const API_URL = "https://dummyjson.com/quotes/random";

  async function getQuote() {
    reloadIcon.classList.add("spinning");
    quoteEl.textContent = "Loading...";
    authorEl.textContent = "Loading...";

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      quoteEl.textContent = data.quote;
      authorEl.textContent = data.author;
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      quoteEl.textContent = "Could not load a quote. Please try again.";
    } finally {
      reloadIcon.classList.remove("spinning");
    }
  }

  reloadIcon.addEventListener("click", getQuote);
  getQuote();
}

motivation();

function pomodoroTimer() {
  const pomo = document.querySelector(".pomo-timer");
  const timer = document.querySelector(".pomo-timer h1");
  const modeLabel = document.querySelector(".pomo-mode");
  const startBtn = document.querySelector(".start-timer");
  const pauseBtn = document.querySelector(".pause-timer");
  const resetBtn = document.querySelector(".reset-timer");
  const modeBtns = document.querySelectorAll(".mode-btn");

  const MODES = {
    focus: { label: "Focus", seconds: 25 * 60 },
    break: { label: "Break", seconds: 5 * 60 },
  };

  const AUTO_START = true;

  let currentMode = "focus";
  let timerInterval = null;
  let endTime = null;
  let totalSeconds = MODES[currentMode].seconds;

  function updateTimer() {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    timer.textContent = `${minutes}:${seconds}`;
  }

  function setMode(mode) {
    pauseTimer();
    currentMode = mode;
    totalSeconds = MODES[mode].seconds;

    modeLabel.textContent = MODES[mode].label;
    pomo.dataset.mode = mode;
    modeBtns.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.mode === mode),
    );

    updateTimer();
  }

  function startTimer() {
    if (timerInterval !== null) return;

    endTime = Date.now() + totalSeconds * 1000;

    timerInterval = setInterval(() => {
      totalSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      updateTimer();

      if (totalSeconds === 0) finishSession();
    }, 250);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    setMode(currentMode);
  }

  function finishSession() {
    const next = currentMode === "focus" ? "break" : "focus";
    setMode(next);

    if (AUTO_START) startTimer();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  modeBtns.forEach((btn) =>
    btn.addEventListener("click", () => setMode(btn.dataset.mode)),
  );

  setMode("focus");
}

pomodoroTimer();

const dayTime = document.querySelector(".header1 h1");
const dateHeader = document.querySelector(".header1 h2");
const tempHeader = document.querySelector(".header2 h2");
const weatherHeader = document.querySelector(".header2 h4");
const precipitation = document.querySelector(".header2 h3:nth-of-type(1) span");
const humidity = document.querySelector(".header2 h3:nth-of-type(2) span");
const wind = document.querySelector(".header2 h3:nth-of-type(3) span");

const API_KEY = `24ba7b0d37590bfc9142b55a5d98e72a`;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

async function getWeather(city) {
  const query = `q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  try {
    const [current, forecast] = await Promise.all([
      fetchJSON(`${BASE_URL}/weather?${query}`),
      fetchJSON(`${BASE_URL}/forecast?${query}&cnt=1`), // only the next 3-hour step
    ]);

    const chanceOfRain = Math.round((forecast.list[0].pop ?? 0) * 100);

    tempHeader.textContent = `${Math.round(current.main.temp)} \u00B0C`;
    weatherHeader.textContent = current.weather[0].main;
    precipitation.textContent = `${chanceOfRain}%`;
    humidity.textContent = `${current.main.humidity}%`;
    wind.textContent = `${Math.round(current.wind.speed * 3.6)} Km/h`;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    weatherHeader.textContent = "Weather unavailable";
  }
}

getWeather("Delhi");

function getTime() {
  const now = new Date();

  const day = now.toLocaleDateString("en-IN", { 
    weekday: "long",
   });

  const time = now
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();

  const date = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  dayTime.textContent = `${day}, ${time}`;
  dateHeader.textContent = date;
}

getTime();
setInterval(getTime, 1000);