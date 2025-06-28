import React, { useState } from 'react';
import StructuredMealCard from './StructuredMealCard';
import { Meal } from '../types/meal';

interface StructuredMealGridProps {
  meals: Meal[];
  onEditMeal?: (mealId: string, editPrompt: string) => void;
  onRemoveMeal?: (mealId: string) => void;
  onReorderMeals?: (reorderedMeals: Meal[]) => void;
  isLoading?: boolean;
}

const StructuredMealGrid: React.FC<StructuredMealGridProps> = ({ 
  meals, 
  onEditMeal, 
  onRemoveMeal,
  onReorderMeals,
  isLoading = false 
}) => {
  const [draggedMealId, setDraggedMealId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (mealId: string) => {
    setDraggedMealId(mealId);
  };

  const handleDragEnd = () => {
    setDraggedMealId(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedMealId || !onReorderMeals) return;
    
    const draggedIndex = sortedMeals.findIndex(meal => meal.id === draggedMealId);
    if (draggedIndex === -1 || draggedIndex === dropIndex) return;
    
    const newMeals = [...sortedMeals];
    const [draggedMeal] = newMeals.splice(draggedIndex, 1);
    newMeals.splice(dropIndex, 0, draggedMeal);
    
    onReorderMeals(newMeals);
    setDraggedMealId(null);
    setDragOverIndex(null);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in" data-testid="structured-meal-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-10 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="p-4 border-b border-gray-100">
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-12" data-testid="structured-meal-grid">
        <div className="text-gray-500 text-lg mb-2">No meals planned yet</div>
        <div className="text-gray-400 text-sm">
          Enter your preferences above to generate meal suggestions
        </div>
      </div>
    );
  }

  // Sort meals by day of week for better organization
  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sortedMeals = [...meals].sort((a, b) => {
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });

  return (
    <div className="animate-fade-in" data-testid="structured-meal-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedMeals.map((meal, index) => (
          <div
            key={meal.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`${
              dragOverIndex === index ? 'bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg p-2' : ''
            }`}
          >
            <StructuredMealCard
              meal={meal}
              onEdit={onEditMeal}
              onRemove={onRemoveMeal}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragging={draggedMealId === meal.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructuredMealGrid;