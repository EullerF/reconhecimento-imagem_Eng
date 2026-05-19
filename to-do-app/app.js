// ─── STORAGE LAYER ──────────────────────────────────────────────────────────
const DB = {
  get users() { return JSON.parse(localStorage.getItem('users') || '[]'); },
  set users(v) { localStorage.setItem('users', JSON.stringify(v)); },

  get todos() { return JSON.parse(localStorage.getItem('todos') || '[]'); },
  set todos(v) { localStorage.setItem('todos', JSON.stringify(v)); },

  get currentUser() { return JSON.parse(localStorage.getItem('currentUser') || 'null'); },
  set currentUser(v) {
    if (v) localStorage.setItem('currentUser', JSON.stringify(v));
    else localStorage.removeItem('currentUser');
  }
};

// Initialize DB structure on first run
if (!localStorage.getItem('users'))  DB.users  = [];
if (!localStorage.getItem('todos'))  DB.todos  = [];

// ─── SCREEN ROUTER ───────────────────────────────────────────────────────────
const SCREENS = {
  login:    document.getElementById('screen-login'),
  register: document.getElementById('screen-register'),
  app:      document.getElementById('screen-app'),
};

function showScreen(name) {
  Object.values(SCREENS).forEach(s => s.classList.remove('active'));
  SCREENS[name].classList.add('active');
}

// ─── ERROR HELPERS ───────────────────────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearErrors(...ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
function login(email, password) {
  const users = DB.users;
  const user  = users.find(u => u.email === email);
  if (!user)               return { ok: false, field: 'general', msg: 'E-mail não cadastrado.' };
  if (user.password !== password) return { ok: false, field: 'password', msg: 'Senha incorreta.' };
  DB.currentUser = user;
  return { ok: true, user };
}

function register(name, email, password) {
  const users = DB.users;
  if (users.some(u => u.email === email)) return { ok: false, field: 'email', msg: 'Este e-mail já está em uso.' };
  const user = { id: Date.now().toString(), name: name.trim(), email: email.trim(), password };
  DB.users = [...users, user];
  DB.currentUser = user;
  return { ok: true, user };
}

function logout() {
  DB.currentUser = null;
  showScreen('login');
  document.getElementById('form-login').reset();
  clearErrors('err-login-email', 'err-login-password', 'err-login-general');
}

// ─── TODOS ───────────────────────────────────────────────────────────────────
function getUserTodos(userId) {
  const all = DB.todos;
  const mine = all.filter(t => t.userId === userId);
  // pending first, done at the bottom
  return [
    ...mine.filter(t => !t.done),
    ...mine.filter(t => t.done),
  ];
}

function addTodo(title, type, description) {
  const user = DB.currentUser;
  const todo = {
    id:          Date.now().toString(),
    userId:      user.email,
    title:       title.trim(),
    type,
    description: description.trim(),
    done:        false,
    createdAt:   new Date().toISOString(),
  };
  DB.todos = [...DB.todos, todo];
  return todo;
}

function completeTodo(id) {
  DB.todos = DB.todos.map(t => t.id === id ? { ...t, done: true } : t);
}

function deleteTodo(id) {
  DB.todos = DB.todos.filter(t => t.id !== id);
}

// ─── RENDER ──────────────────────────────────────────────────────────────────
const TYPE_LABELS = { trabalho: 'Trabalho', pessoal: 'Pessoal', estudos: 'Estudos' };

function badgeClass(type) {
  return { trabalho: 'badge-trabalho', pessoal: 'badge-pessoal', estudos: 'badge-estudos' }[type] || '';
}

