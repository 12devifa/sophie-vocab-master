// ==========================================
// TRADUCCIONES Y CONFIGURACIÓN INICIAL
// ==========================================
const translations = {
    en: {
        mainTitle: "Learn exactly what you need",
        subTitle: "Turn your words into mastery",
        btnAuto: "✨ Auto",
        btnWork: "💼 Work",
        btnTravel: "✈️ Travel",
        btnExam: "🎓 Exam",
        fiveMins: "⏱️ Even 5 minutes makes a difference",
        learnCommuting: "🎧 Learn while commuting, working or resting",
        smartLearning: "✨ Smart learning powered by AI",
        trainBrain: "🧠 Train your brain",
        generateBtn: "▶ START LEARNING",
        generating: "Generating...",
        library: "🗃️ My Library",
        playAll: "Play All",
        stop: "Stop",
        vocabOnly: "Vocabulary Only",
        vocabExamples: "Vocab + Examples",
        exportBtn: "<i class=\"fas fa-download\"></i> Export",
        placeholderText: "Paste anything you need to learn...\nNotes, phrases, last-minute prep...",
        langEnEs: "EN English → ES Spanish",
        langFrDe: "FR French → DE German",
        langDeEs: "DE German → ES Spanish",
        langDeEn: "DE German → EN English",
        langPtDe: "PT Portuguese → DE German",
        langEsDe: "ES Spanish → DE German",
        
        
        // ✨ NUEVOS TEXTOS DEL PANEL EN VIVO ✨
        panelTitle: "Learning in progress",
        panelSubtitle: "Adapts in real time",
        statListening: "Listening",
        statTerms: "Active terms",
        statStatus: "Loop status",
        passiveTitle: "Passive learning",
        statusPaused: "Paused",
        statusRunning: "Running",
        statusFinished: "Finished",
        feedbackPaused: "Loop paused. Ready when you are.",
        feedbackRunning: "Your brain is adapting through repetition...",
        feedbackFinished: "Great session! Ready for more?",
        btnResume: "Resume your loop",
        btnPause: "Pause loop",
       btnStartOver: "Start over",
        btnStartLoop: "Start your loop",
        passiveText1: "You trained ",
        passiveText2: " minutes while commuting.",
        passiveXpText: " Passive XP",
        quoteInit: '"Your brain adapts through repetition."'
    },
    de: {
        mainTitle: "Lerne genau das, was du brauchst",
        subTitle: "Verwandle deine Worte in Meisterschaft",
        btnAuto: "✨ Auto",
        btnWork: "💼 Arbeit",
        btnTravel: "✈️ Reisen",
        btnExam: "🎓 Prüfung",
        fiveMins: "⏱️ Schon 5 Minuten machen einen Unterschied",
        learnCommuting: "🎧 Lerne beim Pendeln, Arbeiten oder Ausruhen",
        smartLearning: "✨ Intelligentes Lernen mit KI",
        trainBrain: "🧠 Trainiere dein Gehirn",
        generateBtn: "▶ LERNEN STARTEN",
        generating: "Erstelle...",
        library: "🗃️ Meine Bibliothek",
        playAll: "Alle abspielen",
        stop: "Stopp",
        vocabOnly: "Nur Vokabeln",
        vocabExamples: "Vokabeln + Beispiele",
        exportBtn: "<i class=\"fas fa-download\"></i> Exportieren",
        placeholderText: "Füge alles ein, was du lernen musst...\nNotizen, Phrasen, Last-Minute-Vorbereitung...",
        langEnEs: "EN Englisch → ES Spanisch",
        langFrDe: "FR Französisch → DE Deutsch",
        langDeEs: "DE Deutsch → ES Spanisch",
        langDeEn: "DE Deutsch → EN Englisch",
        langPtDe: "PT Portugiesisch → DE Deutsch",
        langEsDe: "ES Spanisch → DE Deutsch",

        // ✨ NUEVOS TEXTOS DEL PANEL EN VIVO ✨
        panelTitle: "Lernen im Gange",
        panelSubtitle: "Passt sich in Echtzeit an",
        statListening: "Zuhören",
        statTerms: "Aktive Begriffe",
        statStatus: "Loop-Status",
        passiveTitle: "Passives Lernen",
        statusPaused: "Pausiert",
        statusRunning: "Läuft",
        statusFinished: "Beendet",
        feedbackPaused: "Loop pausiert. Bereit, wenn du es bist.",
        feedbackRunning: "Dein Gehirn passt sich durch Wiederholung an...",
        feedbackFinished: "Tolle Sitzung! Bereit für mehr?",
        btnResume: "Loop fortsetzen",
        btnPause: "Loop pausieren",
        btnStartOver: "Neu starten",
        btnStartLoop: "Starte deinen Loop",
        passiveText1: "Du hast ",
        passiveText2: " Minuten beim Pendeln trainiert.",
        passiveXpText: " Passive XP",
        quoteInit: '"Dein Gehirn passt sich durch Wiederholung an."'
    }
};

