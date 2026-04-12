// ==============================================================
// SOPHIE: VOCAB MASTER - V9.4 (AUDIO LOOP & MAGIC TRANSLATE RESTORED 💎)
// ==============================================================

const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');
const quizBtn = document.getElementById('quizBtn');
const newNoteBtn = document.getElementById('newNoteBtn');
const themeToggle = document.getElementById('themeToggle'); 
const exportBtn = document.getElementById('exportBtn');
const langSelect = document.getElementById('langSelect');
const swapLangBtn = document.getElementById('swapLangBtn'); 
const audioMode = document.getElementById('audioMode'); 
const magicOrderBtn = document.getElementById('magicOrderBtn'); 
const playSessionBtn = document.getElementById('playSession'); // Recuperado

let isSwapped = false; 
let currentCorrectAnswer = "";
let isPlaying = false; // Estado del audio manos libres

// --- GESTIÓN DEL TEMA (SOL / LUNA) ---
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('light-theme');
            localStorage.setItem('sophie_theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('sophie_theme', 'dark');
        }
    });
}

// --- CARGA INICIAL & QUIZ CREATION ---
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('sophie_theme');
    if (savedTheme === 'light' && themeToggle) {
        themeToggle.checked = true;
        document.body.classList.add('light-theme');
    }

    const savedLessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    savedLessons.forEach(l => createCardUI(l.content, l.date));

    createQuizOverlayUI();

    loadStreak(); 
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText && textInput) textInput.value = savedText;
});

// --- LÓGICA DE LA IA (MAGIA UNIVERSAL RESTAURADA) ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return alert("Por favor, introduce texto primero.");

        let userApiKey = localStorage.getItem('sophie_gemini_key');
        if (!userApiKey) {
            userApiKey = prompt("🔒 Introduce tu Google API Key:");
            if (!userApiKey) return;
            localStorage.setItem('sophie_gemini_key', userApiKey.trim());
        }

        const mode = langSelect.value;
        const config = getLangConfig(mode, isSwapped);
        let langPrompt = `Idioma 1: ${config.name1} -> Idioma 2: ${config.name2}`;

        magicOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        magicOrderBtn.disabled = true;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${userApiKey}`;
        
        // System prompt modificado para RE-TRADUCIR si es necesario
        const systemPrompt = `You are a strict language teacher. 
TASK: Organize vocabulary or TRANSLATE existing lists into the exact requested languages.
REQUESTED LANGUAGES: ${langPrompt}.
FORMAT: Word in Language 1 → Translation in Language 2 | Example sentence in Language 1.
RULES:
1. If the input is already formatted with '→', your job is to TRANSLATE the entire list into the new REQUESTED LANGUAGES.
2. The example sentence MUST always be written in Language 1.
3. Reply ONLY with the formatted list. No intros.

