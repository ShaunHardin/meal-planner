import React from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface OpenAIResponseDisplayProps {
  response: string;
  isLoading: boolean;
  error: string | null;
}

const OpenAIResponseDisplay: React.FC<OpenAIResponseDisplayProps> = ({ 
  response, 
  isLoading, 
  error 
}) => {
  if (!isLoading && !response && !error) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200" data-testid="ai-response-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
        {error && <AlertCircle className="w-5 h-5 text-red-600" />}
        {response && !error && <CheckCircle className="w-5 h-5 text-green-600" />}
        AI Meal Suggestions
      </h3>
      
      {isLoading && (
        <div className="flex items-center justify-center py-8" data-testid="ai-response-loading">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">Generating personalized meal suggestions...</p>
          </div>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200" data-testid="ai-response-error">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-1">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {response && !error && (
        <div className="p-4 bg-white rounded-lg border border-gray-200" data-testid="ai-response-success">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
              {response}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAIResponseDisplay;