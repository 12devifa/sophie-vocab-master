// ==============================================================
// SOPHIE: VOCAB MASTER - V8.1 (SISTEMA DE SEGURIDAD PRIVADO 🔒)
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

// --- 0. SISTEMA DE RACHAS (STREAKS) ---
function loadStreak() {
    let streak = parseInt(localStorage.getItem('sophie_streak')) || 0;
    const streakEl = document.getElementById('streakNumber');
    if(streakEl) streakEl.innerText = streak;
}

function updateStreak() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let lastActivity = localStorage.getItem('sophie_last_activity_time');
    let streak = parseInt(localStorage.getItem('sophie_streak')) || 0;

    if (lastActivity) {
        lastActivity = parseInt(lastActivity);
        const diffTime = Math.abs(today - lastActivity);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 0) {
            // Ya estudió hoy
        } else if (diffDays === 1) {
            streak++; animateStreak();
        } else {
            streak = 1; animateStreak();
        }
    } else {
        streak = 1; animateStreak();
    }
    localStorage.setItem('sophie_last_activity_time', today.toString());
    localStorage.setItem('sophie_streak', streak.toString());
    const streakEl = document.getElementById('streakNumber');
    if(streakEl) streakEl.innerText = streak;
}

function animateStreak() {
    const box = document.getElementById('streakCounter');
    if (box) {
        box.style.transform = "scale(1.2) rotate(5deg)";
        setTimeout(() => box.style.transform = "scale(1) rotate(0deg)", 400);
    }
}

// --- 1. BOTÓN MÁGICO Y SEGURIDAD DE LLAVE ✨ ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return alert("Bitte zuerst Text eingeben! (Introduce texto primero)");

        // SISTEMA SEGURO: Pedir llave si no está guardada en el navegador
        let userApiKey = localStorage.getItem('sophie_gemini_key');
        if (!userApiKey) {
            userApiKey = prompt("🔒 Sicherheit zuerst! Bitte füge hier deinen Google API Key ein (er wird nur privat in deinem Browser gespeichert):");
            if (!userApiKey || userApiKey.trim() === "") return alert("Aktion abgebrochen. API-Key wird benötigt.");
            localStorage.setItem('sophie_gemini_key', userApiKey.trim());
        }

        const mode = langSelect ? langSelect.value : 'fr-de';
        let langPrompt = "Sprache 1 zu Sprache 2";
        if (mode === 'fr-de') langPrompt = "Französisch zu Deutsch";
        if (mode === 'en-es') langPrompt = "Englisch zu Spanisch";
        if (mode === 'es-de') langPrompt = "Spanisch zu Deutsch";
        if (mode === 'en-de') langPrompt = "Englisch zu Deutsch";
        if (mode === 'pt-de') langPrompt = "Portugiesisch zu Deutsch";

        magicOrderBtn.innerHTML = "✨ KI denkt nach... ⏳";
        magicOrderBtn.style.opacity = "0.7";
        magicOrderBtn.disabled = true;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`;
        
        const systemPrompt = `Du bist ein strenger Vokabel-Lehrer. Der Benutzer gibt dir eine unordentliche Liste von Wörtern. Deine Aufgabe ist es, sie in DIESEM genauen Format zu strukturieren:
'Wort in Sprache 1 → Übersetzung in Sprache 2 | Ein passender Beispielsatz in Sprache 1'

Regeln:
1. Die Sprachen sind: ${langPrompt}.
2. Das Trennzeichen für die Übersetzung MUSS ein Pfeil '→' sein.
3. Das Trennzeichen für den Beispielsatz MUSS ein senkrechter Strich '|' sein.
4. Wenn ein Beispielsatz fehlt, ERFINDE EINEN natürlichen und passenden.
5. Antworte NUR mit der sauberen Liste. Kein 'Hallo', keine Erklärungen.

