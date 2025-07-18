import React, { useState, useEffect } from 'react';

const foodEmojis = ['🍅', '🥦', '🧀', '🌽', '🍄', '🥕', '🫑', '🥒', '🍖', '🍗', '🥩', '🍳', '🥓', '🍞', '🥖', '🫓', '🥨', '🥯', '🧈', '🥞', '🧇', '🍝', '🍜', '🍲', '🥗', '🍱', '🍘', '🍙', '🍚', '🍛', '🍣', '🍤', '🍥', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🫘', '🌶️', '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍆', '🥑', '🥬', '🥒', '🌶️', '🫒', '🥔', '🍠', '🥐', '🥚', '🧄', '🧅', '🫚'];

interface SlotMachineLoaderProps {
  size?: 'large' | 'small';
  isSpinning?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

const SlotMachineLoader: React.FC<SlotMachineLoaderProps> = ({ 
  size = 'small', 
  isSpinning = true, 
  title,
  subtitle,
  className = ''
}) => {
  const [slots, setSlots] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      setSlots(prev => prev.map(() => Math.floor(Math.random() * foodEmojis.length)));
    }, 100);

    return () => clearInterval(interval);
  }, [isSpinning]);

  // Configuration based on size
  const config = {
    large: {
      containerClasses: 'min-h-[400px] p-8 bg-black/20 backdrop-blur-sm rounded-lg',
      slotSize: 'w-20 h-20',
      textSize: 'text-5xl',
      gap: 'gap-3',
      titleSize: 'text-2xl',
      subtitleSize: 'text-lg',
      scale: 'scale-[1.8]'
    },
    small: {
      containerClasses: 'py-8 px-4',
      slotSize: 'w-14 h-14',
      textSize: 'text-3xl',
      gap: 'gap-1',
      titleSize: 'text-lg',
      subtitleSize: 'text-sm',
      scale: 'scale-100'
    }
  };

  const currentConfig = config[size];

  const slotMachine = (
    <div className={`flex items-center justify-center ${currentConfig.gap} ${currentConfig.scale}`}>
      {slots.map((slotIndex, index) => (
        <div
          key={index}
          className={`${currentConfig.slotSize} flex items-center justify-center ${currentConfig.textSize} transition-all duration-100 rounded-lg border-2 ${
            isSpinning 
              ? 'animate-bounce border-blue-300 bg-blue-50 shadow-lg' 
              : 'border-gray-200 bg-white'
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: isSpinning ? 'scale(1.1)' : 'scale(1)'
          }}
          aria-hidden="true"
        >
          {foodEmojis[slotIndex]}
        </div>
      ))}
    </div>
  );

  if (size === 'large') {
    return (
      <div 
        className={`flex flex-col items-center justify-center ${currentConfig.containerClasses} ${className}`}
        role="status"
        aria-busy={isSpinning}
        aria-label={title || 'Loading meals'}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`${currentConfig.titleSize} font-bold text-gray-800 mb-2`}>
            {title || 'Generating Your Meal Plan'}
          </h2>
          {subtitle && (
            <p className={`${currentConfig.subtitleSize} text-gray-600`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Slot Machine Animation */}
        {slotMachine}

        {/* Loading message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-600">
              Rolling the perfect meal combinations...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center ${currentConfig.containerClasses} ${className}`}
      role="status"
      aria-busy={isSpinning}
      aria-label={title || 'Loading meal suggestion'}
    >
      {slotMachine}
      <p className="text-gray-500 text-sm mt-4">
        {title || 'Generating new meal suggestion...'}
      </p>
    </div>
  );
};

export default SlotMachineLoader;