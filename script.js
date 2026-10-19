function showFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem");
  let fullElemPageBackButton = document.querySelectorAll(".back-button");

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

let form = document.querySelector(".addTask form");
let taskInput = document.querySelector(".addTask form #task-input");
let taskDetailsInput = document.querySelector(".addTask form textarea");
let taskCheckbox = document.querySelector(".addTask form #check");

let currentTask = [];

if (localStorage.getItem("currentTask")) {
  currentTask = JSON.parse(localStorage.getItem("currentTask"));
} else {
  console.log("Task list is empty");
}

function showTasks() {
  let allTask = document.querySelector(".todo-container .allTask");

  let sum = "";

  currentTask.forEach(function (elem) {
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

            <button>Mark as Completed</button>
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

  taskInput.value = "";
  taskDetailsInput.value = "";
  taskCheckbox.checked = false;
  showTasks();
});
