// --- SOPHIE: El Cerebro ---

const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const playBtn = document.getElementById('playSession');

// 1. Función para Limpieza por Defecto
function clearLab() {
    labList.innerHTML = '';
}

// 2. Procesador de Lecciones (Extracción de texto)
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return alert("¡SOPHIE necesita texto! ✨");
    
    clearLab();
    
    const lines = rawText.split('\n');
    lines.forEach(line => {
        // Buscamos separar por tabulación o guion
        const parts = line.split('\t').length > 1 ? line.split('\t') : line.split('-');
        
        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.style.padding = "10px";
            row.style.borderBottom = "1px solid #eee";
            row.innerHTML = `
                <span class="fr">🇫🇷 ${parts[0].trim()}</span> 
                <span style="color:#aaa"> → </span> 
                <span class="de">🇩🇪 ${parts[1].trim()}</span>
            `;
            labList.appendChild(row);
        }
    });
});

// 3. Motor de Voz (Web Speech API)
function speak(text, lang) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; // 'fr-FR' o 'de-DE'
        utterance.rate = 0.9;  // Un poquito más lento para aprender
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

// 4. Modo Manos Libres (Ritmo Eco)
playBtn.addEventListener('click', async () => {
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("Primero procesa una lección 🧪");

    playBtn.disabled = true;
    playBtn.innerText = "🔊 Playing...";

    for (let row of rows) {
        const frText = row.querySelector('.fr').innerText.replace('🇫🇷 ', '');
        const deText = row.querySelector('.de').innerText.replace('🇩🇪 ', '');

        // Resaltado visual
        row.style.backgroundColor = "#fff9c4"; 

        // Escucha FR
        await speak(frText, 'fr-FR');
        
        // Pausa Mental (2 segundos)
        await new Promise(r => setTimeout(r, 2000));
        
        // Confirmación DE
        await speak(deText, 'de-DE');

        // Limpiar resaltado
        row.style.backgroundColor = "transparent";
    }

    playBtn.disabled = false;
    playBtn.innerText = "▶ Play Hands-Free";
});
