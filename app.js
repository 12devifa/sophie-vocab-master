// ==========================================
// 🎙️ ELENCO DE VOCES PROFESIONALES DE SOPHIE
// ==========================================
const SOPHIE_VOICES = {
    "EN": "21m00Tcm4TlvDq8ikWAM", // Rachel (Anfitriona - ID Corregido con 'l')
    "DE": "D38z5RcWu1voky8WS1ja", // Fin (Alemán - ID Real)
    "ES": "ErXwobaYiN019PkySvjV", // Antoni (Español - ID Real)
    "FR": "IKne3meq5aSn9XLyUdCD", // Charlie (Para Francés - ID Real)
    "PT": "onwK4e9ZLuTAKqWW03F9", // Daniel (Portugués - ID Real)
    "IT": "zcAOhNBS3c14rBihAFp1"  // Giovanni (Italiano - ID Real)
};


// ==========================================
// 🧠 MEMORIA DE CONTEXTO DE SOPHIE
// ==========================================
let sophieContext = "general"; // Por defecto es general

document.addEventListener('DOMContentLoaded', () => {
    const ctxBtns = document.querySelectorAll('.ctx-btn');
    ctxBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            // Apagamos todos
            ctxBtns.forEach(b => {
                b.style.background = 'transparent';
                b.style.borderColor = 'rgba(255,255,255,0.2)';
            });
            // Encendemos el que tocaste (Morado SOPHIE)
            btn.style.background = 'rgba(187,134,252,0.2)';
            btn.style.borderColor = '#bb86fc';
            
            // ¡SOPHIE MEMORIZA EL CONTEXTO!
            sophieContext = btn.dataset.ctx; 
        };
    });
});

// ==============================================================
// SOPHIE.ai - VERSIÓN DEFINITIVA (CEREBRO JSON + AUDIO + GOALS) 💎
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
const playSessionBtn = document.getElementById('playSession');

let isSwapped = false;
let currentCorrectAnswer = "";
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

    // 🛡️ BLINDAJE: Solo llama al quiz si existe la función para evitar errores rojos
    if (typeof createQuizOverlayUI === 'function') {
        createQuizOverlayUI();
    }
    
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

// --- 2. LÓGICA DE LA IA ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput ? textInput.value : "";
        if (!rawText.trim()) return alert("Por favor, pega algo de texto primero.");

        let userApiKey = localStorage.getItem('sophie_key_5');
        if (!userApiKey) {
            userApiKey = prompt("🔒 Pega tu clave de Google (SÍ, la que empieza por AQ...):");
            if (!userApiKey) {
                alert("Necesitas una API Key para continuar.");
                return;
            }
            localStorage.setItem('sophie_key_5', userApiKey.trim());
        }

        const btnOriginalText = magicOrderBtn.innerHTML;
        magicOrderBtn.innerHTML = '<i class="fas fa-sparkles"></i> ✨ Analyzing your input...';
        magicOrderBtn.style.opacity = '0.7';
        magicOrderBtn.style.pointerEvents = 'none'; 
        
        await new Promise(resolve => setTimeout(resolve, 500));
        const mode = langSelect ? langSelect.value : 'fr-de';
        const config = getLangConfig(mode, isSwapped);

        const originalBtnHTML = magicOrderBtn.innerHTML;
        magicOrderBtn.innerHTML = '<i class="fas fa-brain fa-pulse"></i> Analyzing...';
        magicOrderBtn.disabled = true;

        const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + userApiKey;

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

        TEXTO A ANALIZAR:
        "${rawText}"

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
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt + "\n\nATENCIÓN AL CONTEXTO: El usuario ha solicitado que los ejemplos de uso de cada palabra estén estrictamente enfocados en un contexto de: " + sophieContext + ". Si es trabajo, usa lenguaje de oficina. Si es viaje, usa lenguaje de turista. Genera ejemplos que tengan sentido real en ese escenario." }] }],
            generationConfig: { response_mime_type: "application/json", temperature: 0.7 }
        })
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                alert("🚨 GOOGLE NOS HA DICHO ESTO EXACTAMENTE:\n\n" + JSON.stringify(errorDetails, null, 2));
                localStorage.removeItem('sophie_key_5');
                throw new Error("Fallo de comunicación.");
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

         // ==========================================
            // 🪄 EL TRUCO DEL BOTÓN CAMALEÓN PREMIUM
            // ==========================================
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
                const playBtn = document.getElementById('playSession');
                
                // 🪄 Magia visual: Escondemos el botón verde y mostramos el control remoto
                magicOrderBtn.style.display = 'none';
                const masterPanel = document.getElementById('masterPlayerPanel');
                if(masterPanel) masterPanel.style.display = 'block';

                if(playBtn) {
                    if(!isPlaying) playBtn.click(); 
                    document.querySelector('.lab-section').scrollIntoView({ behavior: 'smooth' });
                }
            };

            magicOrderBtn.style.display = 'flex';
            if(processBtn) processBtn.style.display = 'flex';
            if(processBtn) processBtn.click();

        } catch (error) {
            console.error(error);
            alert("Hubo un error al procesar. Intenta de nuevo."); 
        }
});
}

// --- 3. CREAR TARJETAS VISUALES ---
if (processBtn) {
    processBtn.addEventListener('click', () => {
        const rawText = textInput.value;
        if (!rawText.trim()) return;
        if(labList) labList.innerHTML = '';
        
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
// 🎙️ 4. MOTOR PREMIUM ELEVENLABS (DIRECTOR DE ORQUESTA & CACHÉ) 🧠
// ==========================================

const masterAudio = new Audio();
let audioCache = {}; // 💰 LA CAJA FUERTE: Aquí guardamos audios para no pagar doble

// Helper para pausas precisas
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Motor individual (Botoncitos redondos)
async function speakEleven(text, buttonElement) {
    let elevenKey = localStorage.getItem('sophie_eleven_key');
    if (!elevenKey) {
        elevenKey = prompt("🎙️ Pega tu API Key de ElevenLabs:");
        if (!elevenKey) return; 
        localStorage.setItem('sophie_eleven_key', elevenKey.trim());
    }

    const originalIcon = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    buttonElement.disabled = true;

    try {
        const url = await getAudioFromCacheOrAPI(text, elevenKey);
        const audio = new Audio(url);
        audio.play();

        audio.onended = () => { buttonElement.innerHTML = originalIcon; buttonElement.disabled = false; };
        audio.onerror = () => { buttonElement.innerHTML = originalIcon; buttonElement.disabled = false; };
    } catch (error) {
        console.error(error);
        buttonElement.innerHTML = originalIcon; buttonElement.disabled = false;
    }
}

// 💽 EL DESCARGADOR INTELIGENTE (Ahora con soporte Multilingüe)
async function getAudioFromCacheOrAPI(text, apiKey, voiceId = "21m00Tcm4TlvDq8ikWAM") {
    // Usamos el texto Y la voz como llave para no mezclar idiomas en la memoria
    const cacheKey = text + "_" + voiceId; 
    
    if (audioCache[cacheKey]) {
        console.log("♻️ Audio reciclado (Gratis):", text);
        return audioCache[cacheKey];
    }

    // Usamos la variable 'voiceId' que entra por la puerta
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text + ".", // El hack del punto final para mejorar entonación
            model_id: "eleven_turbo_v2_5",
            voice_settings: { stability: 0.50, similarity_boost: 0.50 }
        })
    });

    if (!response.ok) throw new Error("Fallo de saldo o conexión");

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    audioCache[cacheKey] = audioUrl; // Guardamos en la caja fuerte
    return audioUrl;
}

