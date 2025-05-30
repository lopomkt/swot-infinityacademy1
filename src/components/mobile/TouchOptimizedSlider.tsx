
import React from 'react';

interface TouchOptimizedSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function TouchOptimizedSlider({
  min,
  max,
  step,
  value,
  onChange,
  className = ''
}: TouchOptimizedSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`relative h-12 px-4 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-3 bg-neutral-200 rounded-full appearance-none cursor-pointer
                   hover:scale-105 active:ring-2 active:ring-[#ef0002] active:ring-opacity-50
                   transition-all duration-200
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-6
                   [&::-webkit-slider-thumb]:w-6
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[#ef0002]
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-moz-range-thumb]:h-6
                   [&::-moz-range-thumb]:w-6
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-[#ef0002]
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:border-none
                   [&::-moz-range-thumb]:shadow-md"
        style={{ accentColor: '#ef0002' }}
      />
    </div>
  );
}

export default TouchOptimizedSlider;
