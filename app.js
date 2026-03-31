// SOPHIE: Cerebro Final con OCR y Memoria
const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');

// 1. Cargar Memoria al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const saved = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    saved.forEach(l => createCardUI(l.content, l.date));
});

// 2. Lector de Archivos y Fotos
fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    processBtn.innerText = "⌛ Leyendo...";
    
    try {
        if (file.type.startsWith("image/")) {
            const result = await Tesseract.recognize(file, 'fra+deu');
            textInput.value = result.data.text;
        } else if (file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = async function() {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    fullText += text.items.map(s => s.str).join(' ') + "\n";
                }
                textInput.value = fullText;
            };
            reader.readAsArrayBuffer(file);
        } else {
            textInput.value = await file.text();
        }
    } catch (err) {
        alert("Error al leer archivo");
    }
    processBtn.innerText = "Process Lesson";
});

// 3. Procesar Texto (El corazón del Lab)
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return;
    
    labList.innerHTML = '';
    const lines = rawText.split('\n');
    
    lines.forEach(line => {
        if (!line.trim()) return;

        // Limpiamos fonética tipo [abc] para que no moleste
        let cleanLine = line.replace(/\[.*?\]/g, ''); 
        
        // Separamos por flecha o por espacios grandes (2 o más)
        let parts = cleanLine.includes('→') ? cleanLine.split('→') : cleanLine.trim().split(/\s{2,}/);
        
        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.style = "padding:12px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;";
            
            const fr = parts[0].trim();
            const de = parts.slice(-1)[0].trim(); // Agarramos el último pedazo como alemán

            row.dataset.fr = fr;
            row.dataset.de = de;
            row.innerHTML = `<span>🇫🇷 ${fr}</span> <span>🇩🇪 ${de}</span>`;
            labList.appendChild(row);
        }
    });
    saveLesson(rawText);
});

// 4. Guardado y Galería
function saveLesson(content) {
    let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    const title = content.trim().split('\n')[0].substring(0, 25);
    if (lessons.some(l => l.title === title)) return;

    const lesson = { title, content, date: new Date().toLocaleDateString() };
    lessons.push(lesson);
    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    createCardUI(content, lesson.date);
}

function createCardUI(content, date) {
    const title = content.trim().split('\n')[0].substring(0, 20) + "...";
    const card = document.createElement('div');
    card.className = 'notebook-card';
    card.style = "background:#e3f2fd; padding:12px; border-radius:12px; margin-bottom:10px; position:relative; border:1px solid #bbdefb; cursor:pointer;";
    card.innerHTML = `
        <button class="del" style="position:absolute; top:5px; right:8px; border:none; background:none; color:red; font-weight:bold;">X</button>
        <div style="font-size:1.2rem;">📚</div>
        <div style="font-weight:bold; font-size:0.85rem;">${title}</div>
        <div style="font-size:0.7rem; color:#666;">${date}</div>
    `;

    card.querySelector('.del').onclick = (e) => {
        e.stopPropagation();
        card.remove();
        let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons.filter(l => l.content !== content)));
    };

    card.onclick = () => {
        textInput.value = content;
        processBtn.click();
    };
    notebookGallery.prepend(card);
}

// 5. Voces y Reproducción
async function speak(text, lang) {
    return new Promise(resolve => {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        ut.lang = lang;
        ut.rate = 0.9;
        ut.onend = resolve;
        window.speechSynthesis.speak(ut);
    });
}

document.getElementById('playSession').onclick = async () => {
    const rows = document.querySelectorAll('.lab-row');
    if (rows.length === 0) return alert("¡Carga una lección primero!");
    
    for (let row of rows) {
        row.style.background = "#fff9c4";
        await speak(row.dataset.fr, 'fr-FR');
        await new Promise(r => setTimeout(r, 1000));
        await speak(row.dataset.de, 'de-DE');
        row.style.background = "transparent";
    }
};