// 🎛️ REPRODUCTOR MAESTRO (Controla volumen y voces dinámicas)
async function playAudioNode(text, apiKey, volume = 1.0, voiceId = "21m00Tcm4TlvDq8ikWAM") {
    if (!isPlaying) return;
    try {
        // Le pasamos la voz específica al descargador inteligente
        const url = await getAudioFromCacheOrAPI(text, apiKey, voiceId);
        return new Promise((resolve) => {
            masterAudio.src = url;
            masterAudio.volume = volume; // 🔥 El secreto del "suave" está aquí
            masterAudio.onended = resolve;
            masterAudio.onerror = () => resolve();
            masterAudio.play().catch(() => resolve());
        });
    } catch (e) {
        console.error("Error reproduciendo:", e);
    }
}

// 🎼 LÓGICA DEL BOTÓN ESCUCHAR TODO (EL DIRECTOR DE ORQUESTA)
if (playSessionBtn) {
    playSessionBtn.onclick = async () => {
        const rows = document.querySelectorAll('.lab-row');
        if (rows.length === 0) return alert("Procesa una lección primero.");

        if (isPlaying) {
            isPlaying = false;
            masterAudio.pause();
            playSessionBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar todo';
            return;
        }

        let elevenKey = localStorage.getItem('sophie_eleven_key');
        if (!elevenKey) {
            elevenKey = prompt("🎙️ Pega tu API Key de ElevenLabs:");
            if (!elevenKey) return;
            localStorage.setItem('sophie_eleven_key', elevenKey.trim());
        }

        isPlaying = true;
        playSessionBtn.innerHTML = '<i class="fas fa-pause"></i> Detener Loop';

        // Desbloqueo silencioso y ajuste de Rachel
        masterAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        masterAudio.playbackRate = 0.90; 
        masterAudio.play().catch(() => {});

        // 🧠 LÓGICA INTELIGENTE PARA DETECTAR EL IDIOMA DEL PROFESOR
        let currentMode = langSelect ? langSelect.value : 'en-es';
        let parts = currentMode.split('-');
        let targetLang = isSwapped ? parts[0].toUpperCase() : parts[1].toUpperCase();
        if(targetLang === 'EN') targetLang = isSwapped ? parts[1].toUpperCase() : parts[0].toUpperCase();
        
        const profInvitado = SOPHIE_VOICES[targetLang] || SOPHIE_VOICES["DE"];

        try {
            // ==========================================
            // 🥇 FASE 1: Entrada suave (Morado)
            // ==========================================
            console.log("Iniciando FASE 1...");
            for (let row of rows) {
                if (!isPlaying) break;
                // ✨ DEVOLVEMOS EL COLOR MORADO Y EL BRILLO ✨
                row.style.borderColor = "var(--accent-purple)";
                row.style.boxShadow = "0 0 15px rgba(187,134,252,0.2)"; 
                
                let A = row.dataset.text1;
                let B = row.dataset.text2;

                // 1. RACHEL HABLA INGLÉS (Anfitriona)
                await playAudioNode(A, elevenKey, 1.0, SOPHIE_VOICES["EN"]);
                if (!isPlaying) break;
                await delay(500); 

                // 2. EL PROFESOR INVITADO HABLA EL IDIOMA META (Acento Nativo Perfecto)
                await playAudioNode(B, elevenKey, 1.0, profInvitado);
                if (!isPlaying) break;
                await delay(600); 

                // 3. RACHEL REPITE EL INGLÉS SUAVE (Fijación de memoria)
                await playAudioNode(A, elevenKey, 0.4, SOPHIE_VOICES["EN"]);
                if (!isPlaying) break;
                await delay(1500);
                
                // Apagamos el brillo al terminar la tarjeta
                row.style.borderColor = "var(--border-color)";
                row.style.boxShadow = "none";
            }

            if (!isPlaying) throw new Error("Detenido");
            await delay(3000); 

            // ==========================================
            // 🧠 FASE 2: Conexión activa (Amarillo Oro)
            // ==========================================
            console.log("Iniciando FASE 2...");
            masterAudio.playbackRate = 0.92; 
            
            for (let row of rows) {
                if (!isPlaying) break;
                // ✨ COLOR AMARILLO ORO ✨
                row.style.borderColor = "#fbbf24"; 
                row.style.boxShadow = "0 0 15px rgba(251,191,36,0.2)";
                
                let A = row.dataset.text1;
                let B = row.dataset.text2;

                // Ahora la Fase 2 también usa al Profesor Invitado
                await playAudioNode(B, elevenKey, 1.0, profInvitado); await delay(1200);
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 1.0, SOPHIE_VOICES["EN"]); await delay(2000); 
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 1.0, SOPHIE_VOICES["EN"]); await delay(1000);
                if (!isPlaying) break;
                await playAudioNode(B, elevenKey, 1.0, profInvitado); await delay(1000);
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 0.82, SOPHIE_VOICES["EN"]); await delay(2000); 
                
                row.style.borderColor = "var(--border-color)";
                row.style.boxShadow = "none";
            }

            if (!isPlaying) throw new Error("Detenido");
            await delay(3000);

            // ==========================================
            // 🔥 FASE 3: Refuerzo (Verde Éxito)
            // ==========================================
            console.log("Iniciando FASE 3...");
            masterAudio.playbackRate = 0.88; 
            
            for (let row of rows) {
                if (!isPlaying) break;
                // ✨ COLOR VERDE ✨
                row.style.borderColor = "#4ade80"; 
                row.style.boxShadow = "0 0 15px rgba(74,222,128,0.2)";
                
                let A = row.dataset.text1;
                let B = row.dataset.text2;

                // La Fase 3 también usa al Profesor Invitado
                await playAudioNode(A, elevenKey, 1.0, SOPHIE_VOICES["EN"]); await delay(2500); 
                if (!isPlaying) break;
                await playAudioNode(B, elevenKey, 1.0, profInvitado); await delay(2500);
                
                row.style.borderColor = "var(--border-color)";
                row.style.boxShadow = "none";
            }

            // --- LECTURA DEL EJEMPLO (OPCIONAL AL FINAL DE LA SESIÓN) ---
            const mode = audioMode ? audioMode.value : 'basic';
            if (mode === 'full' && isPlaying) {
                await delay(2000);
                for (let row of rows) {
                    if (!isPlaying) break;
                    let example = row.dataset.example;
                    if (example && example.trim() !== "") {
                        // Le damos un brillo morado cuando lee la frase final
                        row.style.borderColor = "var(--accent-purple)";
                        row.style.boxShadow = "0 0 15px rgba(187,134,252,0.2)";
                        await playAudioNode(example, elevenKey, 1.0, SOPHIE_VOICES["EN"]); 
                        await delay(1500);
                        row.style.borderColor = "var(--border-color)";
                        row.style.boxShadow = "none";
                    }
                }
            }

        } catch (error) {
            if (error.message !== "Detenido") console.error(error);
        }

        // LIMPIEZA FINAL
        isPlaying = false;
        playSessionBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar todo';
    };
}

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

    // ⏸️ El botón de PAUSA / PLAY
    if (playerToggleBtn) {
        playerToggleBtn.onclick = () => {
            if (isPlaying) {
                // Si está sonando -> Lo pausamos
                isPlaying = false;
                if(masterAudio) masterAudio.pause();
                playerToggleBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
                playerToggleBtn.style.background = '#fbbf24'; // Se pone amarillo
                playerToggleBtn.style.color = '#000';
            } else {
                // Si está pausado -> Lo reanudamos
                isPlaying = true;
                const playBtn = document.getElementById('playSession');
                if(playBtn) playBtn.click(); // Dispara el loop donde se quedó
                
                playerToggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
                playerToggleBtn.style.background = 'linear-gradient(135deg, #bb86fc 0%, #7c3aed 100%)';
                playerToggleBtn.style.color = 'white';
            }
        };
    }

    // ⏱️ El botón de VELOCIDAD (1x -> 0.8x -> 1.2x)
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
