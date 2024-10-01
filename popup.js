document.getElementById('add-task-btn').addEventListener('click', function () {
    const taskInput = document.getElementById('task-input').value;
    const deadlineInput = document.getElementById('task-deadline').value; // Lấy thời gian từ input
    if (taskInput) {
        const task = {
            text: taskInput,
            completed: false,
            deadline: deadlineInput ? new Date(deadlineInput).getTime() : null, // Lưu thời gian
            timer: null // Biến để lưu timer
        };
        addTaskElement(task);
        saveTaskToStorage(task); // Lưu task vào storage
        document.getElementById('task-input').value = '';
        document.getElementById('task-deadline').value = ''; // Reset thời gian
    }
});

function addTaskElement(task) {
    const tasksContainer = document.getElementById('tasks');
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    const label = document.createElement('label');
    label.textContent = task.text;

    // Hiển thị deadline
    if (task.deadline) {
        const deadlineLabel = document.createElement('span');
        deadlineLabel.textContent = ` (Deadline: ${new Date(task.deadline).toLocaleString()})`; // Hiển thị thời gian
        deadlineLabel.style.marginLeft = '10px';
        taskDiv.appendChild(deadlineLabel);
    }

    const timerLabel = document.createElement('span');
    timerLabel.className = 'timer';
    timerLabel.style.marginLeft = '10px';
    taskDiv.appendChild(timerLabel); // Vùng hiển thị thời gian đếm ngược

    // Tự động bắt đầu countdown khi thêm task
    startCountdown(task, timerLabel);

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

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () {
        taskDiv.classList.add('hide');
        setTimeout(() => {
            tasksContainer.removeChild(taskDiv);
            deleteTaskFromStorage(task.text);
        }, 300);
    });

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(label);
    taskDiv.appendChild(timerLabel);
    taskDiv.appendChild(deleteBtn);
    tasksContainer.appendChild(taskDiv);

    setTimeout(() => {
        taskDiv.classList.add('show');
    }, 10);
}

function startCountdown(task, timerLabel) {
    if (task.timer) clearInterval(task.timer); // Dừng timer cũ nếu có

    const countdownTime = task.deadline ? task.deadline - Date.now() : 0;

    if (countdownTime > 0) {
        timerLabel.textContent = formatTime(countdownTime); // Hiển thị thời gian ban đầu

        task.timer = setInterval(() => {
            const timeLeft = task.deadline - Date.now();
            if (timeLeft <= 0) {
                clearInterval(task.timer);
                timerLabel.textContent = "Hết thời gian!";
                task.completed = true; // Đánh dấu task hoàn thành
                updateTaskInStorage(task.text, task.completed);
                return;
            }
            timerLabel.textContent = formatTime(timeLeft);
        }, 1000);
    } else {
        timerLabel.textContent = "Không có thời gian!";
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveTaskToStorage(task) {
    // Lưu task vào localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText) {
            task.completed = completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
