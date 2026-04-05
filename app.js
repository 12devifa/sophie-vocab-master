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
            textInput.value = result.data.text;
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
                textInput.value = fullText; 
                localStorage.setItem('sophie_last_input', fullText);
            };
            reader.readAsArrayBuffer(file);
        } else {
            textInput.value = await file.text();
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
    const title = content.trim().split('\n')[0].substring(0, 25);
    if (lessons.some(l => l.title === title)) return;

    const lesson = { title, content, date: new Date().toLocaleDateString() };
    lessons.push(lesson);
    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    createCardUI(content, lesson.date);
}

function createCardUI(content, date) {
    const title = content.trim().split('\n')[0].substring(0, 20) + "...";
    const card = document.createElement('div');
    card.className = 'notebook-card';
    card.style = "background:#e3f2fd; padding:12px; border-radius:12px; margin-bottom:10px; position:relative; border:1px solid #bbdefb; cursor:pointer;";
    card.innerHTML = `
        <button class="del" style="position:absolute; top:5px; right:8px; border:none; background:none; color:red; font-weight:bold;">X</button>
        <div style="font-size:1.2rem;">📚</div>
        <div style="font-weight:bold; font-size:0.85rem;">${title}</div>
        <div style="font-size:0.7rem; color:#666;">${date}</div>
    `;

    card.querySelector('.del').onclick = (e) => {
        e.stopPropagation();
        card.remove();
        let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons.filter(l => l.content !== content)));
    };

    card.onclick = () => {
        textInput.value = content;
        processBtn.click();
    };
    notebookGallery.prepend(card);
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

// --- 9. SISTEMA DE QUIZ ---
const quizOverlay = document.createElement('div');
quizOverlay.className = 'quiz-overlay';
quizOverlay.innerHTML = `
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


    
