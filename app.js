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
window.userCurrentGoal = 'auto'; // Variable global para la meta

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

    // --- LÓGICA DE LOS BOTONES DE METAS (GOALS) ---
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

// --- 2. LÓGICA DE LA IA (EL SÚPER CEREBRO JSON - MODO DETECTIVE) ---
if (magicOrderBtn) {
    magicOrderBtn.addEventListener('click', async () => {
        const rawText = textInput ? textInput.value : "";
        if (!rawText.trim()) return alert("Por favor, pega algo de texto primero.");

      // Sistema Seguro de API Key (V5 - Definitivo)
        let userApiKey = localStorage.getItem('sophie_key_5');
        if (!userApiKey) {
            userApiKey = prompt("🔒 Pega tu clave de Google (SÍ, la que empieza por AQ...):");
            if (!userApiKey) {
                alert("Necesitas una API Key para continuar.");
                return;
            }
            // Guardamos la llave si la acaba de poner
            localStorage.setItem('sophie_key_5', userApiKey.trim());
        }

        // --- EFECTO PRO: Suspenso visual (AHORA ESTÁ LIBRE Y SEGURO) ---
        const btnOriginalText = magicOrderBtn.innerHTML;
        magicOrderBtn.innerHTML = '<i class="fas fa-sparkles"></i> ✨ Analyzing your input...';
        magicOrderBtn.style.opacity = '0.7';
        magicOrderBtn.style.pointerEvents = 'none'; // Evita doble clic
        
        // Pausa mágica de medio segundo
        await new Promise(resolve => setTimeout(resolve, 500));
        const mode = langSelect ? langSelect.value : 'fr-de';
        const config = getLangConfig(mode, isSwapped);
        let langPrompt = `Idioma 1: ${config.name1} -> Idioma 2: ${config.name2}`;

        const originalBtnHTML = magicOrderBtn.innerHTML;
        magicOrderBtn.innerHTML = '<i class="fas fa-brain fa-pulse"></i> Analyzing...';
        magicOrderBtn.disabled = true;

        // URL a prueba de fallos matemáticos (Concatenación segura)
        const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + userApiKey;

        const systemPrompt = `
        Eres SOPHIE.ai, una experta en neuroaprendizaje y traductora políglota nativa.
        MISIÓN: El usuario te ha dado un texto. Tu trabajo es TRADUCIRLO TODO a los nuevos idiomas seleccionados, sin importar en qué idioma estaba escrito originalmente.
        
        NUEVOS IDIOMAS SELECCIONADOS:
        - Idioma Destino (El que quiere aprender): ${config.name1}
        - Idioma Base (Su idioma de apoyo): ${config.name2}

        REGLAS ESTRICTAS E INQUEBRANTABLES: 
        1. ¡IGNORA si el texto original ya estaba traducido a otros idiomas! DEBES re-traducir todos los conceptos a ${config.name1} y ${config.name2}.
        2. El campo "original" DEBE estar SIEMPRE en ${config.name1}.
        3. El campo "translation" DEBE estar SIEMPRE en ${config.name2}.
        4. El campo "context" (ejemplo) DEBE estar escrito SIEMPRE y ÚNICAMENTE en ${config.name1} (frase real y natural).

        OBJETIVO: "${window.userCurrentGoal}".

        TEXTO A ANALIZAR Y TRADUCIR:
        "${rawText}"

        DEVUELVE ÚNICAMENTE UN JSON CON ESTA ESTRUCTURA:
        {
          "detected_language": "Idioma original detectado",
          "wow_message": "Mensaje motivador corto en ${config.name1}",
          "flashcards": [
            {
              "original": "Palabra/Frase en ${config.name1}",
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
                // 🚨 EL DETECTIVE DE ERRORES EN ACCIÓN 🚨
                const errorDetails = await response.json();
                alert("🚨 GOOGLE NOS HA DICHO ESTO EXACTAMENTE:\n\n" + JSON.stringify(errorDetails, null, 2));
                localStorage.removeItem('sophie_key_5'); // Borramos la clave para que te deje intentar de nuevo
                throw new Error("Fallo de comunicación. Lee el cartel de alerta.");
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

            const wowSummary = document.getElementById('wowSummary');
            if(wowSummary) {
                wowSummary.innerHTML = `
                    <h3 style="color: #4ade80; margin-bottom: 10px;">✨ ${parsedData.wow_message}</h3>
                    <div class="summary-details" style="display: flex; flex-direction: column; gap: 8px; color: #d4d4d8;">
                       <div class="stat-highlight">📊 <strong>${parsedData.flashcards.length}</strong> ${parsedData.flashcards.length === 1 ? 'term' : 'terms'} detected</div>
                        <div>🌍 Language: <strong>${parsedData.detected_language}</strong></div>
                        <div>🎯 Optimized for: <strong>${window.userCurrentGoal.toUpperCase()}</strong></div>
                    </div>
                `;
                wowSummary.style.display = 'block';
            }
            
            magicOrderBtn.style.display = 'flex';
            if(processBtn) processBtn.style.display = 'flex';

            if(processBtn) processBtn.click();
            if (navigator.vibrate) navigator.vibrate(50);

       } catch (error) {
            console.error(error);
            alert("Hubo un error al procesar. Intenta de nuevo."); 
        } finally {
        // --- FIN DEL EFECTO PRO (Devolver el botón a la normalidad) ---
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
            row.dataset.voice1 = config.voice1;
            row.dataset.voice2 = config.voice2;
            row.dataset.example = exampleText;

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
            if(labList) labList.appendChild(row);
        });
        saveLesson(rawText);
    });
}

// --- 4. MOTOR DE AUDIO (CON DESBLOQUEO PARA MÓVILES) ---
if(playSessionBtn) {
    playSessionBtn.onclick = async () => {
        const rows = document.querySelectorAll('.lab-row');
        if (rows.length === 0) return alert("Procesa una lección primero.");
        
        // 🚨 HACK DE DESBLOQUEO PARA iOS/ANDROID 🚨
        // Reproducimos un audio de 0 segundos silencioso al hacer clic
        // para decirle al teléfono: "¡Eh! El usuario quiere usar el altavoz, no me lo bloquees luego."
        const unlockAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
        unlockAudio.play().catch(e => console.log("Silencio ignorado"));

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
            row.style.borderColor = "var(--accent-purple)";
            
            await speak(row.dataset.text1, row.dataset.voice1);
            if (!isPlaying) break; await new Promise(r => setTimeout(r, 1000));
            
            if (!isPlaying) break; await speak(row.dataset.text2, row.dataset.voice2);
            
            if (mode === 'full' && row.dataset.example && row.dataset.example.trim() !== "") {
                if (!isPlaying) break; await new Promise(r => setTimeout(r, 1000));
                if (!isPlaying) break; await speak(row.dataset.example, row.dataset.voice1);
            }
            
            row.style.borderColor = "var(--border-color)";
            if (!isPlaying) break; await new Promise(r => setTimeout(r, 1500));
        }
        isPlaying = false;
        playSessionBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar todo';
    };
}

// --- 5. FUNCIONES DE APOYO ---
function getLangConfig(mode, swapped) {
    let configs = {
        'fr-de': { f1:'🇫🇷', f2:'🇩🇪', v1:'fr-FR', v2:'de-DE', n1:'Français', n2:'Deutsch' },
        'en-es': { f1:'🇬🇧', f2:'🇪🇸', v1:'en-US', v2:'es-ES', n1:'English', n2:'Español' },
        'es-de': { f1:'🇪🇸', f2:'🇩🇪', v1:'es-ES', v2:'de-DE', n1:'Español', n2:'Deutsch' },
        'en-de': { f1:'🇬🇧', f2:'🇩🇪', v1:'en-US', v2:'de-DE', n1:'English', n2:'Deutsch' },
        'pt-de': { f1:'🇵🇹', f2:'🇩🇪', v1:'pt-PT', v2:'de-DE', n1:'Português', n2:'Deutsch' },
        'de-es': { f1:'🇩🇪', f2:'🇪🇸', v1:'de-DE', v2:'es-ES', n1:'Deutsch', n2:'Español' },
        'de-en': { f1:'🇩🇪', f2:'🇬🇧', v1:'de-DE', v2:'en-US', n1:'Deutsch', n2:'English' }
    };
    let c = configs[mode] || configs['en-es'];
    return swapped ? { flag1:c.f2, flag2:c.f1, voice1:c.v2, voice2:c.v1, name1:c.n2, name2:c.n1 } : { flag1:c.f1, flag2:c.f2, voice1:c.v1, voice2:c.v2, name1:c.n1, name2:c.n2 };
}

// --- 4. MOTOR DE AUDIO PREMIUM (ELEVENLABS) BLINDADO 🎙️📱 ---
async function speak(text, lang) {
    let elevenKey = localStorage.getItem('sophie_eleven_key');
    
    if (!elevenKey) {
        elevenKey = prompt("🎙️ Pega tu API Key de ElevenLabs en el móvil también:");
        if (!elevenKey) {
            return fallbackSpeak(text, lang);
        }
        localStorage.setItem('sophie_eleven_key', elevenKey.trim());
    }

    try {
        const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Voz de Rachel
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': elevenKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
        });

        if (!response.ok) throw new Error("Fallo en la API o llave incorrecta");

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.playbackRate = window.audioSpeed || 1.0;

        return new Promise(resolve => {
            audio.onended = resolve;
            audio.onerror = resolve;
            
            // 🛡️ PARCHE PARA MÓVILES: Evita que se quede colgado en "Pausa"
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("El móvil bloqueó el audio:", error);
                    fallbackSpeak(text, lang).then(resolve); 
                });
            }
        });

    } catch (error) {
        console.error("Error general de voz:", error);
        return fallbackSpeak(text, lang);
    }
}
// 🛟 EL SALVAVIDAS: La voz antigua por si falla el internet o nos quedamos sin saldo
async function fallbackSpeak(text, lang) {
    return new Promise(resolve => {
        window.speechSynthesis.cancel();
        let currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = lang;
        currentUtterance.rate = 0.9 * (window.audioSpeed || 1.0); 
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
        
        const processBtn = document.getElementById('processBtn');
        const wowSummary = document.getElementById('wowSummary');
        const magicOrderBtn = document.getElementById('magicOrderBtn');
        
        if(processBtn) processBtn.click(); 
        if(wowSummary) wowSummary.style.display = 'none';
        
        // 🔥 AQUÍ ESTÁ EL TRUCO: Le decimos que SIEMPRE se muestre ('flex') 🔥
        if(magicOrderBtn) magicOrderBtn.style.display = 'flex'; 
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if(notebookGallery) notebookGallery.prepend(card);
}

function loadStreak() {
    const streak = parseInt(localStorage.getItem('sophie_streak')) || 0;
    const streakCounter = document.getElementById('streakCounter');
    
    if (streakCounter) {
        // Quitamos los brillos antiguos por si acaso
        streakCounter.classList.remove('glow-tier-1', 'glow-tier-2');

        let iconHTML = '';

        // Lógica PRO de evolución visual
        if (streak >= 10) {
            iconHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i>✨`;
            streakCounter.classList.add('glow-tier-2'); // Glow dinámico
        } else if (streak >= 5) {
            iconHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i>✨`;
            streakCounter.classList.add('glow-tier-1'); // Glow sutil
        } else if (streak >= 1) {
            iconHTML = `<i class="fas fa-bolt" style="color: #fbbf24;"></i>`;
        } else {
            iconHTML = `<i class="fas fa-bolt" style="color: #6b7280;"></i>`; // Gris si está en 0
        }

        // Actualizamos el botón completo
        streakCounter.innerHTML = `${iconHTML} <span id="streakNumber" style="margin-left: 5px; font-weight: bold; color: white;">${streak}</span>`;
    }
}

if(newNoteBtn) newNoteBtn.onclick = () => { if(textInput) textInput.value = ""; if(labList) labList.innerHTML = ""; localStorage.setItem('sophie_last_input', ""); };
if(swapLangBtn) swapLangBtn.onclick = () => { isSwapped = !isSwapped; swapLangBtn.classList.toggle('active'); };

// --- 6. QUIZ LOGIC ---
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
        localStorage.setItem('sophie_streak', 10);;
        loadStreak();
        setTimeout(() => { nextQuizQuestion(); checkBtn.disabled = false; feedback.innerText = ""; feedback.style.color = ""; }, 1200); 
    } else {
        feedback.style.color = "#fca5a5"; feedback.innerText = `Fast... Richtig ist: ${currentCorrectAnswer.toUpperCase()}`;
        setTimeout(() => { nextQuizQuestion(); checkBtn.disabled = false; feedback.innerText = ""; feedback.style.color = ""; }, 2500); 
    }
}

// --- BOTÓN NUEVA NOTA (+) ---
if(newNoteBtn) {
    newNoteBtn.onclick = () => { 
        if(textInput) textInput.value = ""; 
        if(labList) labList.innerHTML = ""; 
        const wowSummary = document.getElementById('wowSummary');
        const magicOrderBtn = document.getElementById('magicOrderBtn');
        if(wowSummary) wowSummary.style.display = 'none';
        if(magicOrderBtn) magicOrderBtn.style.display = 'flex';
        localStorage.setItem('sophie_last_input', ""); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// updateDashboardStats(); // Desactivado hasta que programemos la Fase 3

// --- CONTROL DE VELOCIDAD DE AUDIO (BLINDADO) ---
window.audioSpeed = 1.0;

window.toggleSpeed = function() {
    const speedBtn = document.getElementById('speedBtn');
    const speedValue = document.getElementById('speedValue');
    
    if (window.audioSpeed === 1.0) {
        window.audioSpeed = 0.75; // Más lento
        if(speedValue) speedValue.innerText = '0.75x';
        if(speedBtn) speedBtn.style.color = '#fbbf24'; // Amarillo
    } else {
        window.audioSpeed = 1.0; // Normal
        if(speedValue) speedValue.innerText = '1x';
        if(speedBtn) speedBtn.style.color = 'var(--text-primary)'; // Normal
    }
};
