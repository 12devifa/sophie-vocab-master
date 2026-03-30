// --- SOPHIE: El Cerebro Completo ---

const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const playBtn = document.getElementById('playSession');

// 1. Función para Limpieza por Defecto
function clearLab() {
    labList.innerHTML = '';
}

// 2. Procesador de Lecciones (Extrae texto con flechas o tabs)
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return alert("¡SOPHIE necesita texto! ✨");
    
    clearLab();
    
    const lines = rawText.split('\n');
    lines.forEach(line => {
        // Detectamos si el usuario usó Flecha (→), Tabulación o Guion (-)
        let parts = [];
        if (line.includes('→')) parts = line.split('→');
        else if (line.includes('\t')) parts = line.split('\t');
        else parts = line.split('-');

        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.style.padding = "10px";
            row.style.borderBottom = "1px solid #eee";
            row.style.transition = "background-color 0.3s";
            row.innerHTML = `
                <span class="fr">🇫🇷 ${parts[0].trim()}</span> 
                <span style="color:#aaa"> → </span> 
                <span class="de">🇩🇪 ${parts[1].trim()}</span>
            `;
            labList.appendChild(row);
        }
    });
});

// 3. Motor de Voz Inteligente (Busca voces Premium)
function speak(text, lang) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        
        // Filtro Premium
        const bestVoice = voices.find(v => v.lang.includes(lang) && (v.name.includes('Google') || v.name.includes('Natural'))) 
                          || voices.find(v => v.lang.includes(lang));

        if (bestVoice) utterance.voice = bestVoice;
        utterance.lang = lang;
        utterance.rate = 0.85;
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

        row.style.backgroundColor = "#fff9c4"; // Resaltado visual

        await speak(frText, 'fr-FR');
        await new Promise(r => setTimeout(r, 2000)); // Pausa Eco
        await speak(deText, 'de-DE');

        row.style.backgroundColor = "transparent";
    }

    playBtn.disabled = false;
    playBtn.innerText = "▶ Play Hands-Free";
});

// Carga inicial de voces
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
