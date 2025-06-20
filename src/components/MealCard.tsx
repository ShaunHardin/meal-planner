import React from 'react';
import { Check, X, CheckCircle } from 'lucide-react';
import SlotMachineAnim from './SlotMachineAnim';
import { MealIdea } from '../App';

interface MealCardProps {
  meal: MealIdea;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onAccept, onReject }) => {
  const getCardStyles = () => {
    switch (meal.state) {
      case 'accepted':
        return 'bg-[#E8F5E9] border-2 border-[#4CAF50]';
      case 'loading':
        return 'bg-white border border-gray-200';
      default:
        return 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md';
    }
  };

  return (
    <div className={`rounded-xl p-6 shadow-sm transition-all duration-300 ${getCardStyles()}`}>
      {meal.state === 'loading' ? (
        <div className="flex items-center justify-center h-32">
          <SlotMachineAnim />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{meal.summary}</p>
          </div>
          
          {meal.state === 'accepted' ? (
            <div className="flex items-center justify-end text-[#4CAF50]">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => onAccept(meal.id)}
                className="flex-1 bg-[#4CAF50] hover:bg-[#45A049] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check className="h-4 w-4" />
                Accept
              </button>
              <button
                onClick={() => onReject(meal.id)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealCard;