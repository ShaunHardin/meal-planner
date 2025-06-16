import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MealCard } from './components/MealCard';
import { PromptBox } from './components/PromptBox';
// import { MealSlot } from './types.ts';

// Temporary inline interface to test
interface MealIdea {
  title: string;
  summary: string;
  recipe_steps: string[];
  ingredients: string[];
  state: 'loading' | 'suggested' | 'accepted';
}

interface MealSlot {
  id: number;
  idea?: MealIdea;
}
import { generateIdeas, replaceIdea } from './api';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Meal Planner
              </h1>
              <ShuffleAllButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MealPlannerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function ShuffleAllButton() {
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffleAll = async () => {
    // TODO: Implement shuffle all functionality
    setIsShuffling(true);
    setTimeout(() => setIsShuffling(false), 2000);
  };

  return (
    <button 
      onClick={handleShuffleAll}
      disabled={isShuffling}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
        ${isShuffling 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
      `}
    >
      {isShuffling ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          Shuffling...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Shuffle All
        </>
      )}
    </button>
  );
}

function MealPlannerPage() {
  const [mealSlots, setMealSlots] = useState<MealSlot[]>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    
    // Set all slots to loading state
    setMealSlots(slots => slots.map(slot => ({
      ...slot,
      idea: { 
        title: '', 
        summary: '', 
        recipe_steps: [], 
        ingredients: [], 
        state: 'loading' as const 
      }
    })));

    try {
      const response = await generateIdeas({ userPrompt: prompt });
      
      // Update slots with generated ideas
      setMealSlots(slots => slots.map((slot, index) => ({
        ...slot,
        idea: response.ideas[index] || undefined
      })));
      
      setHasGenerated(true);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      // Reset to empty state on error
      setMealSlots(slots => slots.map(slot => ({
        ...slot,
        idea: undefined
      })));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = (slotId: number) => {
    setMealSlots(slots => slots.map(slot => 
      slot.id === slotId && slot.idea
        ? { ...slot, idea: { ...slot.idea, state: 'accepted' as const } }
        : slot
    ));
  };

  const handleReject = async (slotId: number) => {
    const slot = mealSlots.find(s => s.id === slotId);
    if (!slot?.idea) return;

    // Set slot to loading
    setMealSlots(slots => slots.map(s => 
      s.id === slotId 
        ? { ...s, idea: { ...s.idea!, state: 'loading' as const } }
        : s
    ));

    try {
      const excludeTitles = mealSlots
        .filter(s => s.idea && s.id !== slotId)
        .map(s => s.idea!.title);

      const response = await replaceIdea({ 
        userPrompt: 'Replace with a different meal idea',
        excludeTitles 
      });

      setMealSlots(slots => slots.map(s => 
        s.id === slotId 
          ? { ...s, idea: response.idea }
          : s
      ));
    } catch (error) {
      console.error('Failed to replace idea:', error);
      // Revert to original state on error
      setMealSlots(slots => slots.map(s => 
        s.id === slotId 
          ? { ...s, idea: { ...slot.idea!, state: 'suggested' as const } }
          : s
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Weekly Dinner Plan
        </h2>
      </div>

      {/* Prompt Box - show only if no ideas generated yet */}
      {!hasGenerated && (
        <PromptBox 
          onGenerate={handleGenerate}
          isLoading={isGenerating}
          placeholder="Describe your meal preferences... (e.g., 'I need 4 quick vegetarian dinners with simple ingredients')"
        />
      )}

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mealSlots.map((slot) => (
          <MealCard
            key={slot.id}
            slotNumber={slot.id}
            idea={slot.idea}
            onAccept={() => handleAccept(slot.id)}
            onReject={() => handleReject(slot.id)}
          />
        ))}
      </div>

      {/* Show PromptBox again after generation for new ideas */}
      {hasGenerated && (
        <div className="pt-4">
          <PromptBox 
            onGenerate={handleGenerate}
            isLoading={isGenerating}
            placeholder="Want different ideas? Describe new preferences..."
          />
        </div>
      )}
    </div>
  );
}

export default App;
