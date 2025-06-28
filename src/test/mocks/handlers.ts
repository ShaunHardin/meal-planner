import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock structured OpenAI endpoint
  http.post('/api/generate-meals', async ({ request }) => {
    const { prompt, history } = await request.json() as { prompt: string, history?: Array<{role: string, content: string}> };
    
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
      return HttpResponse.json({ error: 'Failed to generate valid meal suggestions' }, { status: 500 });
    }
    
    // Mock structured meal response
    const mockMeals = [
      {
        id: 'meal-1',
        day: 'Sun',
        name: 'Vegetarian Pasta Bowl',
        description: 'Quick 15-minute pasta with seasonal vegetables and herbs',
        prepMinutes: 5,
        cookMinutes: 15,
        ingredients: [
          { item: 'Pasta', quantity: '8 oz' },
          { item: 'Olive oil', quantity: '2 tbsp' },
          { item: 'Garlic', quantity: '3 cloves' },
          { item: 'Mixed vegetables', quantity: '2 cups' }
        ],
        steps: [
          'Boil water and cook pasta according to package directions',
          'Heat olive oil in large pan',
          'Sauté garlic and vegetables for 5 minutes',
          'Combine pasta with vegetables and serve'
        ],
        tags: ['vegetarian', 'quick', 'healthy']
      },
      {
        id: 'meal-2',
        day: 'Mon',
        name: 'Chicken Stir-Fry',
        description: 'Fast 20-minute one-pan meal with protein and fresh vegetables',
        prepMinutes: 10,
        cookMinutes: 10,
        ingredients: [
          { item: 'Chicken breast', quantity: '1 lb' },
          { item: 'Soy sauce', quantity: '3 tbsp' },
          { item: 'Mixed stir-fry vegetables', quantity: '3 cups' },
          { item: 'Rice', quantity: '2 cups cooked' }
        ],
        steps: [
          'Cut chicken into bite-sized pieces',
          'Heat oil in wok or large pan',
          'Cook chicken until golden, about 5 minutes',
          'Add vegetables and stir-fry 3-4 minutes',
          'Add soy sauce and serve over rice'
        ],
        tags: ['protein', 'quick', 'one-pan']
      },
      {
        id: 'meal-3',
        day: 'Wed',
        name: 'Bean and Rice Bowl',
        description: 'Budget-friendly and nutritious meal that can be prepared in advance',
        prepMinutes: 5,
        cookMinutes: 20,
        ingredients: [
          { item: 'Black beans', quantity: '1 can' },
          { item: 'Brown rice', quantity: '1 cup' },
          { item: 'Avocado', quantity: '1 medium' },
          { item: 'Salsa', quantity: '1/2 cup' }
        ],
        steps: [
          'Cook brown rice according to package directions',
          'Heat black beans in microwave or stovetop',
          'Slice avocado',
          'Combine rice and beans in bowl',
          'Top with avocado and salsa'
        ],
        tags: ['vegetarian', 'budget-friendly', 'meal-prep']
      },
      {
        id: 'meal-4',
        day: 'Thu',
        name: 'Fish Tacos',
        description: 'Light and flavorful tacos with quick preparation',
        prepMinutes: 10,
        cookMinutes: 12,
        ingredients: [
          { item: 'White fish fillets', quantity: '1 lb' },
          { item: 'Corn tortillas', quantity: '8 small' },
          { item: 'Cabbage slaw', quantity: '2 cups' },
          { item: 'Lime', quantity: '2 limes' }
        ],
        steps: [
          'Season fish with salt, pepper, and lime juice',
          'Cook fish in pan for 3-4 minutes per side',
          'Warm tortillas in microwave',
          'Flake fish into bite-sized pieces',
          'Fill tortillas with fish and slaw',
          'Serve with lime wedges'
        ],
        tags: ['seafood', 'light', 'quick']
      }
    ];
    
    // Update history
    const updatedHistory = [...(history || [])];
    updatedHistory.push({ role: 'user', content: prompt });
    updatedHistory.push({ role: 'assistant', content: JSON.stringify(mockMeals) });
    
    return HttpResponse.json({ 
      meals: mockMeals,
      history: updatedHistory 
    });
  }),
  
  // Mock test endpoint
  http.get('/api/meal-poc', () => {
    return HttpResponse.json({ 
      message: 'Test response from OpenAI API mock' 
    });
  }),
];