import axios from 'axios';
// import { MealIdea } from './types.ts';

// Temporary inline interface to test
type MealState = 'loading' | 'suggested' | 'accepted';

interface MealIdea {
  title: string;
  summary: string;
  recipe_steps: string[];
  ingredients: string[];
  state: MealState;
}

const API_BASE_URL = '/api';

export interface GenerateIdeasRequest {
  userPrompt: string;
}

export interface GenerateIdeasResponse {
  ideas: MealIdea[];
}

export interface ReplaceIdeaRequest {
  userPrompt: string;
  excludeTitles?: string[];
}

export interface ReplaceIdeaResponse {
  idea: MealIdea;
}

// Mock data for development
const mockIdeas: MealIdea[] = [
  {
    title: "Lentil Tacos",
    summary: "Spiced green lentils with avocado crema in warm tortillas",
    recipe_steps: [
      "Warm tortillas in a dry skillet for 30 seconds each side",
      "Sauté onions and garlic in olive oil until fragrant",
      "Add lentils, cumin, paprika, and vegetable broth",
      "Simmer for 15 minutes until lentils are tender",
      "Mash avocado with lime juice and salt for crema",
      "Assemble tacos with lentil mixture and avocado crema"
    ],
    ingredients: [
      "6 small tortillas",
      "1 cup dried green lentils",
      "1 avocado",
      "1 lime",
      "1 tsp cumin",
      "1 tsp paprika",
      "1 onion",
      "2 cloves garlic",
      "2 tbsp olive oil",
      "1 cup vegetable broth"
    ],
    state: 'suggested'
  },
  {
    title: "Mushroom Risotto",
    summary: "Creamy arborio rice with wild mushrooms and fresh herbs",
    recipe_steps: [
      "Heat vegetable broth in a separate pot and keep warm",
      "Sauté mushrooms in butter until golden, set aside",
      "In same pan, cook onions until translucent",
      "Add arborio rice, stir for 2 minutes until coated",
      "Add wine and stir until absorbed",
      "Add warm broth one ladle at a time, stirring constantly",
      "Continue until rice is creamy and tender, about 20 minutes",
      "Stir in mushrooms, parmesan, and fresh herbs"
    ],
    ingredients: [
      "1 cup arborio rice",
      "4 cups vegetable broth",
      "8 oz mixed mushrooms",
      "1 onion",
      "2 cloves garlic",
      "1/2 cup white wine",
      "1/2 cup parmesan cheese",
      "2 tbsp butter",
      "Fresh thyme",
      "Fresh parsley"
    ],
    state: 'suggested'
  },
  {
    title: "Buddha Bowl",
    summary: "Colorful quinoa bowl with roasted vegetables and tahini dressing",
    recipe_steps: [
      "Cook quinoa according to package directions",
      "Roast sweet potato and broccoli at 400°F for 25 minutes",
      "Massage kale with olive oil and lemon juice",
      "Prepare tahini dressing by whisking tahini, lemon, and water",
      "Assemble bowls with quinoa, roasted vegetables, and kale",
      "Top with chickpeas and drizzle with tahini dressing"
    ],
    ingredients: [
      "1 cup quinoa",
      "1 sweet potato",
      "1 head broccoli",
      "4 cups kale",
      "1 can chickpeas",
      "1/4 cup tahini",
      "2 lemons",
      "2 tbsp olive oil",
      "1 clove garlic",
      "Salt and pepper"
    ],
    state: 'suggested'
  },
  {
    title: "Pasta Primavera",
    summary: "Fresh seasonal vegetables tossed with pasta in light herb sauce",
    recipe_steps: [
      "Cook pasta according to package directions",
      "Sauté garlic in olive oil until fragrant",
      "Add zucchini, bell peppers, and cherry tomatoes",
      "Cook vegetables until tender-crisp, about 5 minutes",
      "Toss hot pasta with vegetables and herbs",
      "Finish with lemon zest and parmesan cheese"
    ],
    ingredients: [
      "12 oz pasta",
      "1 zucchini",
      "1 bell pepper",
      "1 cup cherry tomatoes",
      "3 cloves garlic",
      "1/4 cup olive oil",
      "Fresh basil",
      "Fresh oregano",
      "1 lemon",
      "Parmesan cheese"
    ],
    state: 'suggested'
  }
];

export async function generateIdeas(request: GenerateIdeasRequest): Promise<GenerateIdeasResponse> {
  try {
    // For now, return mock data
    // TODO: Replace with actual API call when backend is ready
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    return {
      ideas: mockIdeas
    };
    
    // Actual API call (commented out for now):
    // const response = await axios.post<GenerateIdeasResponse>(
    //   `${API_BASE_URL}/generateIdeas`,
    //   request
    // );
    // return response.data;
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw new Error('Failed to generate meal ideas');
  }
}

export async function replaceIdea(request: ReplaceIdeaRequest): Promise<ReplaceIdeaResponse> {
  try {
    // For now, return a random mock idea
    // TODO: Replace with actual API call when backend is ready
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const availableIdeas = mockIdeas.filter(
      idea => !request.excludeTitles?.includes(idea.title)
    );
    
    const randomIdea = availableIdeas[Math.floor(Math.random() * availableIdeas.length)];
    
    return {
      idea: {
        ...randomIdea,
        state: 'suggested'
      }
    };
    
    // Actual API call (commented out for now):
    // const response = await axios.post<ReplaceIdeaResponse>(
    //   `${API_BASE_URL}/replaceIdea`,
    //   request
    // );
    // return response.data;
  } catch (error) {
    console.error('Error replacing idea:', error);
    throw new Error('Failed to replace meal idea');
  }
}