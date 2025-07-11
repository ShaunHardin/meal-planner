import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import { z } from 'zod';

config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(express.json());

// Define the meal schema on the server side
const Ingredient = z.object({
  item: z.string(),
  quantity: z.string(),
});

const Meal = z.object({
  id: z.string(),
  day: z.enum(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),
  name: z.string(),
  description: z.string(),
  prepMinutes: z.number(),
  cookMinutes: z.number(),
  ingredients: Ingredient.array().min(1),
  steps: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
});

const MealsResponse = z.object({
  meals: Meal.array()
});

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

app.post('/generate-meals', async (req, res) => {
  const { prompt, history } = req.body;
  
  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  if (prompt.trim().length < 10) {
    return res.status(400).json({ error: 'Prompt must be at least 10 characters long' });
  }
  
  if (prompt.length > 500) {
    return res.status(400).json({ error: 'Prompt must be 500 characters or less' });
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    const openai = new OpenAI({ apiKey });
    
    // Manually define JSON schema since zodToJsonSchema may not work correctly
    const jsonSchema = {
      type: "object",
      properties: {
        meals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              day: { 
                type: "string", 
                enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
              },
              name: { type: "string" },
              description: { type: "string" },
              prepMinutes: { type: "number" },
              cookMinutes: { type: "number" },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    item: { type: "string" },
                    quantity: { type: "string" }
                  },
                  required: ["item", "quantity"],
                  additionalProperties: false
                },
                minItems: 1
              },
              steps: {
                type: "array",
                items: { type: "string" },
                minItems: 1
              },
            },
            required: ["id", "day", "name", "description", "prepMinutes", "cookMinutes", "ingredients", "steps"],
            additionalProperties: false
          }
        }
      },
      required: ["meals"],
      additionalProperties: false
    };
    
    // Prepare the input with conversation history
    let input = prompt.trim();
    if (history && Array.isArray(history) && history.length > 0) {
      const historyString = history
        .map(entry => `${entry.role}: ${entry.content}`)
        .join("\n\n");
      input = `${historyString}\n\nuser: ${input}`;
    }
    
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'You are an expert meal-planning engine. Return ONLY JSON that matches the schema. Return an object with a "meals" array containing meal objects. Each meal should have a unique ID, be assigned to a specific day, and include complete cooking information with ingredients and step-by-step instructions.',
      text: {
        format: {
          type: "json_schema",
          name: "meals",
          schema: jsonSchema,
        }
      },
      input,
    });
    
    const outputText = response.output_text;
    if (!outputText) {
      throw new Error('No output received from OpenAI');
    }
    
    // Parse and validate the response
    const parsedData = JSON.parse(outputText);
    const validatedResponse = MealsResponse.parse(parsedData);
    const meals = validatedResponse.meals;
    
    // Build updated history
    const updatedHistory = [...(history || [])];
    updatedHistory.push({ role: "user", content: prompt.trim() });
    updatedHistory.push({ role: "assistant", content: outputText });
    
    return res.status(200).json({ 
      meals,
      history: updatedHistory
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // If this was a parsing error, try once more with a fix prompt
    if (error instanceof z.ZodError || error.name === 'SyntaxError') {
      try {
        console.log('Retrying with schema fix prompt...');
        
        const retryPrompt = `**Fix the JSON so it matches the schema exactly.** ${prompt.trim()}`;
        let retryInput = retryPrompt;
        if (history && Array.isArray(history) && history.length > 0) {
          const historyString = history
            .map(entry => `${entry.role}: ${entry.content}`)
            .join("\n\n");
          retryInput = `${historyString}\n\nuser: ${retryInput}`;
        }
        
        const jsonSchema = {
          type: "object",
          properties: {
            meals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  day: { 
                    type: "string", 
                    enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
                  },
                  name: { type: "string" },
                  description: { type: "string" },
                  prepMinutes: { type: "number" },
                  cookMinutes: { type: "number" },
                  ingredients: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        item: { type: "string" },
                        quantity: { type: "string" }
                      },
                      required: ["item", "quantity"],
                      additionalProperties: false
                    },
                    minItems: 1
                  },
                  steps: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 1
                  }
                },
                required: ["id", "day", "name", "description", "prepMinutes", "cookMinutes", "ingredients", "steps"],
                additionalProperties: false
              }
            }
          },
          required: ["meals"],
          additionalProperties: false
        };
        
        const openai = new OpenAI({ apiKey });
        const response = await openai.responses.create({
          model: 'gpt-4o-mini',
          instructions: 'You are an expert meal-planning engine. Return ONLY JSON that matches the schema. Return an object with a "meals" array containing meal objects. Each meal should have a unique ID, be assigned to a specific day, and include complete cooking information with ingredients and step-by-step instructions.',
          text: {
            format: {
              type: "json_schema",
              name: "meals",
              schema: jsonSchema,
            }
          },
          input: retryInput,
        });
        
        const outputText = response.output_text;
        if (!outputText) {
          throw new Error('No output received from OpenAI on retry');
        }
        
        const parsedData = JSON.parse(outputText);
        const validatedResponse = MealsResponse.parse(parsedData);
        const meals = validatedResponse.meals;
        
        const updatedHistory = [...(history || [])];
        updatedHistory.push({ role: "user", content: prompt.trim() });
        updatedHistory.push({ role: "assistant", content: outputText });
        
        return res.status(200).json({ 
          meals,
          history: updatedHistory
        });
      } catch (retryError) {
        console.error('Retry also failed:', retryError);
        return res.status(500).json({ 
          error: 'Failed to generate valid meal suggestions after retry'
        });
      }
    }
    
    return res.status(500).json({ 
      error: error.message || 'Failed to generate meal suggestions' 
    });
  }
});

app.post('/reroll-meal', async (req, res) => {
  const { originalPrompt, dayToReroll, existingMealNames } = req.body;
  
  // Validate inputs
  if (!originalPrompt || typeof originalPrompt !== 'string') {
    return res.status(400).json({ error: 'Original prompt is required' });
  }
  
  if (!dayToReroll || typeof dayToReroll !== 'string') {
    return res.status(400).json({ error: 'Day to reroll is required' });
  }
  
  if (!Array.isArray(existingMealNames)) {
    return res.status(400).json({ error: 'Existing meal names must be an array' });
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    const openai = new OpenAI({ apiKey });
    
    // Build reroll prompt
    const rerollPrompt = `Replace the ${dayToReroll} meal with ONE different meal suggestion. Original request: "${originalPrompt}". Avoid duplicating these existing meals: ${existingMealNames.join(', ')}. Return exactly one meal for ${dayToReroll}.`;
    
    const jsonSchema = {
      type: "object",
      properties: {
        meals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              day: { 
                type: "string", 
                enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
              },
              name: { type: "string" },
              description: { type: "string" },
              prepMinutes: { type: "number" },
              cookMinutes: { type: "number" },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    item: { type: "string" },
                    quantity: { type: "string" }
                  },
                  required: ["item", "quantity"],
                  additionalProperties: false
                },
                minItems: 1
              },
              steps: {
                type: "array",
                items: { type: "string" },
                minItems: 1
              }
            },
            required: ["id", "day", "name", "description", "prepMinutes", "cookMinutes", "ingredients", "steps"],
            additionalProperties: false
          }
        }
      },
      required: ["meals"],
      additionalProperties: false
    };
    
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'You are an expert meal-planning engine. Return ONLY JSON that matches the schema. Return an object with a "meals" array containing exactly one meal object for the specified day.',
      text: {
        format: {
          type: "json_schema",
          name: "meals",
          schema: jsonSchema,
        }
      },
      input: rerollPrompt,
    });
    
    const outputText = response.output_text;
    if (!outputText) {
      throw new Error('No output received from OpenAI');
    }
    
    // Parse and validate the response
    const parsedData = JSON.parse(outputText);
    const validatedResponse = MealsResponse.parse(parsedData);
    const meals = validatedResponse.meals;
    
    // Find the meal for the requested day, or use the first meal
    const rerolledMeal = meals.find(meal => meal.day === dayToReroll) || meals[0];
    
    if (!rerolledMeal) {
      throw new Error('No meal generated for reroll');
    }
    
    return res.status(200).json({ meal: rerolledMeal });
  } catch (error) {
    console.error('OpenAI API error during reroll:', error);
    
    return res.status(500).json({ 
      error: error.message || 'Failed to reroll meal suggestion' 
    });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});