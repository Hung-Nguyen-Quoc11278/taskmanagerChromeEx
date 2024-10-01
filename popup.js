document.addEventListener('DOMContentLoaded', function () {
    const tasksContainer = document.getElementById('tasks');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');

    // Load tasks from local storage
    chrome.storage.local.get('tasks', function (result) {
        const tasks = result.tasks || [];
        tasks.forEach(task => {
            addTaskElement(task);
        });
    });

    // Add task
    addTaskBtn.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, completed: false };
            addTaskElement(task);

            // Save task to local storage
            chrome.storage.local.get('tasks', function (result) {
                const tasks = result.tasks || [];
                tasks.push(task);
                chrome.storage.local.set({ tasks: tasks });
            });

            newTaskInput.value = '';
        }
    });

    function addTaskElement(task) {
        const taskDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        const label = document.createElement('label');
        label.textContent = task.text;
        if (task.completed) {
            label.classList.add('strikethrough');
        }

        checkbox.addEventListener('change', function () {
            task.completed = checkbox.checked;
            if (task.completed) {
                label.classList.add('strikethrough');
            } else {
                label.classList.remove('strikethrough');
            }
            updateTaskInStorage(task.text, task.completed);
        });

        // Thêm nút xóa
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            tasksContainer.removeChild(taskDiv);
            deleteTaskFromStorage(task.text);
        });

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        taskDiv.appendChild(deleteBtn);
        tasksContainer.appendChild(taskDiv);
    }

    function updateTaskInStorage(taskText, completed) {
        chrome.storage.local.get('tasks', function (result) {
            const tasks = result.tasks || [];
            const task = tasks.find(t => t.text === taskText);
            if (task) {
                task.completed = completed;
                chrome.storage.local.set({ tasks: tasks });
            }
        });
    }

    function deleteTaskFromStorage(taskText) {
        chrome.storage.local.get('tasks', function (result) {
            let tasks = result.tasks || [];
            tasks = tasks.filter(t => t.text !== taskText);
            chrome.storage.local.set({ tasks: tasks });
        });
    }
});
