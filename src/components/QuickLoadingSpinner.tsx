import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

const QuickLoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <ChefHat className="w-8 h-8 text-orange-600 animate-bounce" />
          <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-ping" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-medium">Your chef is updating the meal plan...</p>
          <div className="flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce mr-1"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce mr-1" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLoadingSpinner;