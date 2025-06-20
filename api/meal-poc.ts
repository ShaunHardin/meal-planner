import OpenAI from 'openai';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Suggest 4 dinner recipes for a family of 2 adults and 1 toddler. Focus on very easy recipes for a family with preciousl little time to cook. Output in a numbered list.'
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const message = completion.choices[0]?.message?.content || 'No response generated';
    
    return res.status(200).json({ message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Failed to generate meal idea' });
  }
}