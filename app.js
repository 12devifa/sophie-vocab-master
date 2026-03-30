// 3. Motor de Voz Inteligente (Busca voces Premium)
function speak(text, lang) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Buscamos las mejores voces disponibles en el sistema
        const voices = window.speechSynthesis.getVoices();
        
        // Filtro: Buscamos voces de Google o Premium que coincidan con el idioma
        const bestVoice = voices.find(v => v.lang.includes(lang) && (v.name.includes('Google') || v.name.includes('Natural'))) 
                          || voices.find(v => v.lang.includes(lang));

        if (bestVoice) utterance.voice = bestVoice;
        
        utterance.lang = lang;
        utterance.rate = 0.85; // Un tono más pausado y elegante
        utterance.pitch = 1.0; // Tono natural
        
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

// Esto ayuda a que las voces carguen bien al iniciar
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
