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
