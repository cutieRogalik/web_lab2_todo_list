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

const form = document.createElement("form");
main.append(form);

const taskInput = document.createElement("input");
taskInput.type = "text";
taskInput.placeholder = "Введите задачу";
taskInput.required = true;
form.append(taskInput);

const dateInput = document.createElement("input");
dateInput.type = "date";
dateInput.required = true;
form.append(dateInput);

const addButton = document.createElement("button");
addButton.type = "submit";
addButton.textContent = "Добавить задачу";
addButton.setAttribute("aria-label", "Добавить задачу");
form.append(addButton);

const controlsSection = document.createElement("section");
main.append(controlsSection);

const controlsTitle = document.createElement("h2");
controlsTitle.textContent = "Управление задачами";
controlsSection.append(controlsTitle);

const searchInput = document.createElement("input");
searchInput.type = "search";
searchInput.placeholder = "Поиск по названию";
searchInput.setAttribute("aria-label", "Поиск по названию");
controlsSection.append(searchInput);

const filterSelect = document.createElement("select");
filterSelect.setAttribute("aria-label", "Фильтр задач");
controlsSection.append(filterSelect);

const filterOptions = [
    ["all", "Все задачи"],
    ["active", "Активные"],
    ["completed", "Выполненные"]
];

filterOptions.forEach(function (optionData) {
    const option = document.createElement("option");
    option.value = optionData[0];
    option.textContent = optionData[1];
    filterSelect.append(option);
});

const sortSelect = document.createElement("select");
sortSelect.setAttribute("aria-label", "Сортировка задач");
controlsSection.append(sortSelect);

const sortOptions = [
    ["newest", "Сначала новые"],
    ["oldest", "Сначала старые"],
    ["manual", "Мой порядок"]
];

sortOptions.forEach(function (optionData) {
    const option = document.createElement("option");
    option.value = optionData[0];
    option.textContent = optionData[1];
    sortSelect.append(option);
});

const savedSortType = localStorage.getItem("sortType");

if (sortOptions.some(function (option) {
    return option[0] === savedSortType;
})) {
    sortSelect.value = savedSortType;
}

const taskSection = document.createElement("section");
main.append(taskSection);

const taskTitle = document.createElement("h2");
taskTitle.textContent = "Мои задачи";
taskSection.append(taskTitle);

const taskList = document.createElement("ul");
taskList.id = "task-list";
taskSection.append(taskList);

function renderTasks() {
    taskList.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();
    const status = filterSelect.value;

    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
            status === "all" ||
            (status === "active" && !task.completed) ||
            (status === "completed" && task.completed);

        return matchesSearch && matchesStatus;
    });

    const sortedTasks = filteredTasks.slice();

    if (sortSelect.value !== "manual") {
        sortedTasks.sort(function (a, b) {
            if (sortSelect.value === "newest") {
                return b.date.localeCompare(a.date);
            }

            return a.date.localeCompare(b.date);
        });
    }

    sortedTasks.forEach(function (task) {
        const taskItem = document.createElement("li");
        taskItem.draggable = true;

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskItem.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", String(task.id));
            event.dataTransfer.effectAllowed = "move";
        });

        taskItem.addEventListener("dragover", function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        taskItem.addEventListener("drop", function (event) {
            event.preventDefault();

            const draggedId = Number(
                event.dataTransfer.getData("text/plain")
            );

            if (draggedId === task.id) {
                return;
            }

            const draggedIndex = tasks.findIndex(function (item) {
                return item.id === draggedId;
            });

            const targetIndex = tasks.findIndex(function (item) {
                return item.id === task.id;
            });

            if (draggedIndex === -1 || targetIndex === -1) {
                return;
            }

            const targetRect = taskItem.getBoundingClientRect();
            const targetMiddle = targetRect.top + targetRect.height / 2;
            const insertAfter = event.clientY > targetMiddle;

            const draggedTask = tasks.splice(draggedIndex, 1)[0];

            let newTargetIndex = tasks.findIndex(function (item) {
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

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Отметить выполнение");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.title;

        const taskDate = document.createElement("time");
        const dateParts = task.date.split("-");
        taskDate.textContent =
            dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
        taskDate.dateTime = task.date;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Редактировать";
        editButton.classList.add("edit-button");
        editButton.setAttribute("aria-label", "Редактировать задачу");

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-button");
        deleteButton.setAttribute("aria-label", "Удалить задачу");

        deleteButton.addEventListener("click", function () {
            const index = tasks.findIndex(function (item) {
                return item.id === task.id;
            });

            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
            }

            renderTasks();
        });

        editButton.addEventListener("click", function () {
            if (taskItem.querySelector(".edit-controls")) {
                return;
            }

            taskItem.classList.add("editing");

            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = task.title;
            editInput.classList.add("edit-input");
            editInput.placeholder = "Название задачи";
            editInput.required = true;

            const editDateInput = document.createElement("input");
            editDateInput.type = "date";
            editDateInput.value = task.date;
            editDateInput.required = true;

            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.textContent = "Сохранить";
            saveButton.classList.add("save-edit-button");

            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.textContent = "Отмена";
            cancelButton.classList.add("cancel-edit-button");

            const editControls = document.createElement("div");
            editControls.classList.add("edit-controls");

            editControls.append(
                editInput,
                editDateInput,
                saveButton,
                cancelButton
            );

            taskItem.append(editControls);
            editInput.focus();

            saveButton.addEventListener("click", function () {
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

            cancelButton.addEventListener("click", function () {
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

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();
    const date = dateInput.value;

    if (title === "" || date === "") {
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

searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

sortSelect.addEventListener("change", function () {
    localStorage.setItem("sortType", sortSelect.value);
    renderTasks();
});

renderTasks();
