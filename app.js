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
        // Opciones de idiomas del selector
        langEnEs: "EN English → ES Spanish",
        langFrDe: "FR French → DE German",
        langDeEs: "DE German → ES Spanish",
        langDeEn: "DE German → EN English",
        langPtDe: "PT Portuguese → DE German",
        langEsDe: "ES Spanish → DE German"
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
        // Opciones de idiomas del selector
        langEnEs: "EN Englisch → ES Spanisch",
        langFrDe: "FR Französisch → DE Deutsch",
        langDeEs: "DE Deutsch → ES Spanisch",
        langDeEn: "DE Deutsch → EN Englisch",
        langPtDe: "PT Portugiesisch → DE Deutsch",
        langEsDe: "ES Spanisch → DE Deutsch"
    }
};

function changeLanguage(lang) {
    // Guardar el idioma en la memoria del teléfono/PC
    localStorage.setItem('sophie_lang', lang);
    const t = translations[lang];
    
    // 1. Mover el color morado al botón correcto (¡Aquí estaba el error corregido!)
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(lang === 'en' ? 'btn-en' : 'btn-de');
    if (activeBtn) activeBtn.classList.add('active');
    
    // 2. Traducir la Biblioteca
    const libTitle = document.querySelector('.library-title-text');
    if (libTitle) libTitle.innerHTML = `<i class="fas fa-archive"></i> ${t.library}`;
    
    // 3. Traducir el botón de Escuchar Todo (solo si no está reproduciendo)
    const playAllBtn = document.getElementById('btn-play-all');
    if (playAllBtn && !playAllBtn.innerHTML.includes('fa-stop')) {
        playAllBtn.innerHTML = `<i class="fas fa-play"></i> ${t.playAll}`;
    }
    
// 4. Traducir los desplegables (Dropdowns) - ¡Todos ellos!
    document.querySelectorAll('option[value="basic"]').forEach(opt => {
        opt.textContent = t.vocabOnly;
    });
    document.querySelectorAll('option[value="full"]').forEach(opt => {
        opt.textContent = t.vocabExamples;
    });

    // // 5. Traducir los textos visuales del HTML (NUEVO)
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        const translationKey = element.getAttribute('data-translate');
        if (t[translationKey]) {
            // Regla de Limpieza: Si es el textarea, usa el placeholder fantasma
            if (element.tagName === 'TEXTAREA') {
                element.placeholder = t[translationKey];
            } else {
                // Si son botones u otras cosas, mételo adentro normal
                element.innerHTML = t[translationKey];
            }
        }
    });


    
}

// Magia Extra: Que se ponga en Alemán automáticamente al abrir la app
document.addEventListener('DOMContentLoaded', () => {
    // Busca si ya eligió idioma antes, si no, usa 'de' (Alemán) por defecto
    const savedLang = localStorage.getItem('sophie_lang') || 'de'; 
    changeLanguage(savedLang);
});


