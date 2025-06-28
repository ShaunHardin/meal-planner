import React from 'react';
import MealCard from './MealCard';
import { MealIdea } from '../App';

interface MealGridProps {
  mealIdeas: MealIdea[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const MealGrid: React.FC<MealGridProps> = ({ mealIdeas, onAccept, onReject }) => {
  return (
    <div className="animate-fade-in" data-testid="meal-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealIdeas.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
};

export default MealGrid;