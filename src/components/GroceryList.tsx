import React from 'react';
import { Meal } from '../types/meal';
import { createGroceryList, GroceryItem } from '../utils/groceryList';

interface GroceryListProps {
  meals: Meal[];
  onClose: () => void;
}

export function GroceryList({ meals, onClose }: GroceryListProps) {
  const groceryItems = createGroceryList(meals);

  if (groceryItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Grocery List</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600">No meals selected. Generate some meals first!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Grocery List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">
            Combined ingredients from {meals.length} meal{meals.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-3">
          {groceryItems.map((item, index) => (
            <GroceryItemCard key={index} item={item} />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {groceryItems.length} unique item{groceryItems.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => copyToClipboard(groceryItems)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GroceryItemCardProps {
  item: GroceryItem;
}

function GroceryItemCard({ item }: GroceryItemCardProps) {
  const showDetails = item.originalQuantities.length > 1;

  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">{item.item}</span>
          <span className="text-gray-600 font-mono">{item.quantity}</span>
        </div>
        {showDetails && (
          <div className="mt-1 text-sm text-gray-500">
            Combined from: {item.originalQuantities.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

function copyToClipboard(groceryItems: GroceryItem[]) {
  const text = groceryItems
    .map(item => `• ${item.item}: ${item.quantity}`)
    .join('\n');
  
  navigator.clipboard.writeText(text).then(() => {
    // Could add a toast notification here
    console.log('Grocery list copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err);
  });
}