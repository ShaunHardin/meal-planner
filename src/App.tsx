import React, { useState } from 'react';
import Header from './components/Header';
import PromptBox from './components/PromptBox';
import MealGrid from './components/MealGrid';
import Footer from './components/Footer';

export interface MealIdea {
  id: string;
  title: string;
  summary: string;
  state: 'loading' | 'suggested' | 'accepted';
}

const initialMealIdeas: MealIdea[] = [
  {
    id: '1',
    title: 'Lentil Tacos',
    summary: 'Spiced green lentils topped with avocado crema in warm tortillas.',
    state: 'suggested'
  },
  {
    id: '2',
    title: 'Caprese Pasta',
    summary: '15-min cherry-tomato pasta with fresh mozzarella & basil.',
    state: 'suggested'
  },
  {
    id: '3',
    title: 'Chickpea Curry',
    summary: 'One-pot coconut curry served over microwave rice.',
    state: 'suggested'
  },
  {
    id: '4',
    title: 'Veggie Stir-Fry',
    summary: 'Quick soy-ginger stir-fry with frozen mixed veggies.',
    state: 'suggested'
  }
];

const alternativeMeals = [
  {
    title: 'Spinach & Feta Quesadillas',
    summary: 'Crispy tortillas filled with spinach, feta, and caramelized onions.'
  },
  {
    title: 'Mushroom Risotto',
    summary: 'Creamy arborio rice with mixed mushrooms and parmesan.'
  },
  {
    title: 'Sweet Potato Bowls',
    summary: 'Roasted sweet potato with black beans and tahini dressing.'
  },
  {
    title: 'Thai Basil Noodles',
    summary: 'Rice noodles with fresh basil, vegetables, and lime.'
  },
  {
    title: 'Mediterranean Wrap',
    summary: 'Hummus wrap with cucumber, tomatoes, and olives.'
  },
  {
    title: 'Zucchini Fritters',
    summary: 'Crispy zucchini fritters with yogurt dipping sauce.'
  }
];

function App() {
  const [showGrid, setShowGrid] = useState(false);
  const [mealIdeas, setMealIdeas] = useState<MealIdea[]>([]);
  const [prompt, setPrompt] = useState('');

  const generateIdeas = () => {
    // Set loading state
    const loadingIdeas = initialMealIdeas.map(idea => ({
      ...idea,
      state: 'loading' as const
    }));
    
    setMealIdeas(loadingIdeas);
    setShowGrid(true);

    // After 800ms, show suggested ideas
    setTimeout(() => {
      setMealIdeas(initialMealIdeas);
    }, 800);
  };

  const acceptMeal = (id: string) => {
    setMealIdeas(prev => prev.map(meal => 
      meal.id === id ? { ...meal, state: 'accepted' as const } : meal
    ));
  };

  const rejectMeal = (id: string) => {
    // Set to loading
    setMealIdeas(prev => prev.map(meal => 
      meal.id === id ? { ...meal, state: 'loading' as const } : meal
    ));

    // After 800ms, show new suggestion
    setTimeout(() => {
      const randomMeal = alternativeMeals[Math.floor(Math.random() * alternativeMeals.length)];
      setMealIdeas(prev => prev.map(meal => 
        meal.id === id ? { 
          ...meal, 
          title: randomMeal.title,
          summary: randomMeal.summary,
          state: 'suggested' as const 
        } : meal
      ));
    }, 800);
  };

  const shuffleAll = () => {
    // Set non-accepted meals to loading
    setMealIdeas(prev => prev.map(meal => 
      meal.state !== 'accepted' ? { ...meal, state: 'loading' as const } : meal
    ));

    // After 800ms, show new suggestions for non-accepted meals
    setTimeout(() => {
      setMealIdeas(prev => prev.map(meal => {
        if (meal.state === 'accepted') return meal;
        
        const randomMeal = alternativeMeals[Math.floor(Math.random() * alternativeMeals.length)];
        return {
          ...meal,
          title: randomMeal.title,
          summary: randomMeal.summary,
          state: 'suggested' as const
        };
      }));
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <Header onShuffleAll={shuffleAll} showShuffle={showGrid} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <PromptBox 
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={generateIdeas}
            showGrid={showGrid}
          />
          
          {showGrid && (
            <MealGrid 
              mealIdeas={mealIdeas}
              onAccept={acceptMeal}
              onReject={rejectMeal}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;