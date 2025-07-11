import React, { useState, useEffect } from 'react';
import { ChefHat, BookOpen, Utensils, Flame, Heart, Trash2 } from 'lucide-react';

interface LoadingStage {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: number; // in seconds
  animation: string;
}

const loadingStages: LoadingStage[] = [
  {
    id: 'research',
    icon: <BookOpen className="w-6 h-6" />,
    title: "Researching recipes",
    description: "Flipping through thousands of cookbooks...",
    duration: 3,
    animation: 'animate-bounce'
  },
  {
    id: 'analyzing',
    icon: <ChefHat className="w-6 h-6" />,
    title: "Analyzing your preferences",
    description: "Understanding your taste profile...",
    duration: 2,
    animation: 'animate-spin'
  },
  {
    id: 'chopping',
    icon: <Utensils className="w-6 h-6" />,
    title: "Chopping ingredients",
    description: "Preparing fresh ingredients with precision...",
    duration: 3,
    animation: 'animate-pulse'
  },
  {
    id: 'cooking',
    icon: <Flame className="w-6 h-6" />,
    title: "Cooking test meals",
    description: "Trying different flavor combinations...",
    duration: 4,
    animation: 'animate-ping'
  },
  {
    id: 'tasting',
    icon: <Heart className="w-6 h-6" />,
    title: "Tasting and perfecting",
    description: "Making sure every dish is perfect...",
    duration: 3,
    animation: 'animate-pulse'
  },
  {
    id: 'discarding',
    icon: <Trash2 className="w-6 h-6" />,
    title: "Discarding imperfect meals",
    description: "Only the best recipes make the cut...",
    duration: 2,
    animation: 'animate-bounce'
  },
  {
    id: 'finalizing',
    icon: <ChefHat className="w-6 h-6" />,
    title: "Finalizing your meal plan",
    description: "Putting the finishing touches on your perfect meals...",
    duration: 3,
    animation: 'animate-spin'
  }
];

interface AIChefLoadingProps {
  startTime?: number; // When the API request started
}

const AIChefLoading: React.FC<AIChefLoadingProps> = ({ startTime }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  useEffect(() => {
    const totalDuration = loadingStages.reduce((sum, stage) => sum + stage.duration, 0);
    const requestStartTime = startTime || Date.now();
    
    const interval = setInterval(() => {
      const elapsedTime = (Date.now() - requestStartTime) / 1000; // seconds
      
      // Calculate progress based on elapsed time, but cap at reasonable duration
      const maxDuration = Math.max(totalDuration, 30); // At least 30 seconds
      const timeProgress = Math.min(elapsedTime / maxDuration, 1);
      
      // Use a combination of time-based and stage-based progress
      // This ensures we show realistic progress while keeping stages engaging
      const adaptiveProgress = Math.min(timeProgress * 100, 95); // Keep some buffer for final stage
      
      setProgress(adaptiveProgress);
      
      // Calculate which stage we should be in based on elapsed time
      let accumulatedTime = 0;
      let newStageIndex = 0;
      
      for (let i = 0; i < loadingStages.length; i++) {
        accumulatedTime += loadingStages[i].duration;
        if (elapsedTime <= accumulatedTime) {
          newStageIndex = i;
          break;
        }
      }
      
      // If we've exceeded the planned duration, stay on the last stage
      if (elapsedTime > totalDuration) {
        newStageIndex = loadingStages.length - 1;
      }
      
      // Update stage if changed
      if (newStageIndex !== currentStageIndex) {
        setCurrentStageIndex(newStageIndex);
        // Mark previous stages as completed
        const newCompleted = loadingStages.slice(0, newStageIndex).map(stage => stage.id);
        setCompletedStages(newCompleted);
      }
      
      // Calculate progress within current stage
      const stageStart = loadingStages.slice(0, newStageIndex).reduce((sum, stage) => sum + stage.duration, 0);
      const stageProgressPercent = ((elapsedTime - stageStart) / loadingStages[newStageIndex].duration) * 100;
      setStageProgress(Math.min(Math.max(stageProgressPercent, 0), 100));
    }, 100);

    return () => clearInterval(interval);
  }, [currentStageIndex, startTime]);

  const currentStage = loadingStages[currentStageIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4 relative">
          <ChefHat className="w-10 h-10 text-orange-600" />
          {/* Animated sparkles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your AI Chef is Working Hard!</h2>
        <p className="text-gray-600">Crafting the perfect meal plan just for you...</p>
      </div>

      {/* Current Stage */}
      <div className="flex flex-col items-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 text-orange-600 ${currentStage.animation}`}>
          {currentStage.icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{currentStage.title}</h3>
        <p className="text-gray-600 text-center max-w-md">{currentStage.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="text-sm text-gray-500 mb-2">Current Stage Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-orange-400 h-1 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${stageProgress}%` }}
          />
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {loadingStages.map((stage, index) => (
          <div
            key={stage.id}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
              index === currentStageIndex
                ? 'bg-orange-100 border-2 border-orange-300 scale-105'
                : completedStages.includes(stage.id)
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              index === currentStageIndex
                ? 'bg-orange-200 text-orange-700'
                : completedStages.includes(stage.id)
                ? 'bg-green-200 text-green-700'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {React.cloneElement(stage.icon as React.ReactElement, { className: "w-4 h-4" })}
            </div>
            <span className={`text-xs font-medium text-center ${
              index === currentStageIndex
                ? 'text-orange-700'
                : completedStages.includes(stage.id)
                ? 'text-green-700'
                : 'text-gray-500'
            }`}>
              {stage.title}
            </span>
          </div>
        ))}
      </div>

      {/* Fun Facts */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
          <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {currentStageIndex < 3 ? "Considering over 10,000 recipes..." : 
             currentStageIndex < 5 ? "Testing flavor combinations..." : 
             "Almost ready with your perfect meal plan!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIChefLoading;