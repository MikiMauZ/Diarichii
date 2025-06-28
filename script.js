
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyYDHXBe2NktCcQHT1O98sbhZtcMad-KE",
    authDomain: "diarichii.firebaseapp.com",
    projectId: "diarichii",
    storageBucket: "diarichii.firebasestorage.app",
    messagingSenderId: "973529371091",
    appId: "1:973529371091:web:04ea6384ad19712be59f26",
    measurementId: "G-L6ZYEW9V8B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Moods configuration
const moods = [
    // EMOCIONES DESAGRADABLES
    { id: 1, emoji: '😢', name: 'Triste', color: 'text-blue-600', type: 'desagradable' },
    { id: 2, emoji: '😠', name: 'Enojado', color: 'text-red-600', type: 'desagradable' },
    { id: 3, emoji: '😰', name: 'Ansioso', color: 'text-yellow-600', type: 'desagradable' },
    { id: 4, emoji: '😔', name: 'Melancólico', color: 'text-indigo-600', type: 'desagradable' },
    { id: 5, emoji: '😤', name: 'Frustrado', color: 'text-orange-600', type: 'desagradable' },
    { id: 6, emoji: '😨', name: 'Asustado', color: 'text-purple-600', type: 'desagradable' },
    { id: 7, emoji: '🤔', name: 'Preocupado', color: 'text-gray-600', type: 'desagradable' },
    { id: 8, emoji: '😖', name: 'Agobiado', color: 'text-red-500', type: 'desagradable' },
    { id: 9, emoji: '😞', name: 'Desanimado', color: 'text-blue-500', type: 'desagradable' },
    { id: 10, emoji: '😫', name: 'Exhausto', color: 'text-gray-700', type: 'desagradable' },
    { id: 11, emoji: '😭', name: 'Devastado', color: 'text-blue-700', type: 'desagradable' },
    { id: 12, emoji: '🤬', name: 'Furioso', color: 'text-red-900', type: 'desagradable' },
    { id: 13, emoji: '😣', name: 'Estresado', color: 'text-orange-600', type: 'desagradable' },
    { id: 14, emoji: '🥺', name: 'Vulnerable', color: 'text-blue-500', type: 'desagradable' },
    { id: 15, emoji: '😞', name: 'Decepcionado', color: 'text-blue-600', type: 'desagradable' },
    { id: 16, emoji: '🙄', name: 'Aburrido', color: 'text-gray-500', type: 'desagradable' },
    { id: 17, emoji: '😵‍💫', name: 'Confundido', color: 'text-purple-600', type: 'desagradable' },
    { id: 18, emoji: '🤯', name: 'Abrumado', color: 'text-orange-700', type: 'desagradable' },
    // EMOCIONES NEUTRAS
    { id: 19, emoji: '😐', name: 'Neutral', color: 'text-gray-600', type: 'neutral' },
    { id: 20, emoji: '🤔', name: 'Pensativo', color: 'text-indigo-600', type: 'neutral' },
    { id: 21, emoji: '😴', name: 'Cansado', color: 'text-gray-500', type: 'neutral' },
    { id: 22, emoji: '🥱', name: 'Agotado', color: 'text-gray-600', type: 'neutral' },
    { id: 23, emoji: '😪', name: 'Somnoliento', color: 'text-gray-400', type: 'neutral' },
    { id: 24, emoji: '🤒', name: 'Enfermo', color: 'text-green-700', type: 'neutral' },
    // EMOCIONES AGRADABLES
    { id: 25, emoji: '🙂', name: 'Tranquilo', color: 'text-green-400', type: 'agradable' },
    { id: 26, emoji: '😊', name: 'Contento', color: 'text-green-500', type: 'agradable' },
    { id: 27, emoji: '😄', name: 'Feliz', color: 'text-yellow-500', type: 'agradable' },
    { id: 28, emoji: '😍', name: 'Enamorado', color: 'text-pink-600', type: 'agradable' },
    { id: 29, emoji: '🤩', name: 'Genial', color: 'text-purple-600', type: 'agradable' },
    { id: 30, emoji: '🥳', name: 'Celebrando', color: 'text-yellow-500', type: 'agradable' },
    { id: 31, emoji: '😎', name: 'Confiado', color: 'text-blue-600', type: 'agradable' },
    { id: 32, emoji: '🤗', name: 'Cariñoso', color: 'text-pink-500', type: 'agradable' },
    { id: 33, emoji: '😌', name: 'Relajado', color: 'text-green-400', type: 'agradable' },
    { id: 34, emoji: '🥰', name: 'Amado', color: 'text-pink-600', type: 'agradable' },
    { id: 35, emoji: '😇', name: 'En paz', color: 'text-blue-300', type: 'agradable' }
];

