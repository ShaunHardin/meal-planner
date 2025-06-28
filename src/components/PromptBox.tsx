import React from 'react';

interface PromptBoxProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  showGrid: boolean;
  isGenerating?: boolean;
}

const PromptBox: React.FC<PromptBoxProps> = ({ prompt, setPrompt, onGenerate, showGrid, isGenerating = false }) => {
  const isValidPrompt = prompt.trim().length >= 10 && prompt.trim().length <= 500;
  const promptLength = prompt.trim().length;
  
  const getValidationMessage = () => {
    if (promptLength === 0) return null;
    if (promptLength < 10) return "Prompt must be at least 10 characters long";
    if (promptLength > 500) return "Prompt must be 500 characters or less";
    return null;
  };
  
  const validationMessage = getValidationMessage();
  
  return (
    <div className={`${showGrid ? 'mb-8' : 'text-center'} transition-all duration-300`}>
      <div className={`${showGrid ? '' : 'max-w-lg mx-auto'}`}>
        <div className="space-y-6">
          <div>
            <label 
              htmlFor="meal-prompt" 
              className="block text-lg font-medium text-gray-900 mb-3"
            >
              Describe the dinners you need this week
            </label>
            <textarea
              id="meal-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={500}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
                validationMessage ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="I need 4 quick vegetarian dinners that are budget-friendly and use common ingredients..."
            />
            <div className="flex justify-between items-center mt-2">
              {validationMessage && (
                <span className="text-sm text-red-600">{validationMessage}</span>
              )}
              <span className={`text-sm ml-auto ${validationMessage ? 'text-red-600' : 'text-gray-500'}`}>
                {prompt.length}/500
              </span>
            </div>
          </div>
          
          {!showGrid && (
            <button
              onClick={onGenerate}
              disabled={!isValidPrompt || isGenerating}
              className="w-full bg-[#4CAF50] hover:bg-[#45A049] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? 'Generating Ideas...' : 'Generate Ideas'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptBox;