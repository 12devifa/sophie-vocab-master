module.exports = async function handler(req, res) {
    // Reglas de seguridad para que el navegador no lo bloquee
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const { systemPrompt, rawText, context } = req.body;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nATENCIÓN AL CONTEXTO: " + context + "\n\nTEXTO: " + rawText }] }],
                generationConfig: { response_mime_type: "application/json", temperature: 0.7 }
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error conectando con Gemini" });
    }
};
