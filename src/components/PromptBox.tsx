import React, { useState } from 'react';

interface PromptBoxProps {
  onGenerate: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function PromptBox({ 
  onGenerate, 
  isLoading = false, 
  placeholder = "Describe your meal preferences... (e.g., 'I need 4 quick vegetarian dinners with simple ingredients')"
}: PromptBoxProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const isDisabled = isLoading || !prompt.trim();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="meal-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            What kind of meals are you looking for?
          </label>
          <textarea
            id="meal-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={3}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              resize-none transition-colors
              ${isLoading 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-900'
              }
            `}
          />
          <p className="mt-1 text-xs text-gray-500">
            Tip: Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to generate
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {prompt.length > 0 && (
              <span className={prompt.length > 200 ? 'text-amber-600' : ''}>
                {prompt.length} characters
              </span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isDisabled}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200
              flex items-center gap-2 min-w-[120px] justify-center
              ${isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Ideas
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}