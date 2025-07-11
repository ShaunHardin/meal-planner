import React, { useState, useEffect } from 'react';

const foodEmojis = ['🍅', '🥦', '🧀', '🌽', '🍄', '🥕', '🫑', '🥒', '🍖', '🍗', '🥩', '🍳', '🥓', '🍞', '🥖', '🫓', '🥨', '🥯', '🧈', '🥞', '🧇', '🍝', '🍜', '🍲', '🥗', '🍱', '🍘', '🍙', '🍚', '🍛', '🍣', '🍤', '🍥', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🫘', '🌶️', '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍆', '🥑', '🥬', '🥒', '🌶️', '🫒', '🥔', '🍠', '🥐', '🥚', '🧄', '🧅', '🫚'];

interface SlotMachineAnimProps {
  isSpinning?: boolean;
}

const SlotMachineAnim: React.FC<SlotMachineAnimProps> = ({ isSpinning = true }) => {
  const [slots, setSlots] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      setSlots(prev => prev.map(() => Math.floor(Math.random() * foodEmojis.length)));
    }, 100);

    return () => clearInterval(interval);
  }, [isSpinning]);

  return (
    <div className="flex items-center justify-center gap-1">
      {slots.map((slotIndex, index) => (
        <div
          key={index}
          className={`w-14 h-14 flex items-center justify-center text-3xl transition-all duration-100 rounded-lg border-2 ${
            isSpinning 
              ? 'animate-bounce border-blue-300 bg-blue-50 shadow-lg' 
              : 'border-gray-200 bg-white'
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: isSpinning ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {foodEmojis[slotIndex]}
        </div>
      ))}
    </div>
  );
};

export default SlotMachineAnim;