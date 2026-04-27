export default async function handler(req, res) {
    // Si no es una petición POST, la bloqueamos por seguridad
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Sacamos nuestra llave secreta de la bóveda de Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Recibimos los datos que nos manda nuestra web
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
        
        // Devolvemos la respuesta a nuestra web
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error conectando con Gemini" });
    }
}
