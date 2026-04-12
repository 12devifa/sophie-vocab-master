// ==============================================================
// SOPHIE: VOCAB MASTER - V9.3 (QA TESTED & QUIZ REVIVAL 🧠💎)
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

let isSwapped = false; 
let currentCorrectAnswer = "";

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
    // 1. Recuperar Tema
    const savedTheme = localStorage.getItem('sophie_theme');
    if (savedTheme === 'light' && themeToggle) {
        themeToggle.checked = true;
        document.body.classList.add('light-theme');
    }

    // 2. Cargar historial con diseño nuevo
    const savedLessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    savedLessons.forEach(l => createCardUI(l.content, l.date));

    // 3. ¡REVIVIR EL QUIZ MÁGICAMENTE! (Dynamically creating overlay)
    createQuizOverlayUI();

    loadStreak(); 
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText && textInput) textInput.value = savedText;
});

// --- LÓGICA DE LA IA (GEMINI 2.5) ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return alert("Por favor, introduce texto primero.");

        // SOLUCIÓN PUNTO A-2: QA Check - Si ya está ordenado, no preguntar a la IA
        if (rawText.includes('→')) {
            alert("⚠️ Estos textos ya parecen estar organizados con flechas! Si quieres cambiar de idioma, bórralo y reescribe las palabras.");
            return;
        }

        let userApiKey = localStorage.getItem('sophie_gemini_key');
        if (!userApiKey) {
            userApiKey = prompt("🔒 Introduce tu Google API Key:");
            if (!userApiKey) return;
            localStorage.setItem('sophie_gemini_key', userApiKey.trim());
        }

        const mode = langSelect.value;
        const config = getLangConfig(mode, isSwapped);
        // SOLUCIÓN PUNTO A-1: Instrucción explícita del idioma de la frase
        let langPrompt = `Idioma 1 (Estudio/Frase): ${config.name1} -> Idioma 2 (Traducción): ${config.name2}`;

        magicOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ordenando...';
        magicOrderBtn.disabled = true;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`;
        
        // SOLUCIÓN PUNTO A-1: System Prompt Actualizado
        const systemPrompt = `You are a strict language teacher. Your task is to organize messy vocabulary lists.
FORMAT: Messy Input Word(s) -> Word 1 → Translation 2 | An example sentence in LANGUAGE 1.
RULES:
1. Organize the word(s) into Language 1 and Language 2 based on the selection: ${langPrompt}.
2. Use '→' to separate Word 1 and Word 2.
3. Use '|' to separate the vocabulary part from the example sentence.
4. IMPORTANT: The example sentence MUST always be written in LANGUAGE 1 (the first language of the pair).
5. Ensure the messy inputs are structured into clean cards.
6. Only reply with the organized list. No introductions.

MESSY INPUT:
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
                if(processBtn) processBtn.click(); // ¡Automatización activa!
            }
        } catch (error) {
            alert("Error de conexión a la IA.");
        } finally {
            magicOrderBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Ordenar con IA';
            magicOrderBtn.disabled = false;
        }
    });
}

// --- CREAR TARJETAS (SOLUCIÓN PUNTO D & DISEÑO PREMIUM MOBILE-READY) ---
if (processBtn) {
    processBtn.addEventListener('click', () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return;
        labList.innerHTML = ''; // Limpiar laboratorio
        const lines = rawText.split('\n');
        const config = getLangConfig(langSelect.value, isSwapped);

        lines.forEach(line => {
            if (!line.includes('→')) return;
            
            // Separar Vocabulario de la Frase
            let exampleText = "";
            let vocabPart = line;
            if (line.includes('|')) {
                const parts = line.split('|');
                vocabPart = parts[0];
                if (parts[1]) exampleText = parts[1].trim();
            }

            // Separar Palabra 1 de Palabra 2
            let word1 = "", word2 = "";
            if (vocabPart.includes('→')) {
                const words = vocabPart.split('→');
                word1 = words[0].trim();
                if (words[1]) word2 = words[1].trim();
            }

            if (!word1 || !word2) return; // Saltarse líneas malformadas

            const row = document.createElement('div');
            row.className = 'lab-row';
            
            row.innerHTML = `
                <div class="vocab-container" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <div class="vocab-word" style="font-weight:600; color:#fff; display:flex; align-items:center; gap:8px;">
                        <span class="flag">${config.flag1}</span> ${word1}
                    </div>
                    <div class="vocab-word" style="font-weight:600; color:#fff; display:flex; align-items:center; gap:8px;">
                        <span class="flag">${config.flag2}</span> ${word2}
                    </div>
                </div>
                ${exampleText ? `
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                    <small style="color:var(--text-secondary); font-style:italic; font-size:0.85rem;">💡 ${exampleText}</small>
                    <button class="play-example" onclick="speak('${exampleText.replace(/'/g, "\\'")}', '${config.voice1}')" style="background:rgba(255,255,255,0.05); border:none; border-radius:50%; width:35px; height:35px; color:var(--accent-purple); cursor:pointer;">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>` : ''}
            `;
            labList.appendChild(row);
        });
        saveLesson(rawText);
    });
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
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = lang;
    window.speechSynthesis.speak(ut);
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
        <div style="display:flex; align-items:center; gap:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding:10px 0;">
            <i class="fas fa-book-bookmark" style="color:var(--accent-purple); font-size:1.4rem;"></i>
            <div>
                <div style="font-weight:700; font-size:0.95rem; color:#fff;">${title}...</div>
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

// Botones auxiliares
if(newNoteBtn) newNoteBtn.onclick = () => { textInput.value = ""; labList.innerHTML = ""; localStorage.setItem('sophie_last_input', ""); };
if(swapLangBtn) swapLangBtn.onclick = () => { isSwapped = !isSwapped; swapLangBtn.classList.toggle('active'); };
if(exportBtn) exportBtn.onclick = () => alert("Misión: Crear Backup. (Socia, esto lo haremos en V10!)");

// --- SOLUCIÓN PUNTO C: DYNAMIC QUIZ CREATION & REVIVAL ---
function createQuizOverlayUI() {
    if (document.getElementById('quizOverlay')) return; // Evitar duplicados

    const quizOverlay = document.createElement('div');
    quizOverlay.id = 'quizOverlay';
    quizOverlay.className = 'quiz-overlay';
    quizOverlay.style = "display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(10,14,23,0.95); backdrop-filter:blur(12px); z-index:2000; flex-direction:column; align-items:center; justify-content:center; padding:30px;";
    
    quizOverlay.innerHTML = `
        <div class="quiz-card" style="background:var(--card-bg); border-radius:25px; padding:30px; border:1px solid var(--accent-purple); box-shadow:0 0 40px rgba(187,134,252,0.3); width:100%; max-width:400px; text-align:center;">
            <div style="font-weight:800; color:#ffffff; font-size:1.4rem; letter-spacing:1px; margin-bottom:20px;">SOPHIE QUIZ 🧠</div>
            <div id="quizQuestion" style="font-size:1.2rem; font-weight:600; color:#fff; margin-bottom:15px; background:rgba(255,255,255,0.03); padding:15px; border-radius:15px;">Lädt...</div>
            <input type="text" id="quizInput" placeholder="Introduce traducción..." autocomplete="off" style="width:100%; padding:15px; background:rgba(0,0,0,0.1); border:1px solid var(--border-color); border-radius:12px; color:#fff; margin-bottom:10px;">
            <div id="quizFeedback" style="min-height:24px; margin:10px 0; font-weight:bold; font-size:1rem;"></div>
            <button id="checkBtn" style="width:100%; padding:15px; border:none; border-radius:15px; background:var(--accent-purple); color:#111827; font-weight:700; cursor:pointer;">Überprüfen</button>
            <button id="closeQuiz" style="margin-top:20px; background:none; border:none; color:#999; font-size:0.9rem; text-decoration:underline; cursor:pointer;">Quiz beenden</button>
        </div>
    `;
    document.body.appendChild(quizOverlay);

    // Lógica del Quiz
    if (quizBtn) {
        quizBtn.onclick = () => {
            const rows = document.querySelectorAll('.lab-row');
            if (rows.length === 0) return alert("Por favor, lade zuerst eine Lektion hoch!");
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
    
    // Seleccionar palabra 1 y respuesta correcta
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
