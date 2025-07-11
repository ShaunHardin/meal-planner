import React, { useState } from 'react';
import { Clock, Users, ChefHat, Edit2, Check } from 'lucide-react';
import { Meal } from '../types/meal';
import SlotMachineAnim from './SlotMachineAnim';

interface StructuredMealCardProps {
  meal: Meal;
  onEdit?: (mealId: string, editPrompt: string) => void;
  onReroll?: (mealId: string) => void;
  onDragStart?: (mealId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isRerolling?: boolean;
}

const StructuredMealCard: React.FC<StructuredMealCardProps> = ({ 
  meal, 
  onEdit, 
  onReroll,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isRerolling = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = () => {
    if (editPrompt.trim() && onEdit) {
      onEdit(meal.id, editPrompt.trim());
      setEditPrompt('');
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditPrompt('');
    setIsEditing(false);
  };

  const totalTime = meal.prepMinutes + meal.cookMinutes;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', meal.id);
    onDragStart?.(meal.id);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50 transform rotate-2' : ''
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isRerolling ? (
              <div className="flex flex-col items-center justify-center py-8">
                <SlotMachineAnim isSpinning={isRerolling} />
                <p className="text-gray-500 text-sm mt-4">Generating new meal suggestion...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {meal.day}
                  </span>
                  {meal.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{meal.name}</h3>
                <p className="text-gray-600 text-sm">{meal.description}</p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {onEdit && !isRerolling && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit meal"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onReroll && (
              <button
                onClick={() => onReroll(meal.id)}
                disabled={isRerolling}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Re-roll meal suggestion"
              >
                <span className={`text-base ${isRerolling ? 'animate-spin' : ''}`}>🎲</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timing */}
      {!isRerolling && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>Prep: {meal.prepMinutes}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Cook: {meal.cookMinutes}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Total: {totalTime}m</span>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients */}
      {!isRerolling && (
        <div className="p-4 border-b border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2">Ingredients</h4>
          <ul className="space-y-1">
            {meal.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm text-gray-600 flex">
                <span className="font-medium min-w-0 flex-1">{ingredient.item}</span>
                <span className="text-gray-500 ml-2">{ingredient.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {!isRerolling && (
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
          <ol className="space-y-2">
            {meal.steps.map((step, index) => (
              <li key={index} className="text-sm text-gray-600 flex">
                <span className="font-medium text-gray-900 mr-2 min-w-[1.5rem]">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit {meal.name}</h3>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="Describe how you'd like to modify this meal..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!editPrompt.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuredMealCard;