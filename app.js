// --- SOPHIE: El Cerebro 2.0 (Con Galería Inteligente) ---

const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const playBtn = document.getElementById('playSession');
const notebookGallery = document.getElementById('notebookGallery');

// 1. Diccionario de Emojis Inteligente
function getEmoji(text) {
    const t = text.toLowerCase();
    if (t.includes('voyage') || t.includes('billet')) return '✈️';
    if (t.includes('travail') || t.includes('équipe')) return '💼';
    if (t.includes('manger') || t.includes('croissant')) return '🥐';
    if (t.includes('internet') || t.includes('surfer')) return '💻';
    if (t.includes('santé') || t.includes('médecin')) return '🏥';
    return '📚'; // Emoji por defecto
}

// 2. Procesador de Lecciones
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return alert("¡SOPHIE necesita texto! ✨");
    
    labList.innerHTML = '';
    const lines = rawText.split('\n');
    
    lines.forEach(line => {
        let parts = line.includes('→') ? line.split('→') : line.includes('\t') ? line.split('\t') : line.split('-');
        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.style.padding = "10px";
            row.style.borderBottom = "1px solid #eee";
            row.innerHTML = `<span class="fr">🇫🇷 ${parts[0].trim()}</span> <span style="color:#aaa"> → </span> <span class="de">🇩🇪 ${parts[1].trim()}</span>`;
            labList.appendChild(row);
        }
    });

    // ¡Magia! Guardar automáticamente en la Galería
    saveToGallery(rawText);
});

// 3. Función para Guardar en Galería (Sin duplicados)
function saveToGallery(content) {
    const title = content.split('\n')[0].substring(0, 20).trim() + "...";
    
    // --- Comprobamos si ya existe una tarjeta con este título ---
    const existingCards = Array.from(notebookGallery.querySelectorAll('.notebook-card'));
    const isDuplicate = existingCards.some(card => {
        const cardTitle = card.querySelector('div:nth-child(2)');
        return cardTitle && cardTitle.innerText === title;
    });
    
    if (isDuplicate) return; 

    const date = new Date().toLocaleDateString();
    const emoji = getEmoji(content);

    const card = document.createElement('div');
    card.className = 'notebook-card';
    card.style.background = "#e3f2fd"; 
    card.style.padding = "15px";
    card.style.borderRadius = "12px";
    card.style.marginBottom = "10px";
    card.style.cursor = "pointer";
    card.style.border = "1px solid #bbdefb";

    card.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 5px;">${emoji}</div>
        <div style="font-weight: bold; font-size: 0.9rem;">${title}</div>
        <div style="font-size: 0.7rem; color: #555;">${date}</div>
    `;

    card.onclick = () => {
        textInput.value = content;
        const lines = content.split('\n');
        labList.innerHTML = '';
        lines.forEach(line => {
            let parts = line.includes('→') ? line.split('→') : line.includes('\t') ? line.split('\t') : line.split('-');
            if (parts.length >= 2) {
                const row = document.createElement('div');
                row.className = 'lab-row';
                row.style.padding = "10px";
                row.style.borderBottom = "1px solid #eee";
                row.innerHTML = `<span class="fr">🇫🇷 ${parts[0].trim()}</span> <span style="color:#aaa"> → </span> <span class="de">🇩🇪 ${parts[1].trim()}</span>`;
                labList.appendChild(row);
            }
        });
    };

    notebookGallery.prepend(card);
}

// 4. Motor de Voz Premium
function speak(text, lang) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => v.lang.includes(lang) && (v.name.includes('Google') || v.name.includes('Natural'))) || voices.find(v => v.lang.includes(lang));
        if (bestVoice) utterance.voice = bestVoice;
        utterance.lang = lang;
        utterance.rate = 0.85;
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

// 5. Modo Manos Libres (Ritmo Eco)
playBtn.addEventListener('click', async () => {
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("Primero procesa una lección 🧪");

    playBtn.disabled = true;
    playBtn.innerText = "🔊 Playing...";

    for (let row of rows) {
        const frText = row.querySelector('.fr').innerText.replace('🇫🇷 ', '');
        const deText = row.querySelector('.de').innerText.replace('🇩🇪 ', '');
        row.style.backgroundColor = "#fff9c4"; 
        await speak(frText, 'fr-FR');
        await new Promise(r => setTimeout(r, 2000)); 
        await speak(deText, 'de-DE');
        row.style.backgroundColor = "transparent";
    }
    playBtn.disabled = false;
    playBtn.innerText = "▶ Play Hands-Free";
});

window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
