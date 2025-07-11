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

  // Mock reroll meal endpoint
  http.post('/api/reroll-meal', async ({ request }) => {
    const { originalPrompt, dayToReroll, existingMealNames } = await request.json() as { 
      originalPrompt: string, 
      dayToReroll: string, 
      existingMealNames: string[] 
    };
    
    // Validate inputs
    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return HttpResponse.json({ error: 'Original prompt is required' }, { status: 400 });
    }
    
    if (!dayToReroll || typeof dayToReroll !== 'string') {
      return HttpResponse.json({ error: 'Day to reroll is required' }, { status: 400 });
    }
    
    if (!Array.isArray(existingMealNames)) {
      return HttpResponse.json({ error: 'Existing meal names must be an array' }, { status: 400 });
    }
    
    // Simulate different responses based on input
    if (originalPrompt.includes('network-error')) {
      return HttpResponse.error();
    }
    
    if (originalPrompt.includes('error')) {
      return HttpResponse.json({ error: 'Failed to reroll meal suggestion' }, { status: 500 });
    }
    
    // Mock rerolled meal (different based on day)
    const rerolledMeals = {
      'Sun': {
        id: 'reroll-meal-sun',
        day: 'Sun',
        name: 'Mediterranean Quinoa Salad',
        description: 'Fresh and light Mediterranean-inspired quinoa bowl',
        prepMinutes: 15,
        cookMinutes: 15,
        ingredients: [
          { item: 'Quinoa', quantity: '1 cup' },
          { item: 'Cucumber', quantity: '1 medium' },
          { item: 'Cherry tomatoes', quantity: '1 cup' },
          { item: 'Feta cheese', quantity: '1/2 cup' },
          { item: 'Olive oil', quantity: '3 tbsp' }
        ],
        steps: [
          'Cook quinoa according to package directions',
          'Dice cucumber and halve cherry tomatoes',
          'Mix quinoa with vegetables',
          'Add crumbled feta and olive oil dressing',
          'Serve at room temperature'
        ],
      },
      'Mon': {
        id: 'reroll-meal-mon',
        day: 'Mon',
        name: 'Turkey and Avocado Wrap',
        description: 'Protein-packed wrap perfect for busy weeknights',
        prepMinutes: 8,
        cookMinutes: 0,
        ingredients: [
          { item: 'Whole wheat tortilla', quantity: '4 large' },
          { item: 'Turkey breast', quantity: '8 oz sliced' },
          { item: 'Avocado', quantity: '2 medium' },
          { item: 'Mixed greens', quantity: '2 cups' },
          { item: 'Hummus', quantity: '1/4 cup' }
        ],
        steps: [
          'Spread hummus on tortillas',
          'Layer turkey slices evenly',
          'Add sliced avocado and greens',
          'Roll up tightly',
          'Cut in half and serve'
        ],
      },
      'Wed': {
        id: 'reroll-meal-wed',
        day: 'Wed',
        name: 'Lentil Curry',
        description: 'Warming and nutritious curry with aromatic spices',
        prepMinutes: 10,
        cookMinutes: 25,
        ingredients: [
          { item: 'Red lentils', quantity: '1 cup' },
          { item: 'Coconut milk', quantity: '1 can' },
          { item: 'Curry powder', quantity: '2 tbsp' },
          { item: 'Onion', quantity: '1 medium' },
          { item: 'Basmati rice', quantity: '2 cups cooked' }
        ],
        steps: [
          'Sauté diced onion until soft',
          'Add curry powder and cook 1 minute',
          'Add lentils and coconut milk',
          'Simmer 20 minutes until lentils are tender',
          'Serve over basmati rice'
        ],
      }
    };
    
    const defaultMeal = {
      id: 'reroll-meal-default',
      day: dayToReroll,
      name: 'Quick Scrambled Eggs',
      description: 'Simple and satisfying meal ready in minutes',
      prepMinutes: 3,
      cookMinutes: 5,
      ingredients: [
        { item: 'Eggs', quantity: '4 large' },
        { item: 'Butter', quantity: '2 tbsp' },
        { item: 'Salt', quantity: 'to taste' },
        { item: 'Black pepper', quantity: 'to taste' }
      ],
      steps: [
        'Beat eggs in a bowl',
        'Heat butter in non-stick pan',
        'Add eggs and stir gently',
        'Cook until just set',
        'Season and serve immediately'
      ],
    };
    
    const meal = rerolledMeals[dayToReroll as keyof typeof rerolledMeals] || defaultMeal;
    
    return HttpResponse.json({ meal });
  }),
];