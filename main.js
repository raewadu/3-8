let tasks = [];
let searchValue = "";
let filterValue = "all";

const inputCreateElement = document.querySelector("#todo-input");
const buttonCreateElement = document.querySelector("#todo-form button");
const listElement = document.querySelector("#todo-list");
const searchElement = document.querySelector("#search");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggleButton = document.querySelector("#theme-toggle");
let savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  document.body.classList.add("dark");
  localStorage.setItem("theme", "dark");
} else if (savedTheme === "dark") {
  document.body.classList.add("dark");
} else {
  document.body.classList.remove("dark");
} 

themeToggleButton.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
});


  


if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

const renderElements = () => {
  inputCreateElement.value = "";
  listElement.innerHTML = "";

  let customedTasks = [...tasks];

  customedTasks = customedTasks.filter((task) =>
    task.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  customedTasks = customedTasks.filter((task) => {
    if (filterValue === "all") return true;
    else if (filterValue === "active") return !task.isCompleted;
    else if (filterValue === "completed") return task.isCompleted;
  });

  customedTasks.forEach((task, index) => {
    const liElement = document.createElement("li");
    listElement.append(liElement);

    const checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    liElement.append(checkboxElement);

    const spanElement = document.createElement("span");
    spanElement.innerText = task.name;
    liElement.append(spanElement);

    const buttonDeleteElement = document.createElement("button");
    buttonDeleteElement.innerText = "x";
    liElement.append(buttonDeleteElement);

    buttonDeleteElement.addEventListener("click", () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderElements();
    });

    if (task.isCompleted) {
      liElement.classList.add("completed");
      checkboxElement.checked = true;
    }

    checkboxElement.addEventListener("change", (event) => {
      task.isCompleted = event.target.checked;
      liElement.classList.toggle("completed");
      localStorage.setItem("tasks", JSON.stringify(tasks));

      if (event.target.checked) {
        alert("Задача '" + spanElement.innerText + "' успешно выполнена!");
      }
    });
  });
};

buttonCreateElement.addEventListener("click", (e) => {
  e.preventDefault();

  if (!inputCreateElement.value.trim()) return;

  tasks.push({
    name: inputCreateElement.value,
    isCompleted: false,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderElements();
});

searchElement.addEventListener("input", (e) => {
  searchValue = e.target.value;
  renderElements();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    filterValue = button.dataset.filter;
    renderElements();
  });
});

renderElements();
renderTheme();