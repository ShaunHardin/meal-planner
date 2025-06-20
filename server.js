import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(express.json());

app.get('/meal-poc', async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
  
    try {
      const openai = new OpenAI({ apiKey });
  
      const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        instructions: 'You are a meal planning assistant that suggests thoughtful, creative meals based on the specific needs of the user',
        input: 'Suggest 4 easy dinner meals for a family of 2 adults and 1 toddler. Moderately healthy, but primary emphasis on very fast prep time for family lacking time to cook.'
      });
  
      var message = response.output_text || 'No response generated';
      
      return res.status(200).json({ message });
    } catch (error) {
      console.error('OpenAI API error:', error);
      return res.status(500).json({ error: 'Failed to generate meal idea' });
    }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});