Unordentlicher Text:
${rawText}`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
            });

            const data = await response.json();
            
            // Si la llave guardada era mala o Google la bloqueó, la borramos para volver a pedirla
            if (data.error) {
                localStorage.removeItem('sophie_gemini_key');
                alert("❌ Fehler: API-Key ungültig oder abgelaufen. Bitte versuche es erneut mit einem neuen Key.");
                return;
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                textInput.value = data.candidates[0].content.parts[0].text.trim();
                localStorage.setItem('sophie_last_input', textInput.value);
            } else {
                alert("❌ Fehler bei der KI-Antwort.");
            }
        } catch (error) {
            alert("❌ Verbindungsfehler zur KI.");
        } finally {
            magicOrderBtn.innerHTML = "✨ Automagisch mit KI ordnen";
            magicOrderBtn.style.opacity = "1";
            magicOrderBtn.disabled = false;
        }
    });
}

// --- 2. RESTO DE FUNCIONES (Diseño, carga, guardado, voces y quiz) ---
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.innerText = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
        try { localStorage.setItem('sophie_light_mode', document.body.classList.contains('light-theme')); } catch(e){}
    });
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        if (localStorage.getItem('sophie_light_mode') === 'true') {
            document.body.classList.add('light-theme');
            if(themeToggle) themeToggle.innerText = '🌙';
        }
    } catch(e){}
    loadStreak(); 
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText && textInput) textInput.value = savedText;
    const saved = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    saved.forEach(l => createCardUI(l.content, l.date));
});

if (newNoteBtn) {
    newNoteBtn.addEventListener('click', () => { textInput.value = ""; localStorage.setItem('sophie_last_input', ""); });
}
if (textInput) {
    textInput.addEventListener('input', (e) => localStorage.setItem('sophie_last_input', e.target.value));
}
if (swapLangBtn) {
    swapLangBtn.addEventListener('click', () => { isSwapped = !isSwapped; swapLangBtn.style.background = isSwapped ? "#c8e6c9" : "#e0e0e0"; });
}

function getLangConfig(mode, swapped) {
    let flag1, flag2, voice1, voice2;
    switch(mode) {
        case 'fr-de': flag1='🇫🇷'; flag2='🇩🇪'; voice1='fr-FR'; voice2='de-DE'; break;
        case 'en-es': flag1='🇬🇧'; flag2='🇪🇸'; voice1='en-US'; voice2='es-ES'; break;
        case 'es-de': flag1='🇪🇸'; flag2='🇩🇪'; voice1='es-ES'; voice2='de-DE'; break;
        case 'en-de': flag1='🇬🇧'; flag2='🇩🇪'; voice1='en-US'; voice2='de-DE'; break;
        case 'pt-de': flag1='🇵🇹'; flag2='🇩🇪'; voice1='pt-PT'; voice2='de-DE'; break;
        default: flag1='🇫🇷'; flag2='🇩🇪'; voice1='fr-FR'; voice2='de-DE';
    }
    return swapped ? { flag1: flag2, flag2: flag1, voice1: voice2, voice2: voice1 } : { flag1, flag2, voice1, voice2 };
}

if (fileUpload) {
    fileUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        textInput.value = "Lese Datei... Bitte warten... ⏳";
        if(processBtn) processBtn.innerText = "⌛ SOPHIE liest...";
        try {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (evento) => { textInput.value = evento.target.result; localStorage.setItem('sophie_last_input', textInput.value); };
                reader.readAsText(file);
            } else if (file.type === "application/pdf") {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    fullText += (await page.getTextContent()).items.map(item => item.str).join(" ") + "\n";
                }
                textInput.value = fullText; localStorage.setItem('sophie_last_input', fullText);
            } else if (file.type.startsWith("image/")) {
                textInput.value = "Bild wird analysiert... ⏳";
                const result = await Tesseract.recognize(file, 'deu+fra+eng+spa+por');
                textInput.value = result.data.text; localStorage.setItem('sophie_last_input', textInput.value);
            } else { textInput.value = "❌ Format wird nicht unterstützt."; }
        } catch (error) { textInput.value = "❌ Fehler beim Lesen der Datei."; }
        fileUpload.value = '';
        if(processBtn) processBtn.innerText = "Lektion verarbeiten (Manuell)";
    });
}

if (processBtn) {
    processBtn.addEventListener('click', () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return;
        labList.innerHTML = '';
        const lines = rawText.split('\n');
        const mode = langSelect ? langSelect.value : 'fr-de';
        const config = getLangConfig(mode, isSwapped);

        lines.forEach(line => {
            if (!line.trim()) return;
            let cleanLine = line.replace(/\[.*?\]/g, ''); 
            let exampleText = "";
            if (cleanLine.includes('|')) {
                const partsWithExample = cleanLine.split('|');
                cleanLine = partsWithExample[0]; exampleText = partsWithExample[1].trim(); 
            }
            let parts = cleanLine.includes('→') ? cleanLine.split('→') : cleanLine.trim().split(/\s{2,}/);

            if (parts.length >= 2) {
                const row = document.createElement('div'); row.className = 'lab-row';
                row.style = "padding:12px; border-bottom:1px solid #eee; display:flex; flex-direction:column; gap:8px;";
                let text1 = parts[0].trim(); let text2 = parts.slice(-1)[0].trim();
                if (isSwapped) { let temp = text1; text1 = text2; text2 = temp; }
                
                row.dataset.text1 = text1; row.dataset.text2 = text2;
                row.dataset.voice1 = config.voice1; row.dataset.voice2 = config.voice2; row.dataset.example = exampleText; 

                const vocabContainer = document.createElement('div');
                vocabContainer.style = "display:flex; justify-content:space-between; width:100%; align-items: center;";
                vocabContainer.innerHTML = `<span>${config.flag1} ${text1}</span> <span>${config.flag2} ${text2}</span>`;
                row.appendChild(vocabContainer);

                if (exampleText !== "") {
                    const btnCtx = document.createElement('button');
                    btnCtx.innerHTML = "📖 Kontext anzeigen";
                    btnCtx.style = "font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #d1d5db; background: #f3f4f6; cursor: pointer; align-self: flex-start; color: #4b5563; font-weight: bold;";
                    const divCtx = document.createElement('div');
                    divCtx.style = "display: none; background: #e0f2fe; padding: 10px; border-radius: 8px; font-size: 0.9rem; color: #0369a1; margin-top: 5px; font-style: italic;";
                    divCtx.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;"><span>💡 ${exampleText}</span><button class="play-example" title="Anhören" style="background:white; border:1px solid #bae6fd; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; flex-shrink:0; margin-left:10px;">🔊</button></div>`;
                    const speakerBtn = divCtx.querySelector('.play-example');
                    speakerBtn.onclick = (e) => { e.stopPropagation(); speak(exampleText, config.voice1); };
                    btnCtx.onclick = () => {
                        if (divCtx.style.display === 'none') { divCtx.style.display = 'block'; btnCtx.innerHTML = "🙈 Kontext ausblenden"; btnCtx.style.background = "#dbeafe"; } 
                        else { divCtx.style.display = 'none'; btnCtx.innerHTML = "📖 Kontext anzeigen"; btnCtx.style.background = "#f3f4f6"; }
                    };
                    row.appendChild(btnCtx); row.appendChild(divCtx);
                }
                labList.appendChild(row);
            }
        });
        saveLesson(rawText);
    });
}

function saveLesson(content) {
    let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    const title = content.trim().split('\n')[0].substring(0, 30);
    const existingIndex = lessons.findIndex(l => l.title === title);
    if (existingIndex !== -1) { lessons[existingIndex].content = content; lessons[existingIndex].date = new Date().toLocaleDateString(); } 
    else { lessons.push({ title, content, date: new Date().toLocaleDateString() }); }
    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    notebookGallery.innerHTML = ''; lessons.forEach(l => createCardUI(l.content, l.date));
}

function createCardUI(content, date) {
    const title = content.trim().split('\n')[0].substring(0, 30);
    const card = document.createElement('div'); card.className = 'gallery-card';
    card.innerHTML = `<div style="display: flex; align-items: center; gap: 15px; width: 100%;"><div style="font-size: 1.5rem; color: #8e918f;">📓</div><div style="flex: 1; text-align: left;"><div style="font-weight: bold; font-size: 0.95rem; color: #e3e3e3; margin-bottom: 3px;">${title}</div><div style="font-size: 0.75rem; color: #8e918f;">Erstellt am ${date}</div></div><button class="delete-btn" title="Löschen">🗑️</button></div>`;
    card.addEventListener('click', (e) => {
        if(e.target.closest('.delete-btn')) return; 
        if(textInput) textInput.value = content; localStorage.setItem('sophie_last_input', content);
    });
    const delBtn = card.querySelector('.delete-btn');
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
        lessons = lessons.filter(l => l.title !== title); 
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons)); card.remove(); 
    });
    if(notebookGallery) notebookGallery.appendChild(card);
}

let currentUtterance = null; 
async function speak(text, lang) {
    return new Promise(resolve => {
        window.speechSynthesis.cancel();
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = lang; currentUtterance.rate = 0.9;
        currentUtterance.onend = resolve; currentUtterance.onerror = resolve; 
        window.speechSynthesis.speak(currentUtterance);
    });
}