function changeLanguage(lang) {
    localStorage.setItem('sophie_lang', lang);
    const t = translations[lang];
    
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(lang === 'en' ? 'btn-en' : 'btn-de');
    if (activeBtn) activeBtn.classList.add('active');
    
    const libTitle = document.querySelector('.library-title-text');
    if (libTitle) libTitle.innerHTML = `<i class="fas fa-archive"></i> ${t.library}`;
    
    const playAllBtn = document.getElementById('btn-play-all');
    if (playAllBtn && !playAllBtn.innerHTML.includes('fa-stop')) {
        playAllBtn.innerHTML = `<i class="fas fa-play"></i> ${t.playAll}`;
    }
    
    document.querySelectorAll('option[value="basic"]').forEach(opt => { opt.textContent = t.vocabOnly; });
    document.querySelectorAll('option[value="full"]').forEach(opt => { opt.textContent = t.vocabExamples; });

    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        const translationKey = element.getAttribute('data-translate');
        if (t[translationKey]) {
            if (element.tagName === 'TEXTAREA') {
                element.placeholder = t[translationKey];
            } else {
                element.innerHTML = t[translationKey];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('sophie_lang') || 'de'; 
    changeLanguage(savedLang);
});

// ==========================================
// 🎙️ ELENCO DE VOCES (NOTEBOOK LM)
// ==========================================
const SOPHIE_VOICES = {
    "EN": "EXAVITQu4vr4xnSDxMaL",
    "DE": "N2lVS1w4EtoT3dr4eOWO",
    "ES": "XrExE9yKIg1WjnnlVkGX",
    "FR": "cgSgspJ2msm6clMCkdW9", 
    "PT": "qPfM2laM0pRL4rrZtBGl", 
    "IT": "ZQe5CZNOzWqw6CGcgHmAS"
};

// ==========================================
// 🧠 MEMORIA DE CONTEXTO DE SOPHIE
// ==========================================
let sophieContext = "general";

document.addEventListener('DOMContentLoaded', () => {
    const ctxBtns = document.querySelectorAll('.ctx-btn');
    ctxBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            ctxBtns.forEach(b => {
                b.style.background = 'transparent';
                b.style.borderColor = 'rgba(255,255,255,0.2)';
            });
            btn.style.background = 'rgba(187,134,252,0.2)';
            btn.style.borderColor = '#bb86fc';
            sophieContext = btn.dataset.ctx; 
        };
    });
});

// ==============================================================
// SOPHIE.ai - VERSIÓN DEFINITIVA (BÓVEDA SEGURA EN LA NUBE) 💎
// ==============================================================

const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const newNoteBtn = document.getElementById('newNoteBtn');
const themeToggle = document.getElementById('themeToggle');
const langSelect = document.getElementById('langSelect');
const swapLangBtn = document.getElementById('swapLangBtn');
const audioMode = document.getElementById('audioMode');
const magicOrderBtn = document.getElementById('magicOrderBtn');
const playSessionBtn = document.getElementById('playSession');

let isSwapped = false;
let isPlaying = false; 
window.userCurrentGoal = 'auto'; 

// --- 1. GESTIÓN DEL TEMA Y CARGA INICIAL ---
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

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('sophie_theme');
    if (savedTheme === 'light' && themeToggle) {
        themeToggle.checked = true;
        document.body.classList.add('light-theme');
    }

    const savedLessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    savedLessons.forEach(l => createCardUI(l.content, l.date));
    
    loadStreak();
    const savedText = localStorage.getItem('sophie_last_input');
    if (savedText && textInput) textInput.value = savedText;

    const goalChips = document.querySelectorAll('.goal-chip');
    const microcopyText = document.getElementById('goalMicrocopy');
    const goalMessages = {
        'auto': '⏱ Even 5 minutes makes a difference',
        'work': '💼 Optimized for meetings & professional communication',
        'travel': '✈️ Focus on real-life travel situations',
        'exam': '🎓 Prioritizing high-retention learning'
    };

    goalChips.forEach(chip => {
        chip.addEventListener('click', () => {
            goalChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            window.userCurrentGoal = chip.getAttribute('data-goal');
            if(microcopyText) {
                microcopyText.style.opacity = 0;
                setTimeout(() => {
                    microcopyText.textContent = goalMessages[window.userCurrentGoal];
                    microcopyText.style.opacity = 1;
                }, 200);
            }
        });
    });
});

const closeDashboardBtn = document.getElementById('closeDashboardBtn');
if(closeDashboardBtn) {
    closeDashboardBtn.onclick = () => {
        document.getElementById('cognitiveDashboard').style.display = 'none';
    };
}

