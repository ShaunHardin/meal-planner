import React, { useState } from 'react';
import Header from './components/Header';
import PromptBox from './components/PromptBox';
import StructuredMealGrid from './components/StructuredMealGrid';
import Footer from './components/Footer';
import { Meal } from './types/meal';

interface ConversationHistory {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);

  const generateIdeas = async () => {
    // Clear previous errors
    setGenerationError(null);
    setIsGeneratingMeals(true);

    try {
      // Call OpenAI API with user prompt and conversation history
      const response = await fetch('/api/generate-meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          history: conversationHistory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMeals(data.meals || []);
        setConversationHistory(data.history || []);
      } else {
        throw new Error(data.error || 'Failed to generate meal suggestions');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setGenerationError(errorMessage);
    } finally {
      setIsGeneratingMeals(false);
    }
  };

  const handleEditMeal = async (mealId: string, editPrompt: string) => {
    setIsGeneratingMeals(true);
    setGenerationError(null);

    try {
      const fullPrompt = `Edit the meal with ID ${mealId}: ${editPrompt}`;
      
      const response = await fetch('/api/generate-meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: fullPrompt,
          history: conversationHistory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMeals(data.meals || []);
        setConversationHistory(data.history || []);
      } else {
        throw new Error(data.error || 'Failed to edit meal');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setGenerationError(errorMessage);
    } finally {
      setIsGeneratingMeals(false);
    }
  };

  const handleRemoveMeal = (mealId: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const handleReorderMeals = (reorderedMeals: Meal[]) => {
    setMeals(reorderedMeals);
  };

  const clearMeals = () => {
    setMeals([]);
    setConversationHistory([]);
    setGenerationError(null);
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <Header onShuffleAll={clearMeals} showShuffle={meals.length > 0} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <PromptBox 
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={generateIdeas}
            showGrid={meals.length > 0}
            isGenerating={isGeneratingMeals}
          />
          
          {generationError && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0">⚠️</div>
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Error</h4>
                  <p className="text-red-700">{generationError}</p>
                </div>
              </div>
            </div>
          )}
          
          <StructuredMealGrid 
            meals={meals}
            onEditMeal={handleEditMeal}
            onRemoveMeal={handleRemoveMeal}
            onReorderMeals={handleReorderMeals}
            isLoading={isGeneratingMeals}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;