let isPlaying = false; 
const playSessionBtn = document.getElementById('playSession');
if(playSessionBtn) {
    playSessionBtn.onclick = async () => {
        const rows = document.querySelectorAll('.lab-row');
        if (rows.length === 0) return alert("Bitte zuerst eine Lektion laden!");
        if (isPlaying) { isPlaying = false; window.speechSynthesis.cancel(); playSessionBtn.innerHTML = "▶️ Sitzung fortsetzen"; playSessionBtn.style.background = "#4caf50"; return; }
        isPlaying = true; playSessionBtn.innerHTML = "⏸️ Sitzung pausieren"; playSessionBtn.style.background = "#ff9800"; 
        const actualModeSelect = document.getElementById('audioMode'); const mode = actualModeSelect ? actualModeSelect.value : 'basic';

        for (let row of rows) {
            if (!isPlaying) break; 
            row.style.background = "#fff9c4"; await speak(row.dataset.text1, row.dataset.voice1);
            if (!isPlaying) break; await new Promise(r => setTimeout(r, 1000));
            if (!isPlaying) break; await speak(row.dataset.text2, row.dataset.voice2);
            if (mode === 'full' && row.dataset.example && row.dataset.example.trim() !== "") {
                if (!isPlaying) break; await new Promise(r => setTimeout(r, 1000)); 
                if (!isPlaying) break; await speak(row.dataset.example, row.dataset.voice1); 
            }
            row.style.background = "transparent";
            if (!isPlaying) break; await new Promise(r => setTimeout(r, 1500)); 
        }
        isPlaying = false; playSessionBtn.innerHTML = "▶️ Sitzung starten"; playSessionBtn.style.background = "#4caf50"; updateStreak();
    };
}

const quizOverlay = document.createElement('div');
quizOverlay.className = 'quiz-overlay';
quizOverlay.innerHTML = `<div style="margin-top: 20px; margin-bottom: 10px; font-weight: 800; color: #ffffff; font-size: 1.4rem; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">SOPHIE QUIZ 🧠</div><div id="quizQuestion" class="quiz-card">Lädt...</div><input type="text" id="quizInput" placeholder="Übersetzung eingeben..." autocomplete="off"><div id="quizFeedback" style="min-height: 24px; margin: 10px 0; font-weight: bold; font-size: 1.1rem; text-align: center;"></div><button id="checkBtn" class="primary-btn" style="width:85%; background:#673ab7;">Überprüfen</button><button id="closeQuiz" style="margin-top:30px; background:none; border:none; color:#999; font-size:0.9rem; text-decoration:underline;">Quiz beenden</button>`;
quizOverlay.style.display = 'none'; document.body.appendChild(quizOverlay);

let currentCorrectAnswer = "";
if(quizBtn) { quizBtn.onclick = () => { const rows = document.querySelectorAll('.lab-row'); if (rows.length === 0) return alert("Bitte lade zuerst eine Lektion hoch!"); quizOverlay.style.display = 'flex'; nextQuestion(); }; }
function nextQuestion() {
    const rows = document.querySelectorAll('.lab-row'); const randomRow = rows[Math.floor(Math.random() * rows.length)];
    document.getElementById('quizQuestion').innerText = `Übersetze:\n"${randomRow.dataset.text1}"`; currentCorrectAnswer = randomRow.dataset.text2.toLowerCase().trim();
    const input = document.getElementById('quizInput'); input.value = ""; input.focus(); document.getElementById('quizFeedback').innerText = "";
}
document.getElementById('checkBtn').onclick = () => {
    const userAns = document.getElementById('quizInput').value.toLowerCase().trim(); const feedback = document.getElementById('quizFeedback'); const checkBtn = document.getElementById('checkBtn'); checkBtn.disabled = true;
    if (userAns === currentCorrectAnswer) {
        feedback.style.color = "#4ade80"; feedback.innerText = "Ausgezeichnet! 🎉 Richtig!"; updateStreak();
        setTimeout(() => { nextQuestion(); checkBtn.disabled = false; }, 1200); 
    } else {
        feedback.style.color = "#fca5a5"; feedback.innerText = `Fast... Richtig ist: ${currentCorrectAnswer.toUpperCase()}`;
        setTimeout(() => { nextQuestion(); checkBtn.disabled = false; }, 2500); 
    }
};
document.getElementById('closeQuiz').onclick = () => quizOverlay.style.display = 'none';

if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const lessons = localStorage.getItem('sophie_lessons'); if (!lessons || lessons === '[]') return alert('Es gibt noch keine Notizen.');
        const blob = new Blob([lessons], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url;
        a.download = 'SOPHIE_Backup_' + new Date().toLocaleDateString().replace(/\//g, '-') + '.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    });
}
