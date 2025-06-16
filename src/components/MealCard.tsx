import React from 'react';
// import { MealIdea } from '../types.ts';

// Temporary inline interface to test
type MealState = 'loading' | 'suggested' | 'accepted';

interface MealIdea {
  title: string;
  summary: string;
  recipe_steps: string[];
  ingredients: string[];
  state: MealState;
}

interface MealCardProps {
  slotNumber: number;
  idea?: MealIdea;
  onAccept?: () => void;
  onReject?: () => void;
}

export function MealCard({ slotNumber, idea, onAccept, onReject }: MealCardProps) {
  if (!idea || idea.state === 'loading') {
    return <LoadingCard slotNumber={slotNumber} />;
  }

  if (idea.state === 'suggested') {
    return <SuggestedCard idea={idea} onAccept={onAccept} onReject={onReject} />;
  }

  if (idea.state === 'accepted') {
    return <AcceptedCard idea={idea} />;
  }

  return null;
}

function LoadingCard({ slotNumber }: { slotNumber: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}

function SuggestedCard({ idea, onAccept, onReject }: { 
  idea: MealIdea; 
  onAccept?: () => void; 
  onReject?: () => void; 
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {idea.title}
        </h3>
        <div className="flex gap-2 ml-3">
          <button
            onClick={onReject}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Reject"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={onAccept}
            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
            title="Accept"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {idea.summary}
      </p>

      {/* Recipe Accordion */}
      <details className="mb-3">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 py-2 select-none">
          <svg className="w-4 h-4 transition-transform duration-200 details-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Recipe
        </summary>
        <div className="mt-2 pl-6 max-h-56 overflow-y-auto">
          <ol className="space-y-2 text-sm text-gray-600">
            {idea.recipe_steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </details>

      {/* Grocery List Accordion */}
      <details>
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 py-2 select-none">
          <svg className="w-4 h-4 transition-transform duration-200 details-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Grocery List
        </summary>
        <div className="mt-2 pl-6 max-h-56 overflow-y-auto">
          <ul className="space-y-1 text-sm text-gray-600">
            {[...new Set(idea.ingredients)].map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}

function AcceptedCard({ idea }: { idea: MealIdea }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-green-200 p-6 relative">
      {/* Accepted Badge */}
      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
        ✓ Locked
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {idea.title}
        </h3>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {idea.summary}
      </p>

      {/* Recipe Accordion */}
      <details className="mb-3">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 py-2 select-none">
          <svg className="w-4 h-4 transition-transform duration-200 details-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Recipe
        </summary>
        <div className="mt-2 pl-6 max-h-56 overflow-y-auto">
          <ol className="space-y-2 text-sm text-gray-600">
            {idea.recipe_steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </details>

      {/* Grocery List Accordion */}
      <details>
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 py-2 select-none">
          <svg className="w-4 h-4 transition-transform duration-200 details-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Grocery List
        </summary>
        <div className="mt-2 pl-6 max-h-56 overflow-y-auto">
          <ul className="space-y-1 text-sm text-gray-600">
            {[...new Set(idea.ingredients)].map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}