// Global state
let currentUser = null;
let entries = [];
let moodHistory = [];
let currentView = 'home';
let selectedDate = new Date();
let selectedMoodForEntry = null;
let currentMoodCategory = 'all';

// DOM elements
const screens = {
    loading: document.getElementById('loading'),
    auth: document.getElementById('auth-screen'),
    main: document.getElementById('main-app')
};

const views = {
    home: document.getElementById('home-view'),
    entries: document.getElementById('entries-view'),
    calendar: document.getElementById('calendar-view')
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Show loading screen
    showScreen('loading');
    
    // Auth state listener
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadUserData();
            showScreen('main');
            showView('home');
        } else {
            currentUser = null;
            showScreen('auth');
        }
    });
}

function setupEventListeners() {
    // Auth form
    document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
    document.getElementById('auth-switch').addEventListener('click', toggleAuthMode);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            showView(view);
        });
    });
    
    // Quick moods
    document.getElementById('more-moods-btn').addEventListener('click', () => {
        showMoodModal();
    });
    
    // Entry actions
    document.getElementById('new-entry-btn').addEventListener('click', () => {
        showEntryModal();
    });
    
    document.getElementById('view-all-entries').addEventListener('click', () => {
        showView('entries');
    });
    
    // Modal close buttons
    document.getElementById('close-mood-modal').addEventListener('click', hideMoodModal);
    document.getElementById('close-entry-modal').addEventListener('click', hideEntryModal);
    
    // Entry form
    document.getElementById('entry-form').addEventListener('submit', handleEntrySubmit);
    document.getElementById('select-mood-btn').addEventListener('click', () => {
        showMoodModal(true);
    });
    
    // Mood categories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setMoodCategory(btn.dataset.category);
        });
    });
    
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', () => {
        selectedDate.setMonth(selectedDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Close modals on backdrop click
    document.getElementById('mood-modal').addEventListener('click', (e) => {
        if (e.target.id === 'mood-modal') hideMoodModal();
    });
    
    document.getElementById('entry-modal').addEventListener('click', (e) => {
        if (e.target.id === 'entry-modal') hideEntryModal();
    });
}

// Screen management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

// View management
function showView(viewName) {
    currentView = viewName;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Show view
    Object.values(views).forEach(view => view.classList.add('hidden'));
    views[viewName].classList.remove('hidden');
    
    // Render view content
    switch (viewName) {
        case 'home':
            renderHome();
            break;
        case 'entries':
            renderEntries();
            break;
        case 'calendar':
            renderCalendar();
            break;
    }
}

// Authentication
function handleAuthSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const isLogin = document.getElementById('auth-title').textContent === 'Iniciar Sesión';
    
    if (isLogin) {
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert('Error: ' + error.message));
    } else {
        auth.createUserWithEmailAndPassword(email, password)
            .catch(error => alert('Error: ' + error.message));
    }
}

function toggleAuthMode() {
    const title = document.getElementById('auth-title');
    const submit = document.getElementById('auth-submit');
    const switchText = document.getElementById('auth-switch-text');
    const switchBtn = document.getElementById('auth-switch');
    
    if (title.textContent === 'Iniciar Sesión') {
        title.textContent = 'Registrarse';
        submit.textContent = 'Registrarse';
        switchText.textContent = '¿Ya tienes cuenta?';
        switchBtn.textContent = 'Inicia Sesión';
    } else {
        title.textContent = 'Iniciar Sesión';
        submit.textContent = 'Iniciar Sesión';
        switchText.textContent = '¿No tienes cuenta?';
        switchBtn.textContent = 'Regístrate';
    }
}

function handleLogout() {
    auth.signOut();
}