// ==========================================
// 🎙️ ELENCO DE VOCES "NOTEBOOK LM" (Relajantes y conversacionales)
// ==========================================
const SOPHIE_VOICES = {
    "EN": "EXAVITQu4vr4xnSDxMaL", // Sarah (Inglés - Tono suave, maduro y tipo ASMR)
    "DE": "N2lVS1w4EtoT3dr4eOWO", // Callum (Alemán/Multilingüe - Profundo y relajante)
    "ES": "XrExE9yKIg1WjnnlVkGX", // Matilda (Español - Muy cálida y conversacional)
    "FR": "cgSgspJ2msm6clMCkdW9", // Marcus (Francés - Voz masculina profunda y tranquila) 
    "PT": "qPfM2laM0pRL4rrZtBGl", // Alice (Portugués - Suave y educada)
    "IT": "ZQe5CZNOzWqw6CGcgHmAS" // Giovanni (Italiano - Tono neutro y calmado)
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
            // 🔒 AQUÍ LLAMAMOS A TU TÚNEL SEGURO EN LUGAR DE A GOOGLE DIRECTAMENTE
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
            
// 🚀 NUEVO BLOQUE: EXPERIENCIA PREMIUM (AUTO-PLAY + SCROLL)
magicOrderBtn.onclick = (e) => {
    if(e) e.preventDefault();
    
    // 1. Limpiamos la pantalla ocultando el botón verde (Cero distracciones)
    magicOrderBtn.style.display = 'none';
    
    // 2. ¡AUTO-PLAY DIRECTO! Invocamos al cerebro del loop sin depender de botones físicos
    if (!isPlaying && typeof startLoopProcess === 'function') {
        startLoopProcess();
    }
    
    // 3. AUTO-SCROLL MÁGICO: Bajamos directo a la primera tarjeta
    setTimeout(() => {
        const firstCard = document.querySelector('.lab-row');
        if (firstCard) {
            // Si hay tarjetas, bajamos suavemente hasta la primera para verla iluminarse
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Si por alguna razón no hay, bajamos al panel general
            const labList = document.getElementById('labList');
            if (labList) labList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 400); // Le damos 400 milisegundos a la interfaz para que respire antes de moverse
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
        labList.innerHTML = ''; // Esto vacía la pizarra antes de escribir lo nuevo
window.speechSynthesis.cancel(); // Por si acaso había algo sonando, lo calla
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

async function activateRowVisuals(row, borderColor, shadowColor) {
    await delay(50);
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.style.borderColor = borderColor;
    row.style.boxShadow = `0 0 15px ${shadowColor}`;
    await delay(150); 
}

function deactivateRowVisuals(row) {
    row.style.borderColor = "var(--border-color)";
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

// 💽 EL DESCARGADOR INTELIGENTE (AHORA LLAMA A NUESTRO ROBOT)
async function getAudioFromCacheOrAPI(text, voiceId = "21m00Tcm4TlvDq8ikWAM") {
    const cacheKey = text + "_" + voiceId; 
    
    if (audioCache[cacheKey]) {
        console.log("♻️ Audio reciclado (Gratis):", text);
        return audioCache[cacheKey];
    }

    // 🔒 AQUÍ LLAMAMOS A TU TÚNEL SEGURO EN LUGAR DE A ELEVENLABS DIRECTAMENTE
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
    window.speechSynthesis.cancel(); // 🛑 REGLA DE ORO: Sin memoria residual
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("Procesa una lección primero.");

    // Leemos el idioma actual para no forzar el español
    const currentLang = localStorage.getItem('sophie_lang') || 'en';
    const t = translations[currentLang] || translations['en'];

    const statLoop = document.getElementById('stat-loop');
    const statTerms = document.getElementById('stat-terms');
    const statListening = document.getElementById('stat-listening');
    const dynamicFeedback = document.getElementById('dynamic-feedback');
    
    if(statTerms) statTerms.innerText = rows.length;

    // 2. Si ya estaba sonando, lo Pausamos
    if (isPlaying) {
        isPlaying = false;
        masterAudio.pause();
        playBtns.forEach(btn => {
            if(btn.id === 'btn-resume-loop') btn.innerText = "Resume your loop";
            else btn.innerHTML = `<i class="fas fa-play"></i> ${t.playAll}`; // ¡Traducción dinámica!
        });
        if(statLoop) { statLoop.innerText = "Paused"; statLoop.className = "status-value paused"; }
        if(dynamicFeedback) dynamicFeedback.innerText = "Loop paused. Ready when you are.";
        clearInterval(listeningTimer);
        rows.forEach(r => deactivateRowVisuals(r));
        return;
    }

    // 3. Si estaba pausado, le damos Play
    isPlaying = true;
    playBtns.forEach(btn => {
        if(btn.id === 'btn-resume-loop') btn.innerText = "Pause loop";
        else btn.innerHTML = `<i class="fas fa-pause"></i> ${t.stop}`; // ¡Traducción dinámica!
    });
    
    if(statLoop) { statLoop.innerText = "Running"; statLoop.className = "status-value running"; }
    if(dynamicFeedback) dynamicFeedback.innerText = "Your brain is adapting through repetition...";
    
    // 🚀 MAGIA RECUPERADA: Auto-scroll al inicio de la lección
    const firstRow = rows[0];
    if (firstRow) {
        firstRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

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

    // --- INICIA EL AUDIO MAESTRO ---
    masterAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    masterAudio.playbackRate = 0.90; 
    masterAudio.play().catch(() => {});

    let currentMode = langSelect ? langSelect.value : 'en-es';
    let parts = currentMode.split('-');
    let baseLangCode = isSwapped ? parts[1].toUpperCase() : parts[0].toUpperCase();
    let targetLangCode = isSwapped ? parts[0].toUpperCase() : parts[1].toUpperCase();
    
    const vozBase = SOPHIE_VOICES[baseLangCode] || SOPHIE_VOICES["EN"];
    const vozMeta = SOPHIE_VOICES[targetLangCode] || SOPHIE_VOICES["DE"];

    try {
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

        const mode = audioMode ? audioMode.value : 'basic';
        if (mode === 'full' && isPlaying) {
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

    } catch (error) {
        if (error.message !== "Detenido") console.error(error);
    }

    // CUANDO TERMINA EL LOOP NATURALMENTE
    isPlaying = false;
    clearInterval(listeningTimer);
    rows.forEach(r => deactivateRowVisuals(r));
    if(statLoop) { statLoop.innerText = "Finished"; statLoop.className = "status-value"; }
    if(dynamicFeedback) dynamicFeedback.innerText = "Great session! Ready for more?";
    playBtns.forEach(btn => {
        if(btn.id === 'btn-resume-loop') btn.innerText = "Start over";
        else btn.innerHTML = `<i class="fas fa-play"></i> ${t.playAll}`; // ¡Traducción dinámica!
    });
};

playBtns.forEach(btn => {
    btn.onclick = startLoopProcess;
});
// --- 5. FUNCIONES DE APOYO ---
function getLangConfig(mode, swapped) {
    let configs = {
        'fr-de': { f1:'🇫🇷', f2:'🇩🇪', n1:'Français', n2:'Deutsch' },
        'en-es': { f1:'🇬🇧', f2:'🇪🇸', n1:'English', n2:'Español' },
        'es-de': { f1:'🇪🇸', f2:'🇩🇪', n1:'Español', n2:'Deutsch' },
        'en-de': { f1:'🇬🇧', f2:'🇩🇪', n1:'English', n2:'Deutsch' },
        'pt-de': { f1:'🇵🇹', f2:'🇩🇪', n1:'Português', n2:'Deutsch' },
        'de-es': { f1:'🇩🇪', f2:'🇪🇸', n1:'Deutsch', n2:'Español' },
        'de-en': { f1:'🇩🇪', f2:'🇬🇧', n1:'Deutsch', n2:'English' }
    };
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
    card.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px; border-bottom:1px solid var(--border-color); padding:10px 0;">
            <i class="fas fa-book-bookmark" style="color:var(--accent-purple); font-size:1.4rem;"></i>
            <div>
                <div style="font-weight:700; font-size:0.95rem;">${title}...</div>
                <div style="font-size:0.75rem; color:var(--text-secondary)">${date}</div>
            </div>
        </div>
    `;
    card.onclick = () => { 
        if(textInput) textInput.value = content; 
        localStorage.setItem('sophie_last_input', content); 
        
        if(processBtn) processBtn.click(); 
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Si la pizarra está vacía, no guardamos nada
    if (!labList || labList.innerHTML.trim() === '') return;

    // Generamos un título cortito basado en lo que el usuario pegó (primeras 3 palabras)
    const previewTitle = rawText.split(' ').slice(0, 3).join(' ') + '...';
    
    // Obtenemos la biblioteca guardada, o creamos una lista vacía si es nuevo
    let library = JSON.parse(localStorage.getItem('sophie_notebooks')) || [];

    // Creamos el nuevo "cuaderno"
    const newNotebook = {
        id: Date.now(), // Un ID único
        title: previewTitle,
        date: new Date().toLocaleDateString('de-CH'), // Formato de fecha suizo
        htmlContent: labList.innerHTML // Guardamos el vocabulario ya generado!
    };

    // Lo metemos al principio de la lista y guardamos en el navegador
    library.unshift(newNotebook);
    localStorage.setItem('sophie_notebooks', JSON.stringify(library));
    
    // Refrescamos la vista de la biblioteca
    renderLibrary();
}

// 2. Función para MOSTRAR las tarjetas en tu "Mi Biblioteca"
function renderLibrary() {
    // Busca el contenedor que ya tienes en tu diseño (notebookGallery)
    const gallery = document.getElementById('notebookGallery');
    if (!gallery) return;

    let library = JSON.parse(localStorage.getItem('sophie_notebooks')) || [];
    gallery.innerHTML = ''; // Limpiamos antes de dibujar

    library.forEach(notebook => {
        // Creamos la tarjeta visual
        const card = document.createElement('div');
        card.className = 'notebook-card'; // Asegúrate de tener estilo para esto en CSS
        card.innerHTML = `
            <h4>${notebook.title}</h4>
            <span class="notebook-date">${notebook.date}</span>
        `;
        
        // 3. Función para CARGAR la lección al hacer clic en la tarjeta
        card.addEventListener('click', () => {
            const labList = document.getElementById('labList');
            labList.innerHTML = notebook.htmlContent;
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla arriba
        });

        gallery.appendChild(card);
    });
}

// Para que la biblioteca se dibuje nada más abrir la app:
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
