import './style.css'

let tasks = [];
let taskId = 1;
let currentFilter = 'all';

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        taskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }
}

function setupEventListeners() {
    document.getElementById('addBtn').onclick = addTask;

    const filterButtons = document.querySelectorAll('.filter-btn');

    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].onclick = function() {
            filterTasks(this.getAttribute('data-filter'));
        };
    }

    document.getElementById('taskInput').onkeypress = function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    };
}

window.onload = function() {
    loadTasks();
    setupEventListeners();  
    renderTasks();
    updateStats();
};

function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function refreshUI(){
    saveTasks();
    renderTasks();
    updateStats();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === ''){
        alert('Por favor escribe una tarea');
        return;
    }
    

    let newTask = {
        id: taskId++,
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    taskInput.value = '';
    
    refreshUI();
}

function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function createTaskElement(task){
    const taskDiv = document.createElement('div');
    taskDiv.className = task.completed ? 'task-item completed' : 'task-item';

    taskDiv.innerHTML = `
        <span>${task.text}</span>
        <div class="task-buttons">
            <button class="complete-btn" data-id="${task.id}">
                ${task.completed ? 'Reactivar' : 'Completar'}
            </button>
            <button class="delete-btn" data-id="${task.id}">Eliminar</button>
        </div>
    `;

    const completeBtn = taskDiv.querySelector('.complete-btn');
    const deleteBtn = taskDiv.querySelector('.delete-btn');

    completeBtn.onclick = function () {
        toggleTask(task.id);
    };

    deleteBtn.onclick = function () {
        deleteTask(task.id);
    };

    return taskDiv;

}

function renderTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 

    const filteredTasks = getFilteredTasks();
    
    for (let i = 0; i < filteredTasks.length; i++) {
        const task = filteredTasks[i];
        taskList.appendChild(createTaskElement(task));
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay tareas para mostrar</p>';
    }
}

function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    
    refreshUI();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    refreshUI();
}

function filterTasks(filter) {
    currentFilter = filter;
    
    let buttons = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    if (filter === 'all') {
        buttons[0].classList.add('active');
    } else if (filter === 'active') {
        buttons[1].classList.add('active');
    } else {
        buttons[2].classList.add('active');
    }
    
    renderTasks();
}

function updateStats(){

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const active = total - completed;

    document.getElementById('stats').innerHTML =
    `Total: ${total} | Completadas: ${completed} | Activas: ${active}`;
}