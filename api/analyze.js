export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { prompt } = req.body;
        
        const response = await fetch('https://api.dify.ai/v1/chat-messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: {},
                query: prompt,
                response_mode: 'blocking',
                user: 'quiz-user-' + Date.now()
            })
        });
        
        if (!response.ok) {
            throw new Error('Dify API request failed');
        }
        
        const data = await response.json();
        res.status(200).json({ answer: data.answer });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
}
