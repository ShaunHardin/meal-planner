import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-[#4CAF50]" />
            <h1 className="text-xl font-semibold text-gray-900">Meal Planner</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;