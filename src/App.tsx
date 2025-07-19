import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptBox from './components/PromptBox';
import StructuredMealGrid from './components/StructuredMealGrid';
import Footer from './components/Footer';
import AIChefLoading from './components/AIChefLoading';
import QuickLoadingSpinner from './components/QuickLoadingSpinner';
import { Meal } from './types/meal';
import { MealPlanService } from './services/meal-plan-service';
import { isSupabaseConfigured } from './lib/db';
import { getCurrentMondayDate, getWeekRangeString } from './utils/date-helpers';
import { NOTIFICATION_TIMEOUTS } from './constants/timeouts';

interface ConversationHistory {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [prompt, setPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false);
  const [rerollLoadingStates, setRerollLoadingStates] = useState<Record<string, boolean>>({});
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [apiStartTime, setApiStartTime] = useState<number | null>(null);
  
  // Meal plan persistence state
  const [currentWeekStart] = useState<Date>(getCurrentMondayDate());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSupabaseEnabled] = useState(isSupabaseConfigured());

  // Define loadCurrentWeekPlan before using it in useEffect
  const loadCurrentWeekPlan = useCallback(async () => {
    if (!isSupabaseEnabled) return;

    setSaveError(null);

    try {
      const savedPlan = await MealPlanService.getPlanByWeek(currentWeekStart);
      if (savedPlan) {
        setMeals(savedPlan.meals);
      }
    } catch (error) {
      // Don't show error for loading - silently fail to avoid interrupting user experience
      // In production, this should be sent to a logging service
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load saved plan:', error);
      }
    }
  }, [isSupabaseEnabled, currentWeekStart]);

  // Load saved meal plan on mount
  useEffect(() => {
    if (isSupabaseEnabled) {
      loadCurrentWeekPlan();
    }
  }, [isSupabaseEnabled, loadCurrentWeekPlan]);

  // Auto-hide success message
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), NOTIFICATION_TIMEOUTS.SUCCESS);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const saveMealPlan = async () => {
    if (!isSupabaseEnabled || meals.length === 0) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await MealPlanService.savePlan(currentWeekStart, meals);
      setSaveSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save meal plan';
      setSaveError(errorMessage);
      
      // Auto-hide error message
      setTimeout(() => setSaveError(null), NOTIFICATION_TIMEOUTS.ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  const generateIdeas = async () => {
    // Clear previous errors
    setGenerationError(null);
    setIsGeneratingMeals(true);
    
    // Track API start time for loading animation
    const startTime = Date.now();
    setApiStartTime(startTime);

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
      
      const duration = Date.now() - startTime;
      console.log(`Frontend: Generate meals request took ${duration}ms`);

      const data = await response.json();

      if (response.ok) {
        setMeals(data.meals || []);
        setConversationHistory(data.history || []);
        setOriginalPrompt(prompt.trim());
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


  const handleRerollMeal = async (mealId: string) => {
    const mealToReroll = meals.find(meal => meal.id === mealId);
    if (!mealToReroll || !originalPrompt) return;

    // Set loading state for this specific meal
    setRerollLoadingStates(prev => ({ ...prev, [mealId]: true }));
    setToastMessage(null);

    try {
      const existingMealNames = meals
        .filter(meal => meal.id !== mealId)
        .map(meal => meal.name);

      const response = await fetch('/api/reroll-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPrompt,
          dayToReroll: mealToReroll.day,
          existingMealNames,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Replace the meal in the array
        setMeals(prev => prev.map(meal => 
          meal.id === mealId ? { ...data.meal, id: mealId } : meal
        ));
      } else {
        throw new Error(data.error || 'Failed to reroll meal');
      }
    } catch {
      setToastMessage("Couldn't fetch a new idea – try again");
      
      // Auto-hide toast message
      setTimeout(() => setToastMessage(null), NOTIFICATION_TIMEOUTS.TOAST);
    } finally {
      setRerollLoadingStates(prev => ({ ...prev, [mealId]: false }));
    }
  };

  const handleReorderMeals = (reorderedMeals: Meal[]) => {
    setMeals(reorderedMeals);
  };


  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      
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
          
          {toastMessage && (
            <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0">🎲</div>
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">Reroll Failed</h4>
                  <p className="text-orange-700">{toastMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Save plan error message */}
          {saveError && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0">💾</div>
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Save Failed</h4>
                  <p className="text-red-700">{saveError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Save plan success message */}
          {saveSuccess && (
            <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0">✅</div>
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Plan Saved</h4>
                  <p className="text-green-700">Your meal plan for {getWeekRangeString(currentWeekStart)} has been saved!</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Save week button */}
          {isSupabaseEnabled && meals.length > 0 && (
            <div className="mb-8 flex justify-center">
              <button
                onClick={saveMealPlan}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4">💾</div>
                    Save Week Plan
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Supabase not configured message */}
          {!isSupabaseEnabled && meals.length > 0 && (
            <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0">⚙️</div>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Setup Required</h4>
                  <p className="text-yellow-700">
                    To save your meal plans, configure Supabase by following the setup guide in SUPABASE_SETUP.md
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isGeneratingMeals && meals.length === 0 ? (
            <AIChefLoading startTime={apiStartTime || undefined} />
          ) : isGeneratingMeals && meals.length > 0 ? (
            <QuickLoadingSpinner />
          ) : (
            <StructuredMealGrid 
              meals={meals}
              onEditMeal={handleEditMeal}
              onRerollMeal={handleRerollMeal}
              onReorderMeals={handleReorderMeals}
              isLoading={isGeneratingMeals}
              rerollLoadingStates={rerollLoadingStates}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;