// ==============================================================
// SOPHIE: VOCAB MASTER - APP.JS LIMPIO Y REPARADO
// ==============================================================

// --- 1. REFERENCIAS DEL DOM (Una sola vez para no liar al navegador) ---
const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');
const quizBtn = document.getElementById('quizBtn');
const newNoteBtn = document.getElementById('newNoteBtn');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('exportBtn');

// --- 2. MODO CLARO / OSCURO (El Sol y la Luna) ---
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.innerText = isLight ? '🌙' : '☀️';
        // Guardamos la preferencia en la memoria
        try { localStorage.setItem('sophie_light_mode', isLight); } catch(e){}
    });
}

// --- 3. CARGA INICIAL (MEMORIA DE ELEFANTE) ---
window.addEventListener('DOMContentLoaded', () => {
    // Restaurar luz
    try {
        const isLight = localStorage.getItem('sophie_light_mode') === 'true';
        if (isLight) {
            document.body.classList.add('light-theme');
            if(themeToggle) themeToggle.innerText = '🌙';
        } else {
            if(themeToggle) themeToggle.innerText = '☀️';
        }
    } catch(e){}

    // Restaurar Texto
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText && textInput) textInput.value = savedText;

    // Restaurar Galería
    const saved = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    saved.forEach(l => createCardUI(l.content, l.date));
});

// --- 4. NUEVA NOTA Y GUARDADO AUTOMÁTICO ---
if (newNoteBtn) {
    newNoteBtn.addEventListener('click', () => {
        textInput.value = "";
        localStorage.setItem('sophie_last_input', "");
    });
}

if (textInput) {
    textInput.addEventListener('input', (e) => {
        localStorage.setItem('sophie_last_input', e.target.value);
    });
}

// --- 5. SUBIR ARCHIVOS (MOTOR NUEVO PDF/TXT/IMAGEN) ---
if (fileUpload) {
    fileUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        textInput.value = "Lese Datei... Bitte warten... ⏳";
        if(processBtn) processBtn.innerText = "⌛ SOPHIE liest...";

        try {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (evento) => {
                    textInput.value = evento.target.result;
                    localStorage.setItem('sophie_last_input', textInput.value);
                };
                reader.readAsText(file);
                
            } else if (file.type === "application/pdf") {
                const arrayBuffer = await file.arrayBuffer();
                // pdfjsLib está instalado en tu HTML
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(" ") + "\n";
                }
                textInput.value = fullText;
                localStorage.setItem('sophie_last_input', fullText);
                
            } else if (file.type.startsWith("image/")) {
                textInput.value = "Bild wird analysiert... ⏳ (Das kann einen Moment dauern)";
                // Tesseract está instalado en tu HTML
                const result = await Tesseract.recognize(file, 'deu+fra+eng');
                textInput.value = result.data.text;
                localStorage.setItem('sophie_last_input', textInput.value);
                
            } else {
                textInput.value = "❌ Format wird nicht unterstützt. Bitte TXT, PDF oder Bild wählen.";
            }
        } catch (error) {
            textInput.value = "❌ Fehler beim Lesen der Datei.";
            console.error(error);
        }
        fileUpload.value = '';
        if(processBtn) processBtn.innerText = "Lektion verarbeiten";
    });
}

// --- 6. PROCESAR TEXTO (LAB) ---
if (processBtn) {
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
}

// --- 7. GUARDADO Y GALERÍA ---
function saveLesson(content) {
    let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    const title = content.trim().split('\n')[0].substring(0, 30);
    const existingIndex = lessons.findIndex(l => l.title === title);

    if (existingIndex !== -1) {
        lessons[existingIndex].content = content;
        lessons[existingIndex].date = new Date().toLocaleDateString();
    } else {
        const lesson = { title, content, date: new Date().toLocaleDateString() };
        lessons.push(lesson);
    }

    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    notebookGallery.innerHTML = '';
    lessons.forEach(l => createCardUI(l.content, l.date));
}

function createCardUI(content, date) {
    const title = content.trim().split('\n')[0].substring(0, 30);
    const card = document.createElement('div');
    card.className = 'gallery-card';
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

    card.addEventListener('click', (e) => {
        if(e.target.closest('.delete-btn')) return; 
        if(textInput) textInput.value = content;
        localStorage.setItem('sophie_last_input', content);
    });

    const delBtn = card.querySelector('.delete-btn');
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
        lessons = lessons.filter(l => l.title !== title); 
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons)); 
        card.remove(); 
    });

    if(notebookGallery) notebookGallery.appendChild(card);
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
const playSessionBtn = document.getElementById('playSession');

if(playSessionBtn) {
    playSessionBtn.onclick = async () => {
        const rows = document.querySelectorAll('.lab-row');
        if (rows.length === 0) return alert("¡Bitte zuerst eine Lektion laden!");

        if (isPlaying) {
            isPlaying = false;
            window.speechSynthesis.cancel(); 
            playSessionBtn.innerHTML = "▶️ Sitzung fortsetzen";
            playSessionBtn.style.background = "#4caf50"; 
            return;
        }

        isPlaying = true;
        playSessionBtn.innerHTML = "⏸️ Sitzung pausieren";
        playSessionBtn.style.background = "#ff9800"; 

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
        playSessionBtn.innerHTML = "▶️ Sitzung starten";
        playSessionBtn.style.background = "#4caf50";
    };
}

// --- 9. SISTEMA DE QUIZ ---
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
quizOverlay.style.display = 'none'; // Oculto hasta que le den al botón
document.body.appendChild(quizOverlay);

let currentCorrectAnswer = "";

if(quizBtn) {
    quizBtn.onclick = () => {
        const rows = document.querySelectorAll('.lab-row');
        if (rows.length === 0) return alert("¡Bitte lade zuerst eine Lektion hoch, um das Quiz zu starten!");
        quizOverlay.style.display = 'flex';
        nextQuestion();
    };
}

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
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const lessons = localStorage.getItem('sophie_lessons');
        if (!lessons || lessons === '[]') {
            alert('Es gibt noch keine Notizen zum Exportieren.');
            return;
        }
        const blob = new Blob([lessons], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
        a.download = 'SOPHIE_Backup_' + fecha + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}
