// ========== TODO APP - LOCAL STORAGE ==========

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.attachEventListeners();
        this.render();
    }

    // ===== STORAGE FUNCTIONS =====
    loadFromStorage() {
        const stored = localStorage.getItem('todos');
        this.todos = stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // ===== TODO OPERATIONS =====
    addTodo(text) {
        if (!text.trim()) {
            alert('Inserisci un testo valido!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toLocaleString('it-IT')
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.render();
        document.getElementById('todoInput').value = '';
    }

    deleteTodo(id) {
        if (confirm('Sei sicuro di voler eliminare questa attività?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    editTodo(id) {
        this.editingId = id;
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            document.getElementById('editInput').value = todo.text;
            document.getElementById('editModal').style.display = 'block';
        }
    }

    saveTodo(newText) {
        if (!newText.trim()) {
            alert('Il testo non può essere vuoto!');
            return;
        }

        const todo = this.todos.find(t => t.id === this.editingId);
        if (todo) {
            todo.text = newText.trim();
            this.saveToStorage();
            this.render();
            this.closeModal();
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('Nessuna attività completata da eliminare!');
            return;
        }

        if (confirm(`Eliminare ${completedCount} attività completata/e?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    // ===== FILTER FUNCTIONS =====
    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // ===== IMPORT/EXPORT FUNCTIONS =====
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    if (confirm('Vuoi sostituire o unire le attività?\n\nOK = Sostituisci\nAnnulla = Unisci')) {
                        this.todos = imported;
                    } else {
                        this.todos = [...this.todos, ...imported];
                    }
                    this.saveToStorage();
                    this.render();
                    alert('Attività importate con successo!');
                } else {
                    alert('Formato file non valido!');
                }
            } catch (error) {
                alert('Errore nell\'importazione: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // ===== UI FUNCTIONS =====
    render() {
        this.updateStats();
        this.renderTodos();
        this.renderEmptyState();
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = remaining;
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const filtered = this.getFilteredTodos();

        todoList.innerHTML = filtered.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <span class="todo-date">${todo.createdAt}</span>
                <div class="todo-actions">
                    <button class="btn-edit" onclick="app.editTodo(${todo.id})">✏️ Modifica</button>
                    <button class="btn-delete" onclick="app.deleteTodo(${todo.id})">🗑️ Elimina</button>
                </div>
            </li>
        `).join('');
    }

    renderEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const todoList = document.getElementById('todoList');

        if (this.todos.length === 0) {
            emptyState.style.display = 'flex';
            todoList.style.display = 'none';
        } else if (this.getFilteredTodos().length === 0) {
            emptyState.innerHTML = '<span class="empty-icon">🔍</span><p>Nessuna attività trovata con questo filtro.</p>';
            emptyState.style.display = 'flex';
            todoList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            todoList.style.display = 'block';
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // ===== MODAL FUNCTIONS =====
    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingId = null;
    }

    // ===== EVENT LISTENERS =====
    attachEventListeners() {
        // Add todo
        document.getElementById('addBtn').addEventListener('click', () => {
            const text = document.getElementById('todoInput').value;
            this.addTodo(text);
        });

        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = document.getElementById('todoInput').value;
                this.addTodo(text);
            }
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCompleted());

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTodos());

        // Import
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importTodos(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Modal
        const modal = document.getElementById('editModal');
        const closeBtn = document.querySelector('.close-btn');
        const saveBtn = document.getElementById('saveBtnModal');
        const cancelBtn = document.getElementById('cancelBtnModal');

        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());

        saveBtn.addEventListener('click', () => {
            const newText = document.getElementById('editInput').value;
            this.saveTodo(newText);
        });

        document.getElementById('editInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const newText = document.getElementById('editInput').value;
                this.saveTodo(newText);
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
}

// ===== INITIALIZE APP =====
const app = new TodoApp();