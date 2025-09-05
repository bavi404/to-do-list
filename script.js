// To-Do List Application
// Main application class to manage all functionality
class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 0;
        this.points = 0;
        this.moodLevel = 5; // 1-10 scale, 5 is neutral
        this.initializeElements();
        this.loadTasks();
        this.bindEvents();
        this.renderTasks();
        this.applySavedTheme();
        this.startDeadlineChecker();
    }

    // Initialize DOM elements
    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.statTotal = document.getElementById('statTotal');
        this.statCompleted = document.getElementById('statCompleted');
        this.statRemaining = document.getElementById('statRemaining');
        this.deadlineInput = document.getElementById('deadlineInput');
        this.moodFace = document.getElementById('moodFace');
        this.moodMessage = document.getElementById('moodMessage');
        this.pointsDisplay = document.getElementById('pointsDisplay');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.themeSelector = document.getElementById('themeSelector');
    }

    // Bind event listeners
    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Event delegation for task actions
        this.taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = parseInt(taskItem.dataset.taskId);

            if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(taskId);
            } else if (e.target.classList.contains('complete-btn') || e.target.classList.contains('task-checkbox')) {
                this.toggleTaskComplete(taskId);
            }
        });

        // Theme selector
        if (this.themeSelector) {
            this.themeSelector.addEventListener('change', (e) => this.changeTheme(e.target.value));
        }

        // Bulk actions
        if (this.clearCompletedBtn) {
            this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        }
        if (this.clearAllBtn) {
            this.clearAllBtn.addEventListener('click', () => this.clearAll());
        }
    }

    // Add a new task
    addTask() {
        const taskText = this.taskInput.value.trim();
        const deadline = this.deadlineInput.value;
        
        // Prevent adding empty tasks
        if (!taskText) {
            this.showInputError();
            return;
        }

        // Create new task object
        const newTask = {
            id: this.taskIdCounter++,
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            deadline: deadline || null,
            points: 10 // Base points for completing a task
        };

        // Add task to array
        this.tasks.push(newTask);
        
        // Clear inputs and save
        this.taskInput.value = '';
        this.deadlineInput.value = '';
        this.saveTasks();
        this.renderTasks();
        this.updateProgress();
        
        // Focus back to input for better UX
        this.taskInput.focus();
    }

    // Toggle task completion status
    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const wasCompleted = task.completed;
            task.completed = !task.completed;
            
            // Award or remove points
            if (task.completed && !wasCompleted) {
                this.awardPoints(task);
            } else if (!task.completed && wasCompleted) {
                this.removePoints(task);
            }
            
            this.saveTasks();
            this.renderTasks();
            this.updateProgress();
        }
    }

    // Delete a task
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            // Add animation class before removing
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.classList.add('removing');
                
                // Remove from array and DOM after animation
                setTimeout(() => {
                    this.tasks.splice(taskIndex, 1);
                    this.saveTasks();
                    this.renderTasks();
                }, 300);
            } else {
                // Fallback if element not found
                this.tasks.splice(taskIndex, 1);
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    // Render all tasks to the DOM
    renderTasks() {
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = `
                <li class="empty-state">
                    <h3>No tasks yet</h3>
                    <p>Add a task above to get started!</p>
                </li>
            `;
            this.updateStats();
            return;
        }

        this.taskList.innerHTML = this.tasks.map(task => this.createTaskHTML(task)).join('');
        this.updateStats();
    }

    // Create HTML for a single task
    createTaskHTML(task) {
        const completedClass = task.completed ? 'completed' : '';
        const completedText = task.completed ? 'Undo' : 'Complete';
        const deadlineClass = this.getDeadlineClass(task);
        const deadlineHTML = task.deadline ? this.formatDeadline(task.deadline) : '';
        
        return `
            <li class="task-item ${completedClass} ${deadlineClass}" data-task-id="${task.id}">
                <div class="task-content">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        aria-label="Mark task as complete"
                    >
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    ${deadlineHTML}
                </div>
                <div class="task-actions">
                    <button class="complete-btn ${task.completed ? 'completed' : ''}" 
                            type="button" 
                            aria-label="${completedText} task">
                        ${completedText}
                    </button>
                    <button class="delete-btn" 
                            type="button" 
                            aria-label="Delete task">
                        Delete
                    </button>
                </div>
            </li>
        `;
    }

    // Show input error feedback
    showInputError() {
        this.taskInput.style.borderColor = '#dc3545';
        this.taskInput.placeholder = 'Please enter a task...';
        
        // Reset after 2 seconds
        setTimeout(() => {
            this.taskInput.style.borderColor = '#e1e5e9';
            this.taskInput.placeholder = 'Add a new task...';
        }, 2000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Save tasks to localStorage
    saveTasks() {
        try {
            const tasksData = {
                tasks: this.tasks,
                nextId: this.taskIdCounter,
                points: this.points,
                moodLevel: this.moodLevel
            };
            localStorage.setItem('todoAppData', JSON.stringify(tasksData));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }

    // Load tasks from localStorage
    loadTasks() {
        try {
            const savedData = localStorage.getItem('todoAppData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.tasks = data.tasks || [];
                this.taskIdCounter = data.nextId || 0;
                this.points = data.points || 0;
                this.moodLevel = data.moodLevel || 5;
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.tasks = [];
            this.taskIdCounter = 0;
            this.points = 0;
            this.moodLevel = 5;
        }
    }

    // Get task statistics (bonus feature)
    getTaskStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;
        
        return { total, completed, remaining };
    }

    // Update stat UI
    updateStats() {
        const { total, completed, remaining } = this.getTaskStats();
        if (this.statTotal) this.statTotal.textContent = total;
        if (this.statCompleted) this.statCompleted.textContent = completed;
        if (this.statRemaining) this.statRemaining.textContent = remaining;
    }

    // Update progress and mood
    updateProgress() {
        const { total, completed } = this.getTaskStats();
        const progress = total > 0 ? (completed / total) * 100 : 0;
        
        // Update progress bar
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${Math.round(progress)}%`;
        }
        
        // Update mood based on progress
        this.updateMood(progress);
        
        // Update points display
        if (this.pointsDisplay) {
            this.pointsDisplay.textContent = this.points;
        }
    }

    // Update mood face and message
    updateMood(progress) {
        let face, message, animation;
        
        if (progress === 0) {
            face = '😴';
            message = 'Ready to start?';
            animation = 'bounce';
        } else if (progress < 25) {
            face = '😐';
            message = 'Getting started...';
            animation = 'bounce';
        } else if (progress < 50) {
            face = '😊';
            message = 'Making progress!';
            animation = 'bounce';
        } else if (progress < 75) {
            face = '😄';
            message = 'You\'re on fire!';
            animation = 'happyDance';
        } else if (progress < 100) {
            face = '🤩';
            message = 'Almost there!';
            animation = 'happyDance';
        } else {
            face = '🎉';
            message = 'Perfect! All done!';
            animation = 'happyDance';
        }
        
        // Apply mood changes
        if (this.moodFace) {
            this.moodFace.textContent = face;
            this.moodFace.className = `mood-face ${animation}`;
        }
        if (this.moodMessage) {
            this.moodMessage.textContent = message;
        }
    }

    // Award points for completing a task
    awardPoints(task) {
        let points = task.points || 10;
        
        // Bonus for completing before deadline
        if (task.deadline && !this.isOverdue(task.deadline)) {
            points += 5; // Bonus points
        }
        
        this.points += points;
        this.showPointsAnimation(points);
    }

    // Remove points when uncompleting a task
    removePoints(task) {
        const points = task.points || 10;
        this.points = Math.max(0, this.points - points);
    }

    // Show points animation
    showPointsAnimation(points) {
        // Create floating points animation
        const animation = document.createElement('div');
        animation.textContent = `+${points}`;
        animation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #22c55e;
            font-weight: bold;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
        
        document.body.appendChild(animation);
        setTimeout(() => animation.remove(), 1000);
    }

    // Check if deadline is overdue
    isOverdue(deadline) {
        return new Date(deadline) < new Date();
    }

    // Get deadline class for styling
    getDeadlineClass(task) {
        if (!task.deadline || task.completed) return '';
        
        const deadline = new Date(task.deadline);
        const now = new Date();
        const diffHours = (deadline - now) / (1000 * 60 * 60);
        
        if (diffHours < 0) return 'overdue';
        if (diffHours < 24) return 'due-soon';
        return '';
    }

    // Format deadline for display
    formatDeadline(deadline) {
        const date = new Date(deadline);
        const now = new Date();
        const diffHours = (date - now) / (1000 * 60 * 60);
        
        let text;
        if (diffHours < 0) {
            text = `Overdue by ${Math.abs(Math.round(diffHours))}h`;
        } else if (diffHours < 1) {
            text = `Due in ${Math.round(diffHours * 60)}m`;
        } else if (diffHours < 24) {
            text = `Due in ${Math.round(diffHours)}h`;
        } else {
            text = `Due ${date.toLocaleDateString()}`;
        }
        
        const className = this.getDeadlineClass({ deadline, completed: false });
        return `<span class="task-deadline ${className}">${text}</span>`;
    }

    // Start deadline checker
    startDeadlineChecker() {
        // Check for overdue tasks every minute
        setInterval(() => {
            this.checkOverdueTasks();
        }, 60000);
    }

    // Check for overdue tasks and apply penalties
    checkOverdueTasks() {
        const overdueTasks = this.tasks.filter(task => 
            task.deadline && !task.completed && this.isOverdue(task.deadline)
        );
        
        overdueTasks.forEach(task => {
            // Apply penalty points
            this.points = Math.max(0, this.points - 5);
            
            // Update mood to be sadder
            this.moodLevel = Math.max(1, this.moodLevel - 1);
        });
        
        if (overdueTasks.length > 0) {
            this.updateProgress();
            this.saveTasks();
        }
    }

    // Clear all completed tasks (bonus feature)
    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
    }

    // Clear all tasks (bonus feature)
    clearAll() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Theme handling
    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('todoTheme', theme);
    }

    applySavedTheme() {
        const saved = localStorage.getItem('todoTheme');
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        const theme = saved || (prefersLight ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update selector to match current theme
        if (this.themeSelector) {
            this.themeSelector.value = theme;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.todoApp = new TodoApp();
    
    // Add some keyboard shortcuts for better UX
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            window.todoApp.addTask();
        }
        
        // Escape to clear input
        if (e.key === 'Escape') {
            window.todoApp.taskInput.value = '';
            window.todoApp.taskInput.blur();
        }
    });
    
    // Add some helpful console messages
    console.log('✅ To-Do List App loaded successfully!');
    console.log('💡 Tips: Press Enter to add tasks, Ctrl+Enter as alternative, Escape to clear input');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoApp;
}
