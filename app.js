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

    createQuizOverlayUI();
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
                    contents: [{ parts: [{ text: systemPrompt }] }],
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

            // 🪄 EL TRUCO DEL BOTÓN CAMALEÓN
            magicOrderBtn.innerHTML = `<i class="fas fa-play"></i> Start your loop • ${parsedData.flashcards.length} terms`;
            
            // Le damos un "glow" sutil para llamar la atención
            magicOrderBtn.style.boxShadow = "0 0 15px rgba(187,134,252,0.4)";
            
            // Redirigimos el clic: la próxima vez que lo toque, ¡empieza el audio!
            magicOrderBtn.onclick = (e) => {
                e.preventDefault();
                const playBtn = document.getElementById('playSession');
                if(playBtn) {
                    playBtn.click(); // Dispara el loop maestro que hicimos ayer
                    
                    // Bajamos la pantalla suavemente para que vea las tarjetas iluminarse
                    document.querySelector('.lab-section').scrollIntoView({ behavior: 'smooth' });
                }
            };
            
            magicOrderBtn.style.display = 'flex';
            if(processBtn) processBtn.style.display = 'flex';

            if(processBtn) processBtn.click();

       } catch (error) {
            console.error(error);
            alert("Hubo un error al procesar. Intenta de nuevo."); 
        } finally {
        magicOrderBtn.innerHTML = btnOriginalText;
        magicOrderBtn.style.opacity = '1';
        magicOrderBtn.style.pointerEvents = 'auto';
        magicOrderBtn.disabled = false;
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

// 📡 EL DESCARGADOR INTELIGENTE (Busca en la caja fuerte primero)
async function getAudioFromCacheOrAPI(text, apiKey) {
    if (audioCache[text]) {
        console.log("♻️ Audio reciclado (Gratis):", text);
        return audioCache[text];
    }

    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Voz de Rachel
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.50, similarity_boost: 0.50 }
        })
    });

    if (!response.ok) throw new Error("Fallo de saldo o conexión");

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    audioCache[text] = audioUrl; // Guardamos en la caja fuerte
    return audioUrl;
}

// 🎛️ REPRODUCTOR MAESTRO (Controla volumen dinámico)
async function playAudioNode(text, apiKey, volume = 1.0) {
    if (!isPlaying) return;
    try {
        const url = await getAudioFromCacheOrAPI(text, apiKey);
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
        masterAudio.playbackRate = 0.90; // Ritmo meditativo
        masterAudio.play().catch(() => {});

        try {
            // ==========================================
            // 🥇 FASE 1: Entrada suave (A -> B -> A suave)
            // ==========================================
            console.log("Iniciando FASE 1...");
            for (let row of rows) {
                if (!isPlaying) break;
                row.style.borderColor = "var(--accent-purple)";
                let A = row.dataset.text1;
                let B = row.dataset.text2;

                await playAudioNode(A, elevenKey, 1.0); await delay(1000);
                if (!isPlaying) break;
                await playAudioNode(B, elevenKey, 1.0); await delay(1000);
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 0.85); await delay(2000); // [suave] y pausa larga
                
                row.style.borderColor = "var(--border-color)";
            }

            if (!isPlaying) throw new Error("Detenido");
            await delay(3000); // Transición de 3 segundos entre fases

            // ==========================================
            // 🧠 FASE 2: Conexión activa (B -> A -> A -> B -> A suave)
            // ==========================================
            console.log("Iniciando FASE 2...");
            masterAudio.playbackRate = 0.92; // Ligeramente más activo
            
            for (let row of rows) {
                if (!isPlaying) break;
                row.style.borderColor = "#fbbf24"; // Iluminamos amarillo en fase 2
                let A = row.dataset.text1;
                let B = row.dataset.text2;

                await playAudioNode(B, elevenKey, 1.0); await delay(1200);
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 1.0); await delay(2000); // Recuperación
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 1.0); await delay(1000);
                if (!isPlaying) break;
                await playAudioNode(B, elevenKey, 1.0); await delay(1000);
                if (!isPlaying) break;
                await playAudioNode(A, elevenKey, 0.82); await delay(2000); // Aún más suave
                
                row.style.borderColor = "var(--border-color)";
            }

            if (!isPlaying) throw new Error("Detenido");
            await delay(3000);

            // ==========================================
            // 🔥 FASE 3: Refuerzo (A larga -> B larga)
            // ==========================================
            console.log("Iniciando FASE 3...");
            masterAudio.playbackRate = 0.88; // Volvemos a bajar revoluciones
            
            for (let row of rows) {
                if (!isPlaying) break;
                row.style.borderColor = "#4ade80"; // Iluminamos verde en fase 3
                let A = row.dataset.text1;
                let B = row.dataset.text2;

                await playAudioNode(A, elevenKey, 1.0); await delay(2500); // Espacio mental puro
                if (!isPlaying) break;
                await playAudioNode(B, elevenKey, 1.0); await delay(2500);
                
                row.style.borderColor = "var(--border-color)";
            }

            // --- LECTURA DEL EJEMPLO (OPCIONAL AL FINAL DE LA SESIÓN) ---
            const mode = audioMode ? audioMode.value : 'basic';
            if (mode === 'full' && isPlaying) {
                await delay(2000);
                for (let row of rows) {
                    if (!isPlaying) break;
                    let example = row.dataset.example;
                    if (example && example.trim() !== "") {
                        row.style.borderColor = "var(--accent-purple)";
                        await playAudioNode(example, elevenKey, 1.0); 
                        await delay(1500);
                        row.style.borderColor = "var(--border-color)";
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
