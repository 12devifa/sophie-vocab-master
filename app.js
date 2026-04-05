        // --- CEREBRO DEL MODO OSCURO (VERSIÓN RESISTENTE) ---
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        alert("¡Botón pulsado correctamente! 🌙✨");
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Intentamos guardar, pero si está bloqueado, que no explote la app
        try {
            localStorage.setItem('sophie_theme', newTheme);
        } catch (e) {
            console.log("Storage bloqueado por el navegador");
        }
    });
}

// Al cargar, intentamos recordar con cuidado
window.addEventListener('DOMContentLoaded', () => {
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('sophie_theme') || 'light';
    } catch (e) {
        console.log("No se pudo leer el tema guardado");
    }
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    if(themeToggle) themeToggle.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
});

// SOPHIE: Cerebro Final con OCR y Memoria
// --- MEMORIA DE ELEFANTE AL CARGAR ---
window.addEventListener('load', () => {
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText) {
        document.getElementById('textInput').value = savedText;
        console.log("SOPHIE recordó tu última lección 🐘");
    }
});

// --- GUARDADO MIENTRAS ESCRIBES ---
document.getElementById('textInput').addEventListener('input', (e) => {
    localStorage.setItem('sophie_last_input', e.target.value);
});
const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');

// 1. Cargar Memoria al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const saved = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    saved.forEach(l => createCardUI(l.content, l.date));
});

// 2. Lector de Archivos y Fotos
fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

   processBtn.classList.add('reading-mode');
    processBtn.innerText = "⌛ SOPHIE está leyendo...";
    
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
        alert("Error al leer archivo");
    }
    processBtn.classList.remove('reading-mode');
    processBtn.innerText = "Process Lesson";
});

// 3. Procesar Texto (El corazón del Lab)
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return;
    
    labList.innerHTML = '';
    const lines = rawText.split('\n');
    
    lines.forEach(line => {
        if (!line.trim()) return;

        // Limpiamos fonética tipo [abc] para que no moleste
        let cleanLine = line.replace(/\[.*?\]/g, ''); 
        
        // Separamos por flecha o por espacios grandes (2 o más)
        let parts = cleanLine.includes('→') ? cleanLine.split('→') : cleanLine.trim().split(/\s{2,}/);
        
        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.style = "padding:12px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;";
            
            const fr = parts[0].trim();
            const de = parts.slice(-1)[0].trim(); // Agarramos el último pedazo como alemán

            row.dataset.fr = fr;
            row.dataset.de = de;
            row.innerHTML = `<span>🇫🇷 ${fr}</span> <span>🇩🇪 ${de}</span>`;
            labList.appendChild(row);
        }
    });
    saveLesson(rawText);
});

// 4. Guardado y Galería
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

// 5. Voces y Reproducción
async function speak(text, lang) {
    return new Promise(resolve => {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        ut.lang = lang;
        ut.rate = 0.9;
        ut.onend = resolve;
        window.speechSynthesis.speak(ut);
    });
}

// --- SISTEMA DE PLAY / PAUSE INTELIGENTE ---
let isPlaying = false; 

document.getElementById('playSession').onclick = async () => {
    const btn = document.getElementById('playSession');
    const rows = document.querySelectorAll('.lab-row');
    
    if (rows.length === 0) return alert("¡Carga una lección primero!");

    if (isPlaying) {
        isPlaying = false;
        window.speechSynthesis.cancel(); 
        btn.innerHTML = "▶️ Reanudar Sesión";
        btn.style.background = "#4caf50"; 
        return;
    }

    isPlaying = true;
    btn.innerHTML = "⏸️ Pausar Sesión";
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
    btn.innerHTML = "▶️ Play Session";
    btn.style.background = "#4caf50";
};
const quizBtn = document.getElementById('quizBtn');

// Crear la pantalla de Quiz en el documento
const quizOverlay = document.createElement('div');
quizOverlay.className = 'quiz-overlay';
quizOverlay.innerHTML = `
    <div style="position:absolute; top:40px; font-weight:bold; color:#673ab7;">SOPHIE QUIZ 🧠</div>
    <div id="quizQuestion" class="quiz-card">Cargando...</div>
    <input type="text" id="quizInput" placeholder="Escribe la traducción..." autocomplete="off">
    <button id="checkBtn" class="primary-btn" style="width:85%; background:#673ab7;">Comprobar</button>
    <button id="closeQuiz" style="margin-top:30px; background:none; border:none; color:#999; font-size:0.9rem; text-decoration:underline;">Cerrar Examen</button>
`;
document.body.appendChild(quizOverlay);

let currentCorrectAnswer = "";

quizBtn.onclick = () => {
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("¡Sube una lección primero para poder examinarte!");
    
    quizOverlay.style.display = 'flex';
    nextQuestion();
};

function nextQuestion() {
    const rows = document.querySelectorAll('.lab-row');
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    
    // Mostramos Francés, preguntamos Alemán
    document.getElementById('quizQuestion').innerText = `¿Cómo se dice "${randomRow.dataset.fr}"?`;
    currentCorrectAnswer = randomRow.dataset.de.toLowerCase().trim();
    
    const input = document.getElementById('quizInput');
    input.value = "";
    input.focus();
}

document.getElementById('checkBtn').onclick = () => {
    const userAns = document.getElementById('quizInput').value.toLowerCase().trim();
    
    if (userAns === currentCorrectAnswer) {
        alert("¡Excelente! 🎉 Vas por buen camino.");
        nextQuestion();
    } else {
        alert(`Casi... La respuesta correcta era: ${currentCorrectAnswer.toUpperCase()}`);
        nextQuestion();
    }
};

document.getElementById('closeQuiz').onclick = () => {
    quizOverlay.style.display = 'none';
};
function playMusic(type) {
    const player = document.getElementById('bgMusic');
    
    // Antenas de alta disponibilidad
    const sources = {
        'classic': 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg', 
        'focus': 'https://icecast.walmradio.com:8000/ambient',
        'stop': ''
    };

    if (type === 'stop') {
        player.pause();
        player.src = "";
    } else {
        // 1. Forzamos al navegador a reconocer la nueva antena
        player.setAttribute('src', sources[type]);
        player.load();
        
        // 2. Intentamos reproducir inmediatamente (Desbloqueo iOS)
        const playPromise = player.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Reproducción iniciada con éxito 🎶");
            }).catch(error => {
                console.log("Audio bloqueado. Toca la pantalla y reintenta.");
                player.play();
            });
