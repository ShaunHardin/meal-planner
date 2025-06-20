import React, { useState, useEffect } from 'react';

const foodEmojis = ['🍅', '🥦', '🧀', '🌽', '🍄', '🥕', '🫑', '🥒'];

const SlotMachineAnim: React.FC = () => {
  const [slots, setSlots] = useState([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      setSlots(prev => prev.map(() => Math.floor(Math.random() * foodEmojis.length)));
    }, 150);

    return () => clearInterval(interval);
  }, [isSpinning]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      {slots.map((slotIndex, index) => (
        <div
          key={index}
          className={`w-12 h-12 flex items-center justify-center text-2xl transition-transform duration-150 ${
            isSpinning ? 'animate-bounce' : ''
          }`}
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          {foodEmojis[slotIndex]}
        </div>
      ))}
    </div>
  );
};

export default SlotMachineAnim;