const savedTasks = localStorage.getItem("tasks");

const tasks = savedTasks ? JSON.parse(savedTasks) : [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("sortType", sortSelect.value);
}


const main = document.createElement("main");
document.body.append(main);

const header = document.createElement("header");
main.append(header);

const title = document.createElement("h1");
title.textContent = "To-Do List";
header.append(title);

const description = document.createElement("p");

description.textContent = "Управляй своими задачами легко и удобно";

header.append(description);

//форма
const form = document.createElement("form");

main.append(form);

//таск
const taskInput = document.createElement("input");

taskInput.type = "text";
taskInput.placeholder = "Введите задачу";
taskInput.required = true;

form.append(taskInput);

//дата
const dateInput = document.createElement("input");

dateInput.type = "date";
dateInput.required = true;

form.append(dateInput);

//добавить таск
const addButton = document.createElement("button");

addButton.type = "submit";
addButton.textContent = "Добавить задачу";

form.append(addButton);

//управление списком
const controlsSection = document.createElement("section");
main.append(controlsSection);

const controlsTitle = document.createElement("h2");
controlsTitle.textContent = "Управление задачами";

controlsSection.append(controlsTitle);

const searchInput = document.createElement("input");

searchInput.type = "search";
searchInput.placeholder = "Поиск по названию";

controlsSection.append(searchInput);

const filterSelect = document.createElement("select");

controlsSection.append(filterSelect);

const allOption = document.createElement("option");

allOption.value = "all";
allOption.textContent = "Все задачи";

filterSelect.append(allOption);

const activeOption = document.createElement("option");

activeOption.value = "active";
activeOption.textContent = "Активные";

filterSelect.append(activeOption);

const completedOption = document.createElement("option");

completedOption.value = "completed";
completedOption.textContent = "Выполненные";

filterSelect.append(completedOption);

//сортировка
const sortSelect = document.createElement("select");


controlsSection.append(sortSelect);
const newestOption = document.createElement("option");

newestOption.value = "newest";
newestOption.textContent = "Сначала новые";

sortSelect.append(newestOption);

const oldestOption = document.createElement("option");
const manualOption = document.createElement("option");

manualOption.value = "manual";
manualOption.textContent = "Мой порядок";

sortSelect.append(manualOption);
const savedSortType = localStorage.getItem("sortType");

if (savedSortType) {
    sortSelect.value = savedSortType;
}

oldestOption.value = "oldest";
oldestOption.textContent = "Сначала старые";

sortSelect.append(oldestOption);

//список задач
const taskSection = document.createElement("section");
main.append(taskSection);

const taskTitle = document.createElement("h2");
taskTitle.textContent = "Мои задачи";

taskSection.append(taskTitle);

const taskList = document.createElement("ul");

taskSection.append(taskList);

//добавляем задачи
function renderTasks() {
    taskList.replaceChildren();


    const searchText = searchInput.value.trim().toLowerCase();

    const status = filterSelect.value;

    const filteredTasks = tasks.filter(function(task) {
        const matchesSearch = task.title.toLowerCase().includes(searchText);

        const matchesStatus =
            status === "all" ||
            (status === "active" && !task.completed) ||
            (status === "completed" && task.completed);

        return matchesSearch && matchesStatus;
    });

    const sortedTasks = filteredTasks.slice();

    if (sortSelect.value !== "manual") {
        sortedTasks.sort(function(a, b) {
            if (sortSelect.value === "newest") {
                return b.date.localeCompare(a.date);
            }

            return a.date.localeCompare(b.date);
        });
    }

    sortedTasks.forEach(function(task) {
        const taskItem = document.createElement("li");
        taskItem.draggable = true;

        taskItem.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text/plain", String(task.id));
            event.dataTransfer.effectAllowed = "move";
        });

        taskItem.addEventListener("dragover", function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        taskItem.addEventListener("drop", function(event) {
            event.preventDefault();

            const draggedId = Number(
                event.dataTransfer.getData("text/plain")
            );

            if (draggedId === task.id) {
                return;
            }

            const draggedIndex = tasks.findIndex(function(item) {
                return item.id === draggedId;
            });

            const targetIndex = tasks.findIndex(function(item) {
                return item.id === task.id;
            });

            if (draggedIndex === -1 || targetIndex === -1) {
                return;
            }

            const targetRect = taskItem.getBoundingClientRect();
            const cursorY = event.clientY;
            const targetMiddle = targetRect.top + targetRect.height / 2;

            const insertAfter = cursorY > targetMiddle;

            const draggedTask = tasks.splice(draggedIndex, 1)[0];

            let newTargetIndex = tasks.findIndex(function(item) {
                return item.id === task.id;
            });

            if (insertAfter) {
                newTargetIndex++;
            }

            tasks.splice(newTargetIndex, 0, draggedTask);

            sortSelect.value = "manual";

            saveTasks();
            renderTasks();
        });

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.textContent = task.title;

        const taskDate = document.createElement("time");
        taskDate.textContent = task.date;
        taskDate.dateTime = task.date;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Удалить";

        deleteButton.addEventListener("click", function() {
            const index = tasks.findIndex(function(item) {
                return item.id === task.id;
            });

            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
            }

            renderTasks();
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Редактировать";

        editButton.addEventListener("click", function() {
            if (taskItem.querySelector(".edit-input")) {
                return;
            }

            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = task.title;
            editInput.classList.add("edit-input");

            const editDateInput = document.createElement("input");
            editDateInput.type = "date";
            editDateInput.value = task.date;

            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.textContent = "Сохранить";

            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.textContent = "Отмена";

            taskItem.append(
                editInput,
                editDateInput,
                saveButton,
                cancelButton
            );

            editInput.focus();

            saveButton.addEventListener("click", function() {
                const newTitle = editInput.value.trim();
                const newDate = editDateInput.value;

                if (newTitle === "" || newDate === "") {
                    return;
                }

                task.title = newTitle;
                task.date = newDate;
                saveTasks();
                renderTasks();
            });

            cancelButton.addEventListener("click", function() {
                renderTasks();
            });
        });
       
        taskItem.append(
            checkbox,
            taskText,
            taskDate,
            editButton,
            deleteButton
        );

        taskList.append(taskItem);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();
    const date = dateInput.value;

    if (title === "") {
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        date: date,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    form.reset();
});

renderTasks();

searchInput.addEventListener("input", function() {
    renderTasks();
});

filterSelect.addEventListener("change", function() {
    renderTasks();
});

sortSelect.addEventListener("change", function() {
    localStorage.setItem("sortType", sortSelect.value);
    renderTasks();
});