INPUT TEXT:
${rawText}`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
            });

            const data = await response.json();
            if (data.error) {
                alert("Error de Google: " + data.error.message);
                localStorage.removeItem('sophie_gemini_key');
                return;
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                textInput.value = data.candidates[0].content.parts[0].text.trim();
                localStorage.setItem('sophie_last_input', textInput.value);
                if(processBtn) processBtn.click(); // Automatización
            }
        } catch (error) {
            alert("Error de conexión a la IA.");
        } finally {
            magicOrderBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Ordenar con IA';
            magicOrderBtn.disabled = false;
        }
    });
}

// --- CREAR TARJETAS (TEXTO VISIBLE RESTAURADO Y DATOS PARA AUDIO) ---
if (processBtn) {
    processBtn.addEventListener('click', () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return;
        labList.innerHTML = ''; 
        const lines = rawText.split('\n');
        const config = getLangConfig(langSelect.value, isSwapped);

        lines.forEach(line => {
            if (!line.includes('→')) return;
            
            let exampleText = "";
            let vocabPart = line;
            if (line.includes('|')) {
                const parts = line.split('|');
                vocabPart = parts[0];
                if (parts[1]) exampleText = parts[1].trim();
            }

            let word1 = "", word2 = "";
            if (vocabPart.includes('→')) {
                const words = vocabPart.split('→');
                word1 = words[0].trim();
                if (words[1]) word2 = words[1].trim();
            }

            if (!word1 || !word2) return;

            const row = document.createElement('div');
            row.className = 'lab-row';
            
            // Guardamos datos invisibles en el HTML para el botón "Escuchar todo"
            row.dataset.text1 = word1;
            row.dataset.text2 = word2;
            row.dataset.voice1 = config.voice1;
            row.dataset.voice2 = config.voice2;
            row.dataset.example = exampleText;
            
            // Eliminado el "color:#fff" fijo. Ahora respeta el tema claro/oscuro
            row.innerHTML = `
                <div class="vocab-container" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <div class="vocab-word" style="font-weight:600; display:flex; align-items:center; gap:8px;">
                        <span class="flag">${config.flag1}</span> ${word1}
                    </div>
                    <div class="vocab-word" style="font-weight:600; display:flex; align-items:center; gap:8px;">
                        <span class="flag">${config.flag2}</span> ${word2}
                    </div>
                </div>
                ${exampleText ? `
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:8px;">
                    <small style="color:var(--text-secondary); font-style:italic; font-size:0.85rem;">💡 ${exampleText}</small>
                    <button class="play-example" onclick="speak('${exampleText.replace(/'/g, "\\'")}', '${config.voice1}')" style="background:transparent; border:none; border-radius:50%; width:35px; height:35px; color:var(--accent-purple); cursor:pointer;">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>` : ''}
            `;
            labList.appendChild(row);
        });
        saveLesson(rawText);
    });
}

// --- MOTOR AUDIO MANOS LIBRES (RESTAURADO) ---
if(playSessionBtn) {
    playSessionBtn.onclick = async () => {
        const rows = document.querySelectorAll('.lab-row');
        if (rows.length === 0) return alert("Por favor, procesa una lección primero.");
        
        if (isPlaying) { 
            isPlaying = false; 
            window.speechSynthesis.cancel(); 
            playSessionBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar todo'; 
            return; 
        }
        
        isPlaying = true; 
        playSessionBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; 
        const mode = audioMode ? audioMode.value : 'basic';

        for (let row of rows) {
            if (!isPlaying) break; 
            row.style.borderColor = "var(--accent-purple)"; // Resaltar tarjeta actual
            
            await speak(row.dataset.text1, row.dataset.voice1);
            if (!isPlaying) break; await new Promise(r => setTimeout(r, 1000));
            
            if (!isPlaying) break; await speak(row.dataset.text2, row.dataset.voice2);
            
            if (mode === 'full' && row.dataset.example && row.dataset.example.trim() !== "") {
                if (!isPlaying) break; await new Promise(r => setTimeout(r, 1000)); 
                if (!isPlaying) break; await speak(row.dataset.example, row.dataset.voice1); 
            }
            
            row.style.borderColor = "var(--border-color)"; // Quitar resalte
            if (!isPlaying) break; await new Promise(r => setTimeout(r, 1500)); 
        }
        isPlaying = false; 
        playSessionBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar todo'; 
    };
}

// --- FUNCIONES DE APOYO & LOCALIZATION ---
function getLangConfig(mode, swapped) {
    let configs = {
        'fr-de': { f1:'🇫🇷', f2:'🇩🇪', v1:'fr-FR', v2:'de-DE', n1:'Französisch', n2:'Deutsch' },
        'en-es': { f1:'🇬🇧', f2:'🇪🇸', v1:'en-US', v2:'es-ES', n1:'English', n2:'Español' },
        'es-de': { f1:'🇪🇸', f2:'🇩🇪', v1:'es-ES', v2:'de-DE', n1:'Español', n2:'Deutsch' },
        'en-de': { f1:'🇬🇧', f2:'🇩🇪', v1:'en-US', v2:'de-DE', n1:'English', n2:'Deutsch' },
        'pt-de': { f1:'🇵🇹', f2:'🇩🇪', v1:'pt-PT', v2:'de-DE', n1:'Português', n2:'Deutsch' }
    };
    let c = configs[mode] || configs['fr-de'];
    return swapped ? { flag1:c.f2, flag2:c.f1, voice1:c.v2, voice2:c.v1, name1:c.n2, name2:c.n1 } : { flag1:c.f1, flag2:c.f2, voice1:c.v1, voice2:c.v2, name1:c.n1, name2:c.n2 };
}

async function speak(text, lang) {
    return new Promise(resolve => {
        window.speechSynthesis.cancel();
        let currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = lang;
        currentUtterance.onend = resolve;
        currentUtterance.onerror = resolve;
        window.speechSynthesis.speak(currentUtterance);
    });
}

function saveLesson(content) {
    let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    const title = content.split('\n')[0].substring(0, 25);
    const existingIndex = lessons.findIndex(l => l.title === title);
    if (existingIndex !== -1) {
        lessons[existingIndex].content = content;
        lessons[existingIndex].date = new Date().toLocaleDateString();
    } else {
        lessons.push({ title, content, date: new Date().toLocaleDateString() });
    }
    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    notebookGallery.innerHTML = "";
    lessons.forEach(l => createCardUI(l.content, l.date));
}

function createCardUI(content, date) {
    const title = content.split('\n')[0].substring(0, 25);
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px; border-bottom:1px solid var(--border-color); padding:10px 0;">
            <i class="fas fa-book-bookmark" style="color:var(--accent-purple); font-size:1.4rem;"></i>
            <div>
                <div style="font-weight:700; font-size:0.95rem;">${title}...</div>
                <div style="font-size:0.75rem; color:var(--text-secondary)">${date}</div>
            </div>
        </div>
    `;
    card.onclick = () => { textInput.value = content; localStorage.setItem('sophie_last_input', content); if(processBtn) processBtn.click(); };
    if(notebookGallery) notebookGallery.prepend(card);
}

