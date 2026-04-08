// --- 8. MODO CLARO / OSCURO ---
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Cambiar el icono visualmente
        if (document.body.classList.contains('light-theme')) {
            themeToggle.innerText = '🌙'; 
        } else {
            themeToggle.innerText = '☀️'; 
        }
    });
}



// ==============================================================
// SOPHIE: VOCAB MASTER - CEREBRO CENTRAL
// ==============================================================

// --- 1. MODO OSCURO (EL INTERRUPTOR MÁGICO) ---
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        
        try {
            localStorage.setItem('sophie_theme', newTheme);
        } catch (e) {
            console.log("Storage bloqueado por el navegador");
        }
    });
}

// --- 2. CARGA INICIAL (MEMORIA DE ELEFANTE) ---
window.addEventListener('DOMContentLoaded', () => {
    // Restaurar Tema
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('sophie_theme') || 'light';
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', savedTheme);
    if(themeToggle) themeToggle.innerText = savedTheme === 'dark' ? '☀️' : '🌙';

    // Restaurar Texto
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText) {
        document.getElementById('textInput').value = savedText;
        console.log("SSOPHIE hat deine letzte Lektion geladen 🐘");
    }

    // Restaurar Galería
    const saved = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    saved.forEach(l => createCardUI(l.content, l.date));
});

// --- 3. REFERENCIAS DEL DOM ---
const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');
const quizBtn = document.getElementById('quizBtn');

// Nuevo Botón de "Nueva Notiz"
const newNoteBtn = document.getElementById('newNoteBtn');

// Lógica del botón Nueva Notiz
newNoteBtn.addEventListener('click', () => {
    textInput.value = "";
    localStorage.setItem('sophie_last_input', "");
    console.log("SOPHIE bereit für eine neue Notiz 🐘");
});

// --- 4. GUARDADO MIENTRAS ESCRIBES ---
textInput.addEventListener('input', (e) => {
    localStorage.setItem('sophie_last_input', e.target.value);
});

// --- 5. LECTOR DE ARCHIVOS Y FOTOS ---
fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    processBtn.classList.add('reading-mode');
    processBtn.innerText = "⌛ SOPHIE liest...";
    
    try {
        if (file.type.startsWith("image/")) {
            const result = await Tesseract.recognize(file, 'fra+deu');
            textInput.value += "\n" + result.data.text;
            localStorage.setItem('sophie_last_input', textInput.value);
        } else if (file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = async function() {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    fullText += text.items.map(s => s.str).join(' ') + "\n";
                }
                textInput.value += "\n" + fullText;
                localStorage.setItem('sophie_last_input', fullText);
            };
            reader.readAsArrayBuffer(file);
        } else {
            textInput.value += "\n" + await file.text();
        }
    } catch (err) {
        alert("Fehler beim Lesen der Datei");
    }
    processBtn.classList.remove('reading-mode');
    processBtn.innerText = "Lektion verarbeiten";
});

// --- 6. PROCESAR TEXTO (LAB) ---
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return;
    
    labList.innerHTML = '';
    const lines = rawText.split('\n');
    
    lines.forEach(line => {
        if (!line.trim()) return;

        let cleanLine = line.replace(/\[.*?\]/g, ''); 
        let parts = cleanLine.includes('→') ? cleanLine.split('→') : cleanLine.trim().split(/\s{2,}/);
        
        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.style = "padding:12px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;";
            
            const fr = parts[0].trim();
            const de = parts.slice(-1)[0].trim();

            row.dataset.fr = fr;
            row.dataset.de = de;
            row.innerHTML = `<span>🇫🇷 ${fr}</span> <span>🇩🇪 ${de}</span>`;
            labList.appendChild(row);
        }
    });
    saveLesson(rawText);
});

// --- 7. GUARDADO Y GALERÍA ---
function saveLesson(content) {
    let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    
    // El título será la primera línea del texto
    const title = content.trim().split('\n')[0].substring(0, 30);
    
    // Buscamos si ya existe una libreta con este título
    const existingIndex = lessons.findIndex(l => l.title === title);

    if (existingIndex !== -1) {
        // SI YA EXISTE: Actualizamos su contenido con todo lo nuevo
        lessons[existingIndex].content = content;
        lessons[existingIndex].date = new Date().toLocaleDateString();
    } else {
        // SI NO EXISTE: Creamos una tarjeta nueva en la galería
        const lesson = { title, content, date: new Date().toLocaleDateString() };
        lessons.push(lesson);
    }

    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    
    // Recargamos la galería visualmente
    notebookGallery.innerHTML = '';
    lessons.forEach(l => createCardUI(l.content, l.date));
}

