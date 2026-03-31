const textInput = document.getElementById('textInput');
const processBtn = document.getElementById('processBtn');
const labList = document.getElementById('labList');
const notebookGallery = document.getElementById('notebookGallery');
const fileUpload = document.getElementById('fileUpload');

// --- 1. MEMORIA PERMANENTE (Cargar al iniciar) ---
window.addEventListener('DOMContentLoaded', () => {
    const savedLessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    savedLessons.forEach(lesson => createCardUI(lesson.content, lesson.date));
});

// --- 2. LECTOR DE ARCHIVOS (PDF/TXT/IMÁGENES) ---
fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    processBtn.innerText = "⌛ Leyendo...";
    
    if (file.type.startsWith("image/")) {
        // Magia OCR para fotos
        const result = await Tesseract.recognize(file, 'fra+deu'); 
        textInput.value = result.data.text;
    } else if (file.type === "application/pdf") {
        // Lector PDF
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
        const text = await file.text();
        textInput.value = text;
    }
    processBtn.innerText = "Process Lesson";
});

// --- 3. MULTILENGUAJE INTELIGENTE ---
function detectLang(text) {
    const t = text.toLowerCase();
    if (/[àâçéèêëîïôûù]/.test(t)) return 'fr-FR'; // Francés
    if (/[äöüß]/.test(t)) return 'de-DE';         // Alemán
    if (t.includes(' the ') || t.includes(' is ')) return 'en-US'; // Inglés
    return 'fr-FR'; // Por defecto
}

// --- 4. GUARDADO Y GALERÍA CON BOTÓN BORRAR ---
function saveLesson(content) {
    let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
    const title = content.split('\n')[0].substring(0, 20).trim();
    
    if (lessons.some(l => l.title === title)) return;

    const newLesson = { title, content, date: new Date().toLocaleDateString() };
    lessons.push(newLesson);
    localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    createCardUI(content, newLesson.date);
}

function createCardUI(content, date) {
    const title = content.split('\n')[0].substring(0, 20).trim() + "...";
    const card = document.createElement('div');
    card.className = 'notebook-card';
    card.style = "background:#e3f2fd; padding:15px; border-radius:12px; margin-bottom:10px; position:relative; border:1px solid #bbdefb; cursor:pointer;";

    card.innerHTML = `
        <button class="delete-btn" style="position:absolute; top:5px; right:10px; border:none; background:none; color:red; font-weight:bold; cursor:pointer;">X</button>
        <div style="font-size:1.5rem;">📚</div>
        <div style="font-weight:bold; font-size:0.9rem;">${title}</div>
        <div style="font-size:0.7rem; color:#555;">${date}</div>
    `;

    // Borrar de la memoria y del UI
    card.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation();
        card.remove();
        let lessons = JSON.parse(localStorage.getItem('sophie_lessons')) || [];
        lessons = lessons.filter(l => l.content !== content);
        localStorage.setItem('sophie_lessons', JSON.stringify(lessons));
    };

    card.onclick = () => {
        textInput.value = content;
        processBtn.click();
    };

    notebookGallery.prepend(card);
}

// --- 5. PROCESADOR Y VOZ ---
processBtn.addEventListener('click', () => {
    const rawText = textInput.value;
    if (!rawText.trim()) return;
    
    labList.innerHTML = '';
    const lines = rawText.split('\n');
    lines.forEach(line => {
        let parts = line.includes('→') ? line.split('→') : line.split('-');
        if (parts.length >= 2) {
            const row = document.createElement('div');
            row.className = 'lab-row';
            row.dataset.fr = parts[0].trim();
            row.dataset.de = parts[1].trim();
            row.innerHTML = `<span>🇫🇷 ${parts[0].trim()}</span> → <span>🇩🇪 ${parts[1].trim()}</span>`;
            labList.appendChild(row);
        }
    });
    saveLesson(rawText);
});

async function speak(text, lang) {
    return new Promise(resolve => {
        const ut = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        ut.voice = voices.find(v => v.lang.includes(lang) && v.name.includes('Google')) || voices.find(v => v.lang.includes(lang));
        ut.lang = lang;
        ut.onend = resolve;
        window.speechSynthesis.speak(ut);
    });
}

document.getElementById('playSession').onclick = async () => {
    const rows = document.querySelectorAll('.lab-row');
    for (let row of rows) {
        row.style.background = "#fff9c4";
        await speak(row.dataset.fr, detectLang(row.dataset.fr));
        await new Promise(r => setTimeout(r, 1500));
        await speak(row.dataset.de, detectLang(row.dataset.de));
        row.style.background = "transparent";
    }
};
