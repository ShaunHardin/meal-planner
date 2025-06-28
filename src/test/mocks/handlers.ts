import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock OpenAI endpoint
  http.post('/api/generate-meals', async ({ request }) => {
    const { prompt } = await request.json() as { prompt: string };
    
    // Simulate validation errors
    if (!prompt || typeof prompt !== 'string') {
      return HttpResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    if (prompt.trim().length < 10) {
      return HttpResponse.json({ error: 'Prompt must be at least 10 characters long' }, { status: 400 });
    }
    
    if (prompt.length > 500) {
      return HttpResponse.json({ error: 'Prompt must be 500 characters or less' }, { status: 400 });
    }
    
    // Simulate different responses based on prompt content
    // Check for network-error first (more specific)
    if (prompt.includes('network-error')) {
      return HttpResponse.error();
    }
    
    if (prompt.includes('error')) {
      return HttpResponse.json({ error: 'OpenAI API error' }, { status: 500 });
    }
    
    // Default successful response
    const mockResponse = `Here are 4 meal suggestions based on your request: "${prompt}"

1. **Vegetarian Pasta Bowl**
   - Quick 15-minute pasta with seasonal vegetables
   - Simple ingredients: pasta, olive oil, garlic, mixed vegetables
   
2. **Chicken Stir-Fry**
   - Fast 20-minute one-pan meal
   - Protein-packed with fresh vegetables
   
3. **Bean and Rice Bowl**
   - Budget-friendly and nutritious
   - Can be prepared in advance
   
4. **Fish Tacos**
   - Light and flavorful
   - Quick preparation with simple seasonings

All meals can be prepared in 30 minutes or less and use common pantry ingredients.`;
    
    return HttpResponse.json({ message: mockResponse });
  }),
  
  // Mock test endpoint
  http.get('/api/meal-poc', () => {
    return HttpResponse.json({ 
      message: 'Test response from OpenAI API mock' 
    });
  }),
];