function renderTasks() {
  const user  = DB.currentUser;
  const list  = document.getElementById('todo-list');
  const count = document.getElementById('task-count');
  const tasks = getUserTodos(user.email);

  if (!tasks.length) {
    list.innerHTML = `
      <div class="glass rounded-xl p-8 text-center">
        <svg class="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p class="text-slate-500 text-sm">Nenhuma tarefa cadastrada ainda.</p>
        <p class="text-slate-600 text-xs mt-1">Use o formulário acima para começar.</p>
      </div>`;
    count.textContent = '0 tarefas';
    return;
  }

  const pending = tasks.filter(t => !t.done).length;
  count.textContent = `${pending} pendente${pending !== 1 ? 's' : ''} · ${tasks.length} total`;

  list.innerHTML = tasks.map(task => `
    <div id="task-${task.id}" class="glass rounded-xl p-5 task-card${task.done ? ' task-done' : ''}">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1.5">
            <span class="task-title font-semibold text-white text-sm truncate">${escapeHtml(task.title)}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass(task.type)}">${TYPE_LABELS[task.type] || task.type}</span>
          </div>
          ${task.description
            ? `<p class="text-slate-400 text-xs leading-relaxed mt-1">${escapeHtml(task.description)}</p>`
            : ''}
        </div>
        <div class="flex items-center gap-2 shrink-0 mt-0.5">
          ${!task.done
            ? `<button class="done-btn" onclick="handleComplete('${task.id}')">✓ Concluir</button>`
            : `<span class="text-xs text-slate-600 font-medium">Concluída</span>`}
          <button class="delete-btn" onclick="handleDelete('${task.id}')" title="Remover">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ─── HANDLERS ────────────────────────────────────────────────────────────────
function handleComplete(id) {
  completeTodo(id);
  renderTasks();
}

function handleDelete(id) {
  deleteTodo(id);
  renderTasks();
}

function initDashboard() {
  const user = DB.currentUser;
  document.getElementById('user-name').textContent = user.name;
  renderTasks();
  showScreen('app');
}

// ─── FORM: LOGIN ─────────────────────────────────────────────────────────────
document.getElementById('form-login').addEventListener('submit', e => {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  clearErrors('err-login-email', 'err-login-password', 'err-login-general');

  let valid = true;
  if (!email)    { showError('err-login-email',    'O e-mail é obrigatório.'); valid = false; }
  if (!password) { showError('err-login-password', 'A senha é obrigatória.'); valid = false; }
  if (!valid) return;

  const result = login(email, password);
  if (!result.ok) {
    if (result.field === 'password') showError('err-login-password', result.msg);
    else                             showError('err-login-general',  result.msg);
    return;
  }

  document.getElementById('form-login').reset();
  initDashboard();
});

// ─── FORM: REGISTER ──────────────────────────────────────────────────────────
document.getElementById('form-register').addEventListener('submit', e => {
  e.preventDefault();
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  clearErrors('err-reg-name', 'err-reg-email', 'err-reg-password');

  let valid = true;
  if (!name)               { showError('err-reg-name',     'O nome é obrigatório.'); valid = false; }
  if (!email)              { showError('err-reg-email',    'O e-mail é obrigatório.'); valid = false; }
  if (password.length < 6) { showError('err-reg-password', 'A senha deve ter pelo menos 6 caracteres.'); valid = false; }
  if (!valid) return;

  const result = register(name, email, password);
  if (!result.ok) {
    showError('err-reg-email', result.msg);
    return;
  }

  document.getElementById('form-register').reset();
  initDashboard();
});

// ─── FORM: ADD TODO ──────────────────────────────────────────────────────────
document.getElementById('form-todo').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('todo-title').value.trim();
  const type  = document.getElementById('todo-type').value;
  const desc  = document.getElementById('todo-desc').value;

  clearErrors('err-todo-title');
  if (!title) { showError('err-todo-title', 'O título é obrigatório.'); return; }

  addTodo(title, type, desc);
  document.getElementById('form-todo').reset();
  renderTasks();
  document.getElementById('todo-title').focus();
});

// ─── NAV BUTTONS ─────────────────────────────────────────────────────────────
document.getElementById('goto-register').addEventListener('click', () => {
  clearErrors('err-login-email', 'err-login-password', 'err-login-general');
  document.getElementById('form-login').reset();
  showScreen('register');
});

document.getElementById('goto-login').addEventListener('click', () => {
  clearErrors('err-reg-name', 'err-reg-email', 'err-reg-password');
  document.getElementById('form-register').reset();
  showScreen('login');
});

document.getElementById('btn-logout').addEventListener('click', logout);

// ─── SESSION CHECK ───────────────────────────────────────────────────────────
(function init() {
  const user = DB.currentUser;
  if (user) initDashboard();
  else      showScreen('login');
})();
