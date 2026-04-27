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

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const { text, voiceId } = req.body;

    if (!text || !voiceId) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text + ".", 
                model_id: "eleven_multilingual_v2",
                voice_settings: { stability: 0.50, similarity_boost: 0.50 }
            })
        });

        if (!response.ok) {
            throw new Error("Fallo de saldo o conexión en ElevenLabs");
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(200).send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error conectando con ElevenLabs" });
    }
};