function createCardUI(content, date) {
    // Sacamos el título
    const title = content.trim().split('\n')[0].substring(0, 30);
    
    // Creamos la tarjeta
    const card = document.createElement('div');
    card.className = 'gallery-card';
    
    // Diseño exacto de tu render con el icono de un librito y la papelera escondida
    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px; width: 100%;">
            <div style="font-size: 1.5rem; color: #8e918f;">📓</div>
            <div style="flex: 1; text-align: left;">
                <div style="font-weight: bold; font-size: 0.95rem; color: #e3e3e3; margin-bottom: 3px;">${title}</div>
                <div style="font-size: 0.75rem; color: #8e918f;">Erstellt am ${date}</div>
            </div>
            <button class="delete-btn" title="Löschen">🗑️</button>
        </div>
    `;
    
    // Para que al hacer clic en la tarjeta se cargue el texto en la caja
    card.addEventListener('click', (e) => {
        if(e.target.closest('.delete-btn')) return; // Evitar que cargue si clicamos en borrar
        document.getElementById('textInput').value = content;
        localStorage.setItem('sophie_last_input', content);
    });

    // La magia de borrar
    const delBtn = card.querySelector('.delete-btn');
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se abra la nota de fondo
        let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
        lessons = lessons.filter(l => l.title !== title); // La borra de la memoria
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons)); // Guarda la memoria limpia
        card.remove(); // La desaparece de la pantalla
    });

    document.getElementById('notebookGallery').appendChild(card);
}

// --- 8. VOCES Y REPRODUCCIÓN (PLAY/PAUSE) ---
async function speak(text, lang) {
    return new Promise(resolve => {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = lang;
        ut.rate = 0.9;
        ut.onend = resolve;
        window.speechSynthesis.speak(ut);
    });
}

let isPlaying = false; 
document.getElementById('playSession').onclick = async () => {
    const btn = document.getElementById('playSession');
    const rows = document.querySelectorAll('.lab-row');
    
    if (rows.length === 0) return alert("¡Bitte zuerst eine Lektion laden!");

    if (isPlaying) {
        isPlaying = false;
        window.speechSynthesis.cancel(); 
        btn.innerHTML = "▶️ Sitzung fortsetzen";
        btn.style.background = "#4caf50"; 
        return;
    }

    isPlaying = true;
    btn.innerHTML = "⏸️ Sitzung pausieren";
    btn.style.background = "#ff9800"; 

    for (let row of rows) {
        if (!isPlaying) break; 
        row.style.background = "#fff9c4";
        await speak(row.dataset.fr, 'fr-FR');
        
        if (!isPlaying) break; 
        await new Promise(r => setTimeout(r, 1000));
        
        if (!isPlaying) break;
        await speak(row.dataset.de, 'de-DE');
        row.style.background = "transparent";
    }

    isPlaying = false;
    btn.innerHTML = "▶️ Sitzung starten";
    btn.style.background = "#4caf50";
};

// --- SISTEMA DE QUIZ ---
const quizOverlay = document.createElement('div');
quizOverlay.className = 'quiz-overlay';
quizOverlay.innerHTML = `
    <div style="margin-top: 20px; margin-bottom: 10px; font-weight: 800; color: #ffffff; font-size: 1.4rem; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        SOPHIE QUIZ 🧠
    </div>
    <div id="quizQuestion" class="quiz-card">Lädt...</div>
    <input type="text" id="quizInput" placeholder="Übersetzung eingeben..." autocomplete="off">
    <button id="checkBtn" class="primary-btn" style="width:85%; background:#673ab7;">Überprüfen</button>
    <button id="closeQuiz" style="margin-top:30px; background:none; border:none; color:#999; font-size:0.9rem; text-decoration:underline;">Quiz beenden</button>
`;
document.body.appendChild(quizOverlay);

let currentCorrectAnswer = "";
quizBtn.onclick = () => {
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("¡Bitte lade zuerst eine Lektion hoch, um das Quiz zu starten!");
    
    quizOverlay.style.display = 'flex';
    nextQuestion();
};

function nextQuestion() {
    const rows = document.querySelectorAll('.lab-row');
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    
    document.getElementById('quizQuestion').innerText = `Was bedeutet "${randomRow.dataset.fr}" auf Deutsch?`;
    currentCorrectAnswer = randomRow.dataset.de.toLowerCase().trim();
    
    const input = document.getElementById('quizInput');
    input.value = "";
    input.focus();
}

document.getElementById('checkBtn').onclick = () => {
    const userAns = document.getElementById('quizInput').value.toLowerCase().trim();
    
    if (userAns === currentCorrectAnswer) {
        alert("¡Excelente! 🎉 Ausgezeichnet! 🎉 Gut gemacht.");
        nextQuestion();
    } else {
        alert(`Fast... Die richtige Antwort war: ${currentCorrectAnswer.toUpperCase()}`);
        nextQuestion();
    }
};

document.getElementById('closeQuiz').onclick = () => {
    quizOverlay.style.display = 'none';
};


// --- 10. EXPORTAR COPIA DE SEGURIDAD (.json) ---
const exportBtn = document.getElementById('exportBtn');

if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        // Sacamos las lecciones de la memoria
        const lessons = localStorage.getItem('sophie_lessons');
        
        // Si no hay nada guardado, avisamos
        if (!lessons || lessons === '[]') {
            alert('Es gibt noch keine Notizen zum Exportieren. (Aún no hay notas para exportar).');
            return;
        }

        // Creamos un "paquete" con los datos
        const blob = new Blob([lessons], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Creamos un enlace invisible, lo pulsamos mágicamente y lo borramos
        const a = document.createElement('a');
        a.href = url;
        // Le ponemos la fecha al archivo para saber de cuándo es la copia
        const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
        a.download = 'SOPHIE_Backup_' + fecha + '.json';
        
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}


    
