const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Replace YOUR_API_KEY_HERE with your actual API key
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'placeholder-key';

app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 300,
                messages: [{
                    role: 'user',
                    content: `You are a psychologist analyzing a Rorschach test response. The person saw: "${text}". Give a brief, insightful, and friendly psychological interpretation of what this might reveal about their personality, mindset, or perspective. Keep it positive and interesting, around 2-3 sentences.`
                }]
            })
        });
        
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (data.type === 'error') {
            res.status(500).json({ error: data.error.message });
            return;
        }
        
        res.json({ interpretation: data.content[0].text });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to analyze response' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});