// --- 2. LÓGICA DE LA IA (CONEXIÓN SEGURA AL ROBOT GEMINI) ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput ? textInput.value : "";
        if (!rawText.trim()) return alert("Por favor, pega algo de texto primero.");

        magicOrderBtn.innerHTML = '<i class="fas fa-sparkles"></i> ✨ Analyzing your input...';
        magicOrderBtn.style.opacity = '0.7';
        magicOrderBtn.style.pointerEvents = 'none'; 
        
        await new Promise(resolve => setTimeout(resolve, 500));
        const mode = langSelect ? langSelect.value : 'fr-de';
        const config = getLangConfig(mode, isSwapped);

        magicOrderBtn.innerHTML = '<i class="fas fa-brain fa-pulse"></i> Analyzing...';
        magicOrderBtn.disabled = true;

        const systemPrompt = `
        Eres SOPHIE.ai, una experta en neuroaprendizaje y traductora políglota nativa.
        MISIÓN: El usuario te ha dado un texto. Tu trabajo es TRADUCIRLO TODO a los nuevos idiomas seleccionados, sin importar en qué idioma estaba escrito originalmente.
        
        NUEVOS IDIOMAS SELECCIONADOS:
        - Idioma Destino: ${config.name1}
        - Idioma Base: ${config.name2}

        REGLAS ESTRICTAS E INQUEBRANTABLES: 
        1. DEBES re-traducir todos los conceptos a ${config.name1} y ${config.name2}.
        2. El campo "original" DEBE estar SIEMPRE en ${config.name1}.
        3. El campo "translation" DEBE estar SIEMPRE en ${config.name2}.
        4. El campo "context" (ejemplo) DEBE estar escrito SIEMPRE y ÚNICAMENTE en ${config.name1} (frase real y natural).

        OBJETIVO: "${window.userCurrentGoal}".

        DEVUELVE ÚNICAMENTE UN JSON CON ESTA ESTRUCTURA:
        {
          "detected_language": "Idioma original detectado",
          "wow_message": "Mensaje motivador corto en ${config.name1}",
          "flashcards": [
            {
              "original": "Palabra en ${config.name1}",
              "translation": "Traducción en ${config.name2}",
              "context": "Ejemplo en ${config.name1}"
            }
          ]
        }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemPrompt: systemPrompt,
                    context: sophieContext + ". Si es trabajo, usa lenguaje de oficina. Si es viaje, usa lenguaje de turista. Genera ejemplos que tengan sentido real en ese escenario.",
                    rawText: rawText
                })
            });

            if (!response.ok) {
                throw new Error("Fallo de comunicación con el servidor seguro.");
            }

            const data = await response.json();
            let aiResponseText = data.candidates[0].content.parts[0].text;
            
            aiResponseText = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(aiResponseText);

            let finalFormattedText = "";
            parsedData.flashcards.forEach(card => {
                finalFormattedText += `${card.original} → ${card.translation} | ${card.context}\n`;
            });

            textInput.value = finalFormattedText.trim();
            localStorage.setItem('sophie_last_input', textInput.value);

            const termsCount = parsedData.flashcards.length;
            
            magicOrderBtn.innerHTML = `<span style="display:flex; align-items:center; gap:10px; color: white;">
                <i class="fas fa-play-circle" style="font-size:1.2rem; color:#4ade80;"></i>
                <span style="font-weight:700;">Start your loop</span>
                <span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:10px; font-size:0.8rem; border:1px solid rgba(255,255,255,0.2); color: white;">${termsCount} terms</span>
            </span>`;
            
            magicOrderBtn.style.background = "linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(187, 134, 252, 0.15) 100%)";
            magicOrderBtn.style.border = "1px solid rgba(74, 222, 128, 0.5)";
            magicOrderBtn.style.boxShadow = "0 0 20px rgba(74, 222, 128, 0.2)";
            
            magicOrderBtn.disabled = false;
            magicOrderBtn.style.pointerEvents = 'auto';
            magicOrderBtn.style.opacity = '1';
            
            magicOrderBtn.onclick = (e) => {
                if(e) e.preventDefault();
                
                magicOrderBtn.style.display = 'none';
                
                setTimeout(() => {
                    if (!isPlaying && typeof startLoopProcess === 'function') {
                        startLoopProcess();
                    }
                }, 100);
            };

            magicOrderBtn.style.display = 'flex';
            if(processBtn) processBtn.style.display = 'flex';
            if(processBtn) processBtn.click();

        } catch (error) {
            console.error(error);
            alert("Hubo un error al procesar. Intenta de nuevo."); 
            magicOrderBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Audio Lesson';
            magicOrderBtn.disabled = false;
            magicOrderBtn.style.pointerEvents = 'auto';
            magicOrderBtn.style.opacity = '1';
        }
    });
}

// --- 3. CREAR TARJETAS VISUALES ---
if (processBtn) {
    processBtn.addEventListener('click', () => {
        labList.innerHTML = ''; 
        window.speechSynthesis.cancel(); 
        const rawText = textInput.value;
        if (!rawText.trim()) return;
        
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
            row.dataset.text1 = word1;
            row.dataset.text2 = word2;
            row.dataset.example = exampleText;

          row.innerHTML = `
                <div class="vocab-container" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <div class="vocab-word" style="font-weight:600; display:flex; align-items:center; gap:8px;">
                        <span class="flag">${config.flag1}</span> ${word1}
                        <button onclick="speakEleven('${word1.replace(/'/g, "\\'")}', this)" style="background:none; border:none; color:var(--accent-purple); cursor:pointer; font-size:1.1rem; padding:5px;">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="vocab-word" style="font-weight:600; display:flex; align-items:center; gap:8px;">
                        <span class="flag">${config.flag2}</span> ${word2}
                    </div>
                </div>
                ${exampleText ? `
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:8px;">
                    <small style="color:var(--text-secondary); font-style:italic; font-size:0.85rem;">💡 ${exampleText}</small>
                    <button class="play-example" onclick="speakEleven('${exampleText.replace(/'/g, "\\'")}', this)" style="background:transparent; border:none; border-radius:50%; width:35px; height:35px; color:var(--accent-purple); cursor:pointer;">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>` : ''}
            `;
            if(labList) labList.appendChild(row);
        });
        saveLesson(rawText);
    });
}

// ==========================================
// 🎙️ 4. MOTOR PREMIUM ELEVENLABS (CONEXIÓN SEGURA) 🧠
// ==========================================

const masterAudio = new Audio();
let audioCache = {}; 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ REEMPLAZA TUS FUNCIONES VISUALES CON ESTAS
async function activateRowVisuals(row, borderColor, shadowColor) {
    await delay(50);
    // Forzamos el diseño premium y la transición suave
    row.style.transition = "all 0.3s ease";
    row.style.border = `2px solid ${borderColor}`;
    row.style.boxShadow = `0 0 15px ${shadowColor}`;
    // El motor se encarga del scroll de forma segura
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(150); 
}

function deactivateRowVisuals(row) {
    // Restauramos al color por defecto para que la tarjeta se "apague"
    row.style.border = "1px solid var(--border-color)";
    row.style.boxShadow = "none";
}

async function speakEleven(text, buttonElement) {
    const originalIcon = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    buttonElement.disabled = true;

    try {
        const url = await getAudioFromCacheOrAPI(text);
        const audio = new Audio(url);
        audio.play();

        audio.onended = () => { buttonElement.innerHTML = originalIcon; buttonElement.disabled = false; };
        audio.onerror = () => { buttonElement.innerHTML = originalIcon; buttonElement.disabled = false; };
    } catch (error) {
        console.error(error);
        buttonElement.innerHTML = originalIcon; buttonElement.disabled = false;
    }
}

// 💽 EL DESCARGADOR INTELIGENTE
async function getAudioFromCacheOrAPI(text, voiceId = "21m00Tcm4TlvDq8ikWAM") {
    const cacheKey = text + "_" + voiceId; 
    
    if (audioCache[cacheKey]) {
        console.log("♻️ Audio reciclado (Gratis):", text);
        return audioCache[cacheKey];
    }

    const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, voiceId: voiceId })
    });

    if (!response.ok) throw new Error("Fallo de conexión con el servidor de audio");

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    audioCache[cacheKey] = audioUrl; 
    return audioUrl;
}

async function playAudioNode(text, volume = 1.0, voiceId = "21m00Tcm4TlvDq8ikWAM") {
    if (!isPlaying) return;
    try {
        const url = await getAudioFromCacheOrAPI(text, voiceId);
        return new Promise((resolve) => {
            masterAudio.src = url;
            masterAudio.volume = volume; 
            masterAudio.onended = resolve;
            masterAudio.onerror = () => resolve();
            masterAudio.play().catch(() => resolve());
        });
    } catch (e) {
        console.error("Error reproduciendo:", e);
    }
}

// ==========================================
// 🎼 LÓGICA DEL BOTÓN ESCUCHAR TODO Y PANEL EN VIVO
// ==========================================

const playBtns = [
    document.getElementById('playSession'), 
    document.getElementById('btn-play-all'), 
    document.getElementById('btn-resume-loop')
].filter(Boolean);

let listeningTimer = null;
let secondsListened = 0;

const startLoopProcess = async () => {
    window.speechSynthesis.cancel(); 
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("Procesa una lección primero.");

    const currentLang = localStorage.getItem('sophie_lang') || 'en';
    const t = translations[currentLang] || translations['en'];

    const statLoop = document.getElementById('stat-loop');
    const statTerms = document.getElementById('stat-terms');
    const statListening = document.getElementById('stat-listening');
    const dynamicFeedback = document.getElementById('dynamic-feedback');
    
    if(statTerms) statTerms.innerText = rows.length;

    if (isPlaying) {
        isPlaying = false;
        masterAudio.pause();
        playBtns.forEach(btn => {
            if(btn.id === 'btn-resume-loop') btn.innerText = t.btnResume;
            else btn.innerHTML = `<i class="fas fa-play"></i> ${t.playAll}`;
        });
        if(statLoop) { statLoop.innerText = t.statusPaused; statLoop.className = "status-value paused"; }
        if(dynamicFeedback) dynamicFeedback.innerText = t.feedbackPaused;
        clearInterval(listeningTimer);
        rows.forEach(r => deactivateRowVisuals(r));
        return;
    }

    isPlaying = true;
    playBtns.forEach(btn => {
        if(btn.id === 'btn-resume-loop') btn.innerText = t.btnPause;
        else btn.innerHTML = `<i class="fas fa-pause"></i> ${t.stop}`; 
    });
    
    if(statLoop) { statLoop.innerText = t.statusRunning; statLoop.className = "status-value running"; }
    if(dynamicFeedback) dynamicFeedback.innerText = t.feedbackRunning;
    


    clearInterval(listeningTimer);
    listeningTimer = setInterval(() => {
        secondsListened++;
        const mins = Math.floor(secondsListened / 60);
        const secs = secondsListened % 60;
        if(statListening) statListening.innerText = `${mins}:${secs.toString().padStart(2, '0')} min`;
        
        const passiveXp = document.getElementById('passive-xp');
        if(passiveXp && secondsListened % 10 === 0) passiveXp.innerText = parseInt(passiveXp.innerText) + 5;
        const passiveMins = document.getElementById('passive-mins');
        if(passiveMins) passiveMins.innerText = mins;
    }, 1000);

    masterAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    masterAudio.playbackRate = 0.90; 
    masterAudio.play().catch(() => {});

    let currentMode = langSelect ? langSelect.value : 'en-es';
    let parts = currentMode.split('-');
    let baseLangCode = isSwapped ? parts[1].toUpperCase() : parts[0].toUpperCase();
    let targetLangCode = isSwapped ? parts[0].toUpperCase() : parts[1].toUpperCase();
    
    const vozBase = SOPHIE_VOICES[baseLangCode] || SOPHIE_VOICES["EN"];
   // 🚀 INICIO DEL NUEVO MOTOR
    const dropMode = document.getElementById('playerMode') || document.getElementById('audioMode');
    const selectedMode = dropMode ? dropMode.value : 'basic';

    try {
        if (selectedMode === 'linear') {
            // 🚄 MODO LECTURA CONTINUA PARA SOPHIE (Rápido, 1 sola vez, sin pausas largas)
            masterAudio.playbackRate = 1.0;
            for (let row of rows) {
                if (!isPlaying) break;
                await activateRowVisuals(row, "var(--accent-purple)", "rgba(187,134,252,0.2)");
                let A = row.dataset.text1; let B = row.dataset.text2;

                await playAudioNode(A, 1.0, vozBase); if (!isPlaying) break; await delay(300);
                await playAudioNode(B, 1.0, vozMeta); if (!isPlaying) break; await delay(1000);

                deactivateRowVisuals(row);
            }
        } else {
            // 🧠 MODO NEURO-REPETICIÓN ORIGINAL (3 Fases para memorización profunda)
            for (let row of rows) {
                if (!isPlaying) break;
                await activateRowVisuals(row, "var(--accent-purple)", "rgba(187,134,252,0.2)");
                let A = row.dataset.text1; let B = row.dataset.text2;
                await playAudioNode(A, 1.0, vozBase); if (!isPlaying) break; await delay(500);
                await playAudioNode(B, 1.0, vozMeta); if (!isPlaying) break; await delay(2500);
                await playAudioNode(A, 0.4, vozBase); if (!isPlaying) break; await delay(1500);
                deactivateRowVisuals(row);
            }
            if (!isPlaying) throw new Error("Detenido");
            await delay(3000);

            masterAudio.playbackRate = 0.92; 
            for (let row of rows) {
                if (!isPlaying) break;
                await activateRowVisuals(row, "#fbbf24", "rgba(251,191,36,0.2)");
                let A = row.dataset.text1; let B = row.dataset.text2;
                await playAudioNode(B, 1.0, vozMeta); await delay(1200); if (!isPlaying) break;
                await playAudioNode(A, 1.0, vozBase); await delay(2000); if (!isPlaying) break;
                await playAudioNode(A, 1.0, vozBase); await delay(1000); if (!isPlaying) break;
                await playAudioNode(B, 1.0, vozMeta); await delay(1000); if (!isPlaying) break;
                await playAudioNode(A, 0.82, vozBase); await delay(2000); 
                deactivateRowVisuals(row);
            }
            if (!isPlaying) throw new Error("Detenido");
            await delay(3000);

            masterAudio.playbackRate = 0.88; 
            for (let row of rows) {
                if (!isPlaying) break;
                await activateRowVisuals(row, "#4ade80", "rgba(74,222,128,0.2)");
                let A = row.dataset.text1; let B = row.dataset.text2;
                await playAudioNode(A, 1.0, vozBase); await delay(2500); if (!isPlaying) break;
                await playAudioNode(B, 1.0, vozMeta); await delay(2500);
                deactivateRowVisuals(row);
            }

            if (selectedMode === 'full' && isPlaying) {
                await delay(2000);
                for (let row of rows) {
                    if (!isPlaying) break;
                    let example = row.dataset.example;
                    if (example && example.trim() !== "") {
                        await activateRowVisuals(row, "var(--accent-purple)", "rgba(187,134,252,0.2)");
                        await playAudioNode(example, 1.0, vozBase); 
                        await delay(1500);
                        deactivateRowVisuals(row);
                    }
                }
            }
        }
    } catch (error) {
        if (error.message !== "Detenido") console.error(error);
    }
    // 🚀 FIN DEL NUEVO MOTOR

    isPlaying = false;
    clearInterval(listeningTimer);
    rows.forEach(r => deactivateRowVisuals(r));
    if(statLoop) { statLoop.innerText = t.statusFinished; statLoop.className = "status-value"; }
    if(dynamicFeedback) dynamicFeedback.innerText = t.feedbackFinished;
    playBtns.forEach(btn => {
        if(btn.id === 'btn-resume-loop') btn.innerText = t.btnStartOver;
        else btn.innerHTML = `<i class="fas fa-play"></i> ${t.playAll}`; 
    });
};

playBtns.forEach(btn => {
    btn.onclick = startLoopProcess;
});

// --- 5. FUNCIONES DE APOYO ---
function getLangConfig(mode, swapped) {
    let configs = {
        'fr-fr': { f1:'🇫🇷', f2:'🇫🇷', n1:'Français', n2:'Français' }, // ✨ NUESTRO MODO MEMORIZACIÓN
        'de-de': { f1:'🇩🇪', f2:'🇩🇪', n1:'Deutsch', n2:'Deutsch' }, // ✨ NUESTRO NUEVO MODO ALEMÁN
        'fr-de': { f1:'🇫🇷', f2:'🇩🇪', n1:'Français', n2:'Deutsch' },
        'en-es': { f1:'🇬🇧', f2:'🇪🇸', n1:'English', n2:'Español' },
        'es-de': { f1:'🇪🇸', f2:'🇩🇪', n1:'Español', n2:'Deutsch' },
        'en-de': { f1:'🇬🇧', f2:'🇩🇪', n1:'English', n2:'Deutsch' },
        'pt-de': { f1:'🇵🇹', f2:'🇩🇪', n1:'Português', n2:'Deutsch' },
        'de-es': { f1:'🇩🇪', f2:'🇪🇸', n1:'Deutsch', n2:'Español' },
        'de-en': { f1:'🇩🇪', f2:'🇬🇧', n1:'Deutsch', n2:'English' }
    };
// ... el resto de la función sigue igual
    let c = configs[mode] || configs['en-es'];
    return swapped ? { flag1:c.f2, flag2:c.f1, name1:c.n2, name2:c.n1 } : { flag1:c.f1, flag2:c.f2, name1:c.n1, name2:c.n2 };
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
    if(notebookGallery) {
        notebookGallery.innerHTML = "";
        lessons.forEach(l => createCardUI(l.content, l.date));
    }
}

function createCardUI(content, date) {
    const title = content.split('\n')[0].substring(0, 25);
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.style.position = 'relative'; // Crucial para que el menú flote bien

    // 1. El diseño visual con los 3 puntitos al estilo NotebookLM
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding:10px 0;">
            
            <!-- Zona clickeable para cargar la lección -->
            <div class="card-content" style="display:flex; align-items:center; gap:15px; cursor:pointer; flex-grow: 1;">
                <i class="fas fa-book-bookmark" style="color:var(--accent-purple); font-size:1.4rem;"></i>
                <div>
                    <div class="card-title" style="font-weight:700; font-size:0.95rem;">${title}...</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary)">${date}</div>
                </div>
            </div>
            
            <!-- Zona del botón de opciones -->
            <div class="menu-container" style="position:relative;">
                <button class="menu-btn" style="background:none; border:none; color:#a1a1aa; padding:5px 10px; cursor:pointer; font-size: 1.2rem; transition: color 0.2s;">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                
                <!-- El menú desplegable (oculto por defecto) -->
                <div class="dropdown-menu" style="display:none; position:absolute; right:0; top:30px; background:#1e1e1e; border:1px solid #333; border-radius:8px; padding:5px; z-index:100; box-shadow: 0 4px 15px rgba(0,0,0,0.5); min-width: 140px;">
                    <button class="edit-btn" style="display:block; width:100%; text-align:left; background:none; border:none; color:white; padding:10px; cursor:pointer; border-radius:4px;"><i class="fas fa-pen" style="margin-right:8px;"></i> Editar título</button>
                    <button class="delete-btn" style="display:block; width:100%; text-align:left; background:none; border:none; color:#ff4d4d; padding:10px; cursor:pointer; border-radius:4px;"><i class="fas fa-trash" style="margin-right:8px;"></i> Eliminar</button>
                </div>
            </div>
        </div>
    `;

    // 2. Lógica para cargar la lección (solo al hacer clic en el texto/icono)
    const cardContent = card.querySelector('.card-content');
    cardContent.onclick = () => { 
        if(textInput) textInput.value = content; 
        localStorage.setItem('sophie_last_input', content); 
        if(processBtn) processBtn.click(); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 3. Conectar el menú de 3 puntitos
    const menuBtn = card.querySelector('.menu-btn');
    const dropdownMenu = card.querySelector('.dropdown-menu');
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');

    // Abrir/cerrar menú
    menuBtn.onclick = (e) => {
        e.stopPropagation(); // Evita que se cargue la lección por accidente
        document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m !== dropdownMenu) m.style.display = 'none'; // Cierra otros menús
        });
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    };

    // Cerrar si haces clic fuera
    document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
    });

    // 4. Lógica de ELIMINAR (con alerta de seguridad)
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm("¿Estás segura de que quieres eliminar esta lección para siempre?")) {
            let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
            lessons = lessons.filter(l => l.content !== content); // Filtramos la que borramos
            localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
            card.remove(); // Desaparece visualmente
        }
    };

    // 5. Lógica de EDITAR TÍTULO
    editBtn.onclick = (e) => {
        e.stopPropagation();
        const newTitle = prompt("Escribe el nuevo título para esta lección:", title);
        if (newTitle && newTitle.trim() !== "") {
            const titleElement = card.querySelector('.card-title');
            titleElement.innerText = newTitle + "...";
            
            // Guardarlo en la memoria del navegador
            let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
            const lessonIndex = lessons.findIndex(l => l.content === content);
            if (lessonIndex !== -1) {
                const lines = lessons[lessonIndex].content.split('\n');
                lines[0] = newTitle; // Reemplazamos la primera línea (que usamos como título)
                lessons[lessonIndex].content = lines.join('\n');
                localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
                content = lessons[lessonIndex].content; 
            }
        }
        dropdownMenu.style.display = 'none';
    };

    if(notebookGallery) notebookGallery.prepend(card);
}
function loadStreak() {
    const streak = parseInt(localStorage.getItem('sophie_streak')) || 0;
    const streakCounter = document.getElementById('streakCounter');
    
    if (streakCounter) {
        streakCounter.classList.remove('glow-tier-1', 'glow-tier-2');
        let iconHTML = '';
        if (streak >= 10) {
            iconHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i>✨`;
            streakCounter.classList.add('glow-tier-2'); 
        } else if (streak >= 5) {
            iconHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i>✨`;
            streakCounter.classList.add('glow-tier-1'); 
        } else if (streak >= 1) {
            iconHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i>`;
        } else {
            iconHTML = `<i class="fas fa-bolt" style="color: #6b7280;"></i>`; 
        }
        streakCounter.innerHTML = `${iconHTML} <span id="streakNumber" style="margin-left: 5px; font-weight: bold; color: white;">${streak}</span>`;
    }
}

if(newNoteBtn) newNoteBtn.onclick = () => { if(textInput) textInput.value = ""; if(labList) labList.innerHTML = ""; localStorage.setItem('sophie_last_input', ""); };
if(swapLangBtn) swapLangBtn.onclick = () => { isSwapped = !isSwapped; swapLangBtn.classList.toggle('active'); };

// ==========================================
// 🎛️ CEREBRO DEL REPRODUCTOR MAESTRO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const playerToggleBtn = document.getElementById('playerToggleBtn');
    const playerSpeedBtn = document.getElementById('playerSpeedBtn');

    if (playerToggleBtn) {
        playerToggleBtn.onclick = () => {
            if (isPlaying) {
                isPlaying = false;
                if(masterAudio) masterAudio.pause();
                playerToggleBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
                playerToggleBtn.style.background = '#fbbf24'; 
                playerToggleBtn.style.color = '#000';
            } else {
                isPlaying = true;
                const playBtn = document.getElementById('playSession');
                if(playBtn) playBtn.click(); 
                
                playerToggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
                playerToggleBtn.style.background = 'linear-gradient(135deg, #bb86fc 0%, #7c3aed 100%)';
                playerToggleBtn.style.color = 'white';
            }
        };
    }

    let currentSpeed = 1.0;
    if (playerSpeedBtn) {
        playerSpeedBtn.onclick = () => {
            if (currentSpeed === 1.0) {
                currentSpeed = 0.8;
                playerSpeedBtn.innerHTML = '<i class="fas fa-snail"></i> 0.8x';
            } else if (currentSpeed === 0.8) {
                currentSpeed = 1.2;
                playerSpeedBtn.innerHTML = '<i class="fas fa-bolt"></i> 1.2x';
            } else {
                currentSpeed = 1.0;
                playerSpeedBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> 1x';
            }
            if(masterAudio) masterAudio.playbackRate = currentSpeed;
        };
    }
});

// ==========================================
// 📚 BÓVEDA NOTEBOOKLM (LOCALSTORAGE)
// ==========================================

// 1. Función para GUARDAR la lección actual
function saveToNotebook() {
    const labList = document.getElementById('labList');
    const rawText = document.getElementById('textInput').value;
    
    if (!labList || labList.innerHTML.trim() === '') return;

    const previewTitle = rawText.split(' ').slice(0, 3).join(' ') + '...';
    
    let library = JSON.parse(localStorage.getItem('sophie_notebooks')) || [];

    const newNotebook = {
        id: Date.now(), 
        title: previewTitle,
        date: new Date().toLocaleDateString('de-CH'), 
        htmlContent: labList.innerHTML 
    };

    library.unshift(newNotebook);
    localStorage.setItem('sophie_notebooks', JSON.stringify(library));
    
    renderLibrary();
}

// 2. Función para MOSTRAR las tarjetas en tu "Mi Biblioteca"
function renderLibrary() {
    const gallery = document.getElementById('notebookGallery');
    if (!gallery) return;

    let library = JSON.parse(localStorage.getItem('sophie_notebooks')) || [];
    gallery.innerHTML = ''; 

    library.forEach(notebook => {
        const card = document.createElement('div');
        card.className = 'notebook-card'; 
        card.innerHTML = `
            <h4>${notebook.title}</h4>
            <span class="notebook-date">${notebook.date}</span>
        `;
        
        card.addEventListener('click', () => {
            const labList = document.getElementById('labList');
            labList.innerHTML = notebook.htmlContent;
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        });

        gallery.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderLibrary);

// --- REGLA 2: EXPORTAR LECCIÓN (.txt) ---
const btnExport = document.getElementById('btn-export');

if (btnExport) {
    btnExport.addEventListener('click', () => {
        const labList = document.getElementById('labList');
        if (!labList || labList.innerText.trim() === '') {
            alert('No hay ninguna lección para exportar todavía.');
            return;
        }

        const contenido = "SOPHIE AI - Repaso de Vocabulario\n==========================\n\n" + labList.innerText;
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SOPHIE_Leccion.txt'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}


// ==========================================
// 🎙️ MODO SHADOWING: LEER TEXTO COMPLETO (SIN IA)
// ==========================================
function startShadowingMode() {
    console.log("¡Iniciando Shadowing!"); // Para saber que el botón nos escucha
    
    // 1. Buscamos la caja de texto
    const txtInput = document.getElementById('textInput'); 
    const rawText = txtInput ? txtInput.value : "";
    
    if (!rawText.trim()) {
        alert("Por favor, pega el texto que quieres memorizar.");
        return;
    }

    // Regla 1: Limpieza por defecto
    const labList = document.getElementById('labList');
    if (labList) labList.innerHTML = ''; 
    window.speechSynthesis.cancel(); 

    // Configuración del idioma
    const selectLang = document.getElementById('langSelect');
    const mode = selectLang ? selectLang.value : 'fr-fr';
    const config = typeof getLangConfig === 'function' ? getLangConfig(mode, false) : { flag1: '✨' };

    // Magia: Cortamos el texto cada vez que hay un punto, interrogación o exclamación
    const sentences = rawText.match(/[^.?!]+[.?!]+/g) || [rawText];
    let finalFormattedText = "";

    sentences.forEach(sentence => {
        let cleanSentence = sentence.trim();
        if (!cleanSentence) return;

        finalFormattedText += `${cleanSentence} → ${cleanSentence}\n`;

        const row = document.createElement('div');
        row.className = 'lab-row';
        row.dataset.text1 = cleanSentence; 
        row.dataset.text2 = cleanSentence; 
        row.dataset.example = ""; 

        const container = document.createElement('div');
        container.className = 'vocab-container';
        container.style.cssText = 'display:flex; justify-content:space-between; align-items:center; width:100%;';
        
        const wordBox = document.createElement('div');
        wordBox.className = 'vocab-word';
        wordBox.style.cssText = 'font-weight:600; display:flex; align-items:center; gap:8px; line-height: 1.5; text-align: left;';
        wordBox.innerHTML = `<span class="flag">${config.flag1 || '✨'}</span> <span>${cleanSentence}</span>`;
        
        const audioBtn = document.createElement('button');
        audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        audioBtn.style.cssText = 'background:none; border:none; color:var(--accent-purple); cursor:pointer; font-size:1.2rem; padding:5px; margin-left: auto;';
        
        // Conectamos el motor de audio de ElevenLabs
        audioBtn.onclick = function() { 
            if(typeof speakEleven === 'function') speakEleven(cleanSentence, this); 
        };

        container.appendChild(wordBox);
        container.appendChild(audioBtn);
        row.appendChild(container);
        
        if (labList) labList.appendChild(row);
    });

    // Guardamos y mostramos el panel de control
    if(txtInput) txtInput.value = finalFormattedText.trim();
    if(typeof saveLesson === 'function') saveLesson(finalFormattedText.trim());

    const masterPanel = document.getElementById('masterPlayerPanel');
    if (masterPanel) masterPanel.style.display = 'block';
}


// ==========================================
// 📎 GESTIÓN DE CARGA DE ARCHIVOS (TXT, PDF, IMÁGENES)
// ==========================================
const fileUploadInput = document.getElementById('fileUpload');

if (fileUploadInput) {
    fileUploadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const txtInput = document.getElementById('textInput');
        txtInput.value = "⏳ Leyendo archivo, por favor espera...";

        try {
            // 1. Si es un archivo de texto simple (.txt)
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    txtInput.value = e.target.result;
                };
                reader.readAsText(file);
            } 
            // 2. Si es PDF o Imagen (Requiere procesamiento complejo)
            else {
                // Aquí va la conexión con tu API de extracción
                console.log("Archivo detectado:", file.name, "Tipo:", file.type);
                txtInput.value = `⏳ Archivo "${file.name}" detectado. Preparando extracción...`;
                
                // TODO: Restaurar la lógica de OCR/PDF
                extractTextFromFile(file); 
            }
        } catch (error) {
            console.error("Error al procesar el archivo:", error);
            txtInput.value = "❌ Ocurrió un error al intentar leer el archivo.";
        }

        // Resetear el botón por si quieres subir el mismo archivo después
        event.target.value = '';
    });
}

// Función definitiva para extraer texto de PDFs e Imágenes
async function extractTextFromFile(file) {
    const txtInput = document.getElementById('textInput');

    try {
        // 📸 SI ES IMAGEN (Usa Inteligencia Artificial de OCR)
        if (file.type.startsWith('image/')) {
            txtInput.value = "🔍 Analizando imagen con IA (esto puede tardar unos segundos)...";
            const result = await Tesseract.recognize(file, 'eng+spa+deu+fra', {
                logger: m => {
                    if(m.status === 'recognizing text') {
                        txtInput.value = `🔍 Extrayendo texto: ${Math.round(m.progress * 100)}%...`;
                    }
                }
            });
            txtInput.value = result.data.text;
        } 
        // 📄 SI ES PDF (Usa motor de documentos)
        else if (file.type === 'application/pdf') {
            txtInput.value = "📄 Abriendo PDF...";
            const arrayBuffer = await file.arrayBuffer();
            
            // Configurar el trabajador del PDF
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                txtInput.value = `📄 Extrayendo página ${i} de ${pdf.numPages}...`;
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }
            
            txtInput.value = fullText.trim();
        } else {
            txtInput.value = "❌ Formato no soportado. Sube una imagen o un PDF.";
        }
    } catch (error) {
        console.error("Error en la extracción:", error);
        txtInput.value = "❌ Hubo un error al extraer el texto. Revisa la consola o intenta escribirlo manualmente.";
    }
}