// Data management
async function loadUserData() {
    try {
        // Load entries
        const entriesQuery = db.collection('entries')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc');
        
        const entriesSnapshot = await entriesQuery.get();
        entries = entriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Load mood history
        const moodQuery = db.collection('moods')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc');
        
        const moodSnapshot = await moodQuery.get();
        moodHistory = moodSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        renderCurrentView();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Mood management
function renderQuickMoods() {
    const container = document.getElementById('quick-moods');
    container.innerHTML = '';
    
    moods.slice(0, 6).forEach(mood => {
        const btn = document.createElement('button');
        btn.className = 'mood-btn';
        btn.innerHTML = `
            <span class="emoji">${mood.emoji}</span>
            <span class="name">${mood.name}</span>
        `;
        btn.addEventListener('click', () => saveMood(mood.id));
        container.appendChild(btn);
    });
}

async function saveMood(moodId) {
    try {
        const mood = moods.find(m => m.id === moodId);
        const moodData = {
            userId: currentUser.uid,
            moodId: moodId,
            emoji: mood.emoji,
            name: mood.name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        };
        
        await db.collection('moods').add(moodData);
        await loadUserData();
    } catch (error) {
        console.error('Error saving mood:', error);
    }
}

function showMoodModal(forEntry = false) {
    selectedMoodForEntry = null;
    renderMoodCarousel();
    document.getElementById('mood-modal').classList.remove('hidden');
    
    // Add different behavior for entry mood selection
    if (forEntry) {
        document.getElementById('mood-modal').setAttribute('data-for-entry', 'true');
    } else {
        document.getElementById('mood-modal').removeAttribute('data-for-entry');
    }
}

function hideMoodModal() {
    document.getElementById('mood-modal').classList.add('hidden');
}

function setMoodCategory(category) {
    currentMoodCategory = category;
    
    // Update category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    renderMoodCarousel();
}

function renderMoodCarousel() {
    const container = document.getElementById('mood-carousel');
    container.innerHTML = '';
    
    const filteredMoods = currentMoodCategory === 'all' 
        ? moods 
        : moods.filter(mood => mood.type === currentMoodCategory);
    
    filteredMoods.forEach(mood => {
        const option = document.createElement('div');
        option.className = 'mood-option';
        option.innerHTML = `
            <span class="emoji">${mood.emoji}</span>
            <span class="name">${mood.name}</span>
        `;
        
        option.addEventListener('click', () => {
            const isForEntry = document.getElementById('mood-modal').hasAttribute('data-for-entry');
            
            if (isForEntry) {
                selectedMoodForEntry = mood;
                updateSelectedMoodDisplay();
                hideMoodModal();
            } else {
                saveMood(mood.id);
                hideMoodModal();
            }
        });
        
        container.appendChild(option);
    });
}

// Entry management
function showEntryModal() {
    selectedMoodForEntry = null;
    document.getElementById('entry-title').value = '';
    document.getElementById('entry-content').value = '';
    updateSelectedMoodDisplay();
    document.getElementById('entry-modal').classList.remove('hidden');
}

function hideEntryModal() {
    document.getElementById('entry-modal').classList.add('hidden');
}

function updateSelectedMoodDisplay() {
    const display = document.getElementById('selected-mood-display');
    const moodText = document.getElementById('mood-display');
    
    if (selectedMoodForEntry) {
        moodText.innerHTML = `${selectedMoodForEntry.emoji} ${selectedMoodForEntry.name}`;
        display.classList.remove('hidden');
    } else {
        display.classList.add('hidden');
    }
}

async function handleEntrySubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('entry-title').value;
    const content = document.getElementById('entry-content').value;
    
    try {
        const entryData = {
            userId: currentUser.uid,
            title: title,
            content: content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        };
        
        if (selectedMoodForEntry) {
            entryData.mood = {
                id: selectedMoodForEntry.id,
                emoji: selectedMoodForEntry.emoji,
                name: selectedMoodForEntry.name
            };
        }
        
        await db.collection('entries').add(entryData);
        await loadUserData();
        hideEntryModal();
    } catch (error) {
        console.error('Error saving entry:', error);
    }
}

// Rendering functions
function renderHome() {
    renderQuickMoods();
    renderMoodHistory();
    renderRecentEntries();
}

function renderMoodHistory() {
    const container = document.getElementById('mood-history');
    const section = document.getElementById('mood-history-section');
    
    const today = new Date().toISOString().split('T')[0];
    const todayMoods = moodHistory.filter(mood => mood.date === today);
    
    if (todayMoods.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    container.innerHTML = '';
    
    todayMoods.slice(0, 3).forEach(mood => {
        const item = document.createElement('div');
        item.className = 'mood-history-item';
        item.innerHTML = `
            <span>${mood.emoji}</span>
            <span>${mood.name}</span>
        `;
        container.appendChild(item);
    });
    
    if (todayMoods.length > 3) {
        const more = document.createElement('div');
        more.className = 'mood-history-item';
        more.innerHTML = `<span>+${todayMoods.length - 3} más</span>`;
        container.appendChild(more);
    }
}

function renderRecentEntries() {
    const container = document.getElementById('recent-entries');
    container.innerHTML = '';
    
    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No hay entradas aún. ¡Crea tu primera entrada!</p>';
        return;
    }
    
    entries.slice(0, 2).forEach(entry => {
        const item = document.createElement('div');
        item.className = 'entry-item';
        item.innerHTML = `
            <div class="entry-header">
                <div>
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-content">${entry.content.length > 100 ? entry.content.substring(0, 100) + '...' : entry.content}</div>
                </div>
                <div class="entry-date">${formatDate(entry.timestamp)}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderEntries() {
    const container = document.getElementById('entries-list');
    container.innerHTML = '';
    
    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No hay entradas aún. ¡Crea tu primera entrada!</p>';
        return;
    }
    
    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'entry-item';
        item.innerHTML = `
            <div class="entry-header">
                <div>
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-content">${entry.content}</div>
                    ${entry.mood ? `<div style="margin-top: 0.5rem;"><span>${entry.mood.emoji} ${entry.mood.name}</span></div>` : ''}
                </div>
                <div class="entry-date">${formatDate(entry.timestamp)}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderCalendar() {
    renderCalendarHeader();
    renderCalendarGrid();
    renderCalendarEntries();
}

function renderCalendarHeader() {
    const title = document.getElementById('calendar-title');
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    title.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
}

function renderCalendarGrid() {
    const container = document.getElementById('calendar-grid');
    container.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.style.padding = '0.5rem';
        header.style.textAlign = 'center';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '0.875rem';
        header.style.color = '#6b7280';
        header.textContent = day;
        container.appendChild(header);
    });
    
    // Generate calendar days
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = currentDate.getDate();
        
        if (currentDate.getMonth() !== selectedDate.getMonth()) {
            day.classList.add('empty');
        } else {
            const dateStr = currentDate.toISOString().split('T')[0];
            const hasEntry = entries.some(entry => entry.date === dateStr);
            
            if (hasEntry) {
                day.classList.add('has-entry');
            }
            
            day.addEventListener('click', () => {
                renderCalendarEntries(dateStr);
            });
        }
        
        container.appendChild(day);
    }
}

function renderCalendarEntries(selectedDateStr = null) {
    const container = document.getElementById('calendar-entries');
    
    if (!selectedDateStr) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">Selecciona un día para ver las entradas</p>';
        return;
    }
    
    const dayEntries = entries.filter(entry => entry.date === selectedDateStr);
    
    if (dayEntries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">No hay entradas para este día</p>';
        return;
    }
    
    container.innerHTML = `<h4 style="margin-bottom: 1rem;">Entradas del ${formatDateStr(selectedDateStr)}</h4>`;
    
    dayEntries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'entry-item';
        item.innerHTML = `
            <div class="entry-title">${entry.title}</div>
            <div class="entry-content">${entry.content}</div>
            ${entry.mood ? `<div style="margin-top: 0.5rem;"><span>${entry.mood.emoji} ${entry.mood.name}</span></div>` : ''}
        `;
        container.appendChild(item);
    });
}

function renderCurrentView() {
    if (currentView === 'home') renderHome();
    else if (currentView === 'entries') renderEntries();
    else if (currentView === 'calendar') renderCalendar();
}

// Utility functions
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatDateStr(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
