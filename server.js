import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(express.json());

app.get('/meal-poc', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Suggest a quick, healthy meal idea with a brief description. Keep it under 50 words.'
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const message = completion.choices[0]?.message?.content || 'No response generated';
    
    res.json({ message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate meal idea' });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});