function loadStreak() {
    const streak = localStorage.getItem('sophie_streak') || 0;
    const streakEl = document.getElementById('streakNumber');
    if(streakEl) streakEl.innerText = streak;
}

if(newNoteBtn) newNoteBtn.onclick = () => { textInput.value = ""; labList.innerHTML = ""; localStorage.setItem('sophie_last_input', ""); };
if(swapLangBtn) swapLangBtn.onclick = () => { isSwapped = !isSwapped; swapLangBtn.classList.toggle('active'); };

// --- LÓGICA DEL QUIZ (MANTENIDA) ---
function createQuizOverlayUI() {
    if (document.getElementById('quizOverlay')) return; 

    const quizOverlay = document.createElement('div');
    quizOverlay.id = 'quizOverlay';
    quizOverlay.className = 'quiz-overlay';
    quizOverlay.style = "display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:2000; flex-direction:column; align-items:center; justify-content:center; padding:30px;";
    
    quizOverlay.innerHTML = `
        <div class="quiz-card" style="background:var(--bg-color); border-radius:25px; padding:30px; border:1px solid var(--accent-purple); box-shadow:0 0 40px rgba(187,134,252,0.3); width:100%; max-width:400px; text-align:center;">
            <div style="font-weight:800; color:var(--text-primary); font-size:1.4rem; letter-spacing:1px; margin-bottom:20px;">SOPHIE QUIZ 🧠</div>
            <div id="quizQuestion" style="font-size:1.2rem; font-weight:600; color:var(--text-primary); margin-bottom:15px; background:var(--card-bg); padding:15px; border-radius:15px;">Lädt...</div>
            <input type="text" id="quizInput" placeholder="Introduce traducción..." autocomplete="off" style="width:100%; padding:15px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; color:var(--text-primary); margin-bottom:10px;">
            <div id="quizFeedback" style="min-height:24px; margin:10px 0; font-weight:bold; font-size:1rem;"></div>
            <button id="checkBtn" style="width:100%; padding:15px; border:none; border-radius:15px; background:var(--accent-purple); color:#111827; font-weight:700; cursor:pointer;">Überprüfen</button>
            <button id="closeQuiz" style="margin-top:20px; background:none; border:none; color:var(--text-secondary); font-size:0.9rem; text-decoration:underline; cursor:pointer;">Quiz beenden</button>
        </div>
    `;
    document.body.appendChild(quizOverlay);

    if (quizBtn) {
        quizBtn.onclick = () => {
            const rows = document.querySelectorAll('.lab-row');
            if (rows.length === 0) return alert("Por favor, procesa una lección primero.");
            quizOverlay.style.display = 'flex';
            nextQuizQuestion();
        };
    }

    document.getElementById('checkBtn').onclick = () => checkQuizAnswer();
    document.getElementById('closeQuiz').onclick = () => quizOverlay.style.display = 'none';
}

function nextQuizQuestion() {
    const rows = document.querySelectorAll('.lab-row');
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const langInput = randomRow.querySelectorAll('.vocab-word');
    
    const word1Text = langInput[0].innerText;
    currentCorrectAnswer = langInput[1].innerText.toLowerCase().trim();

    document.getElementById('quizQuestion').innerText = `Übersetze:\n"${word1Text}"`;
    const input = document.getElementById('quizInput');
    input.value = "";
    input.focus();
    document.getElementById('quizFeedback').innerText = "";
}

function checkQuizAnswer() {
    const userAns = document.getElementById('quizInput').value.toLowerCase().trim();
    const feedback = document.getElementById('quizFeedback');
    const checkBtn = document.getElementById('checkBtn');
    checkBtn.disabled = true;

    if (userAns === currentCorrectAnswer) {
        feedback.style.color = "#4ade80"; feedback.innerText = "🎉 Ausgezeichnet! 🎉";
        let streak = parseInt(localStorage.getItem('sophie_streak')) || 0;
        localStorage.setItem('sophie_streak', streak + 1);
        loadStreak();
        setTimeout(() => { nextQuizQuestion(); checkBtn.disabled = false; feedback.innerText = ""; feedback.style.color = ""; }, 1200); 
    } else {
        feedback.style.color = "#fca5a5"; feedback.innerText = `Fast... Richtig ist: ${currentCorrectAnswer.toUpperCase()}`;
        setTimeout(() => { nextQuizQuestion(); checkBtn.disabled = false; feedback.innerText = ""; feedback.style.color = ""; }, 2500); 
    }
}
