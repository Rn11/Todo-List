// load the to-do items from localStorage
let todoItems = JSON.parse(localStorage.getItem("todos")) || [];

// select elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

// render items on page load without animating last item
renderTodoItems(false);

// listen for submission
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
        // create a new to-do item and add it to the array, use epoch timestamp as data id
        const todoItem = {
            id: Date.now(),
            text: todoText,
            completed: false
        };
        todoItems.push(todoItem);

        // save updated array to localStorage
        localStorage.setItem("todos", JSON.stringify(todoItems));

        // clear input field and re-render items
        todoInput.value = "";
        renderTodoItems(true);
    }
});

// listen for click events on the list
todoList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const todoId = event.target.parentElement.getAttribute("data-id");
        deleteTodoItem(todoId);
    } else if (event.target.classList.contains("todo-text")) {
        const todoId = event.target.parentElement.getAttribute("data-id");
        editTodoItem(todoId);
    } else if (event.target.classList.contains("checkbox-input")) {
        const todoId = event.target.parentElement.getAttribute("data-id");
        toggleCompleted(todoId);
    }
});

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
            element.parentNode.removeChild(element);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'flex';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 50);
}

// render items
function renderTodoItems(animateItem) {
    let i = 0;
    // clear existing items from the list
    todoList.innerHTML = "";

    // render items by attaching elements to li element and adding li element
    todoItems.forEach((todoItem) => {
        const li = document.createElement("li");
        li.setAttribute("data-id", todoItem.id);

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("class", "checkbox-input");
        checkbox.checked = todoItem.completed;

        const todoText = document.createElement("span");
        todoText.setAttribute("class", "todo-text");
        todoText.textContent = todoItem.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("class", "delete-btn");
        deleteBtn.textContent = "Delete";

        li.appendChild(checkbox);
        li.appendChild(todoText);
        li.appendChild(deleteBtn);

        if (animateItem) {
            if (todoItems.length - 1 === i || todoItems.length === 0) {
                // execute last item logic    
                li.style.opacity = "0.0";
                todoList.appendChild(li);
                unfade(todoList.lastChild)
            }
        }
        todoList.appendChild(li);

        i++;
    });
}

// delete an item by id
function deleteTodoItem(todoId) {
    fade(document.querySelectorAll('[data-id="' + todoId + '"]')[0]);
    setTimeout(2000);
    todoItems = todoItems.filter((todoItem) => todoItem.id !== parseInt(todoId));
    localStorage.setItem("todos", JSON.stringify(todoItems));
}

// edit an item
function editTodoItem(todoId) {
    const todoItem = todoItems.find((todoItem) => todoItem.id === parseInt(todoId));
    const todoText = prompt("Edit this entry", todoItem.text);
    if (todoText !== null && todoText !== "") {
        todoItem.text = todoText;
        localStorage.setItem("todos", JSON.stringify(todoItems));
        renderTodoItems(false);
    }
}

function toggleCompleted(todoId) {
    const todoItem = todoItems.find((todoItem) => todoItem.id === parseInt(todoId));
    todoItem.completed = !todoItem.completed;
    localStorage.setItem("todos", JSON.stringify(todoItems));
    renderTodoItems(false);
}