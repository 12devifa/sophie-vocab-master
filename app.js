// ==============================================================
// SOPHIE: VOCAB MASTER - V9.2 (LUXURY ENGINE & SMART THEME 💎)
// ==============================================================

const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');
const quizBtn = document.getElementById('quizBtn');
const newNoteBtn = document.getElementById('newNoteBtn');
const themeToggle = document.getElementById('themeToggle'); // El nuevo checkbox
const exportBtn = document.getElementById('exportBtn');
const langSelect = document.getElementById('langSelect');
const swapLangBtn = document.getElementById('swapLangBtn'); 
const audioMode = document.getElementById('audioMode'); 
const magicOrderBtn = document.getElementById('magicOrderBtn'); 

let isSwapped = false; 

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

// --- CARGA INICIAL ---
window.addEventListener('DOMContentLoaded', () => {
    // Recuperar Tema
    const savedTheme = localStorage.getItem('sophie_theme');
    if (savedTheme === 'light' && themeToggle) {
        themeToggle.checked = true;
        document.body.classList.add('light-theme');
    }

    loadStreak(); 
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText && textInput) textInput.value = savedText;
    
    // Cargar historial con diseño nuevo
    const savedLessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    savedLessons.forEach(l => createCardUI(l.content, l.date));
});

// --- LÓGICA DE LA IA (GEMINI 2.5) ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return alert("Bitte zuerst Text eingeben!");

        let userApiKey = localStorage.getItem('sophie_gemini_key');
        if (!userApiKey) {
            userApiKey = prompt("🔒 Introduce tu Google API Key:");
            if (!userApiKey) return;
            localStorage.setItem('sophie_gemini_key', userApiKey.trim());
        }

        const mode = langSelect.value;
        let langPrompt = mode === 'fr-de' ? "Französisch zu Deutsch" : "Idiomas seleccionados";

        magicOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pensando...';
        magicOrderBtn.disabled = true;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`;
        
        const systemPrompt = `Du bist ein strenger Vokabel-Lehrer. Format: 'Wort 1 → Wort 2 | Beispielsatz'. Nur die Liste antworten. Sprachen: ${langPrompt}. Texto: ${rawText}`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
            });

            const data = await response.json();
            if (data.error) {
                alert("Error: " + data.error.message);
                localStorage.removeItem('sophie_gemini_key');
                return;
            }

            if (data.candidates) {
                textInput.value = data.candidates[0].content.parts[0].text.trim();
                if(processBtn) processBtn.click(); // ¡Automatización activa!
            }
        } catch (error) {
            alert("Error de conexión");
        } finally {
            magicOrderBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Ordenar con IA';
            magicOrderBtn.disabled = false;
        }
    });
}

// --- CREAR TARJETAS (DISEÑO PREMIUM) ---
if (processBtn) {
    processBtn.addEventListener('click', () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return;
        labList.innerHTML = '';
        const lines = rawText.split('\n');
        const config = getLangConfig(langSelect.value, isSwapped);

        lines.forEach(line => {
            if (!line.includes('→')) return;
            
            let [vocab, example] = line.split('|');
            let [word1, word2] = vocab.split('→');

            const row = document.createElement('div');
            row.className = 'lab-row';
            
            row.innerHTML = `
                <div class="vocab-container">
                    <div class="vocab-word">
                        <span class="flag">${config.flag1}</span> ${word1.trim()}
                    </div>
                    <div class="vocab-word">
                        <span class="flag">${config.flag2}</span> ${word2.trim()}
                    </div>
                </div>
                ${example ? `
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                    <small style="color:var(--text-secondary); font-style:italic;">💡 ${example.trim()}</small>
                    <button class="play-example" onclick="speak('${example.trim().replace(/'/g, "\\'")}', '${config.voice1}')">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>` : ''}
            `;
            labList.appendChild(row);
        });
        saveLesson(rawText);
    });
}

// --- FUNCIONES DE APOYO ---
function getLangConfig(mode, swapped) {
    let configs = {
        'fr-de': { f1:'🇫🇷', f2:'🇩🇪', v1:'fr-FR', v2:'de-DE' },
        'en-es': { f1:'🇬🇧', f2:'🇪🇸', v1:'en-US', v2:'es-ES' },
        'es-de': { f1:'🇪🇸', f2:'🇩🇪', v1:'es-ES', v2:'de-DE' },
        'en-de': { f1:'🇬🇧', f2:'🇩🇪', v1:'en-US', v2:'de-DE' },
        'pt-de': { f1:'🇵🇹', f2:'🇩🇪', v1:'pt-PT', v2:'de-DE' }
    };
    let c = configs[mode] || configs['fr-de'];
    return swapped ? { flag1:c.f2, flag2:c.f1, voice1:c.v2, voice2:c.v1 } : { flag1:c.f1, flag2:c.f2, voice1:c.v1, voice2:c.v2 };
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
    if (!lessons.find(l => l.title === title)) {
        lessons.push({ title, content, date: new Date().toLocaleDateString() });
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
        createCardUI(content, new Date().toLocaleDateString());
    }
}

function createCardUI(content, date) {
    const title = content.split('\n')[0].substring(0, 25);
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px;">
            <i class="fas fa-book-bookmark" style="color:var(--accent-purple)"></i>
            <div>
                <div style="font-weight:700; font-size:0.9rem;">${title}</div>
                <div style="font-size:0.7rem; color:var(--text-secondary)">${date}</div>
            </div>
        </div>
    `;
    card.onclick = () => { textInput.value = content; processBtn.click(); };
    if(notebookGallery) notebookGallery.prepend(card);
}

function loadStreak() {
    const streak = localStorage.getItem('sophie_streak') || 0;
    document.getElementById('streakNumber').innerText = streak;
}

// Botones auxiliares
if(newNoteBtn) newNoteBtn.onclick = () => { textInput.value = ""; labList.innerHTML = ""; };
if(swapLangBtn) swapLangBtn.onclick = () => { isSwapped = !isSwapped; swapLangBtn.classList.toggle('active'); };
