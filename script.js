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