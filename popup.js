document.addEventListener('DOMContentLoaded', function () {
    const tasksContainer = document.getElementById('tasks');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const audioadd = document.getElementById('sound-add-task');
    const audiodel = document.getElementById('sound-delete-task');
    const audioAatroxR = document.getElementById('sound-ultimate');
    chrome.storage.local.get('tasks', function (result) {
        const tasks = result.tasks || [];
        tasks.forEach(task => {
            addTaskElement(task);
        });
    });

    addTaskBtn.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, completed: false };
            addTaskElement(task);   
            audioadd.play().catch(error => {
                console.error('Lỗi phát âm thanh:', error);
              });
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
        checkbox.classList.add('custom-checkbox');
    
        const label = document.createElement('label');
        label.classList.add('task-label');
    
        task.text.split('').forEach(letter => {
            const span = document.createElement('span');
            span.classList.add('broken-letter'); 
    
            if (letter === ' ') {
                span.innerHTML = '&nbsp;'; 
                span.style.display = 'inline-block'; 
            } else {
                span.textContent = letter;
            }
    
            label.appendChild(span);
        });
    
        if (task.completed) {
            label.classList.add('strikethrough'); 
            const letters = label.querySelectorAll('.broken-letter');
            letters.forEach(letter => {
                letter.classList.add('broken'); 
            });
        }
    
        checkbox.addEventListener('change', function () {
            task.completed = checkbox.checked;
            const letters = label.querySelectorAll('.broken-letter');
    
            if (task.completed) {
                label.classList.add('strikethrough'); 
                letters.forEach((letter, index) => {
                    letter.classList.remove('recover');
                    setTimeout(() => {
                        letter.classList.add('broken'); 
                    }, index * 50);
                });
            } else {
                label.classList.remove('strikethrough'); 
                letters.forEach((letter, index) => {
                    letter.classList.remove('broken');
                    setTimeout(() => {
                        letter.classList.add('recover');
                    }, index * 50);
                });
            }
    
            updateTaskInStorage(task.text, task.completed);
        });
    
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '💢';
        deleteBtn.classList.add('delStyleButton');
        deleteBtn.addEventListener('click', function () {
            audiodel.play().catch(error => {
                console.error('Lỗi phát âm thanh:', error);
            });
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

const cooldownTimes = {
    'skill-Q': 1000, 
    'skill-W': 7000,
    'skill-E': 5000, 
    'skill-R': 30000 
};

function activateCooldown(button) {
    const cooldownTime = cooldownTimes[button.id]; 
    let remainingTime = cooldownTime / 1000; 

    button.classList.add('active');

    button.disabled = true;

    const interval = setInterval(() => {
        remainingTime -= 0.1; 
        button.textContent = remainingTime.toFixed(1); 

        if (remainingTime <= 0) {
            clearInterval(interval);
            button.classList.remove('active');
            button.disabled = false;
            button.textContent = button.id.split('-')[1]; 
        }
    }, 100);
}

document.getElementById('skill-Q').addEventListener('click', function() {
    activateCooldown(this);
});
document.getElementById('skill-W').addEventListener('click', function() {
    activateCooldown(this);
});
document.getElementById('skill-E').addEventListener('click', function() {
    activateCooldown(this);
});
    // Định nghĩa thời gian hồi chiêu cho từng nút
document.getElementById('skill-R').addEventListener('click', function() {
    const overlayImage = document.getElementById('overlayImage');
    audioAatroxR.play().catch(error => {
        console.error('Lỗi phát âm thanh:', error);
      });
            overlayImage.style.display = 'block';
        setTimeout(function() {
        overlayImage.style.display = 'none';
    }, 5000);
    activateCooldown(this);
});
});
