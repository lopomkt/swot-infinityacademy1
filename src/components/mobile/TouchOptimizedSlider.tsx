
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
    <div className={`relative ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-3 bg-neutral-200 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-8
                   [&::-webkit-slider-thumb]:w-8
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[#ef0002]
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-moz-range-thumb]:h-8
                   [&::-moz-range-thumb]:w-8
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-[#ef0002]
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:border-none
                   [&::-moz-range-thumb]:shadow-md
                   relative
                   before:absolute
                   before:inset-0
                   before:h-12
                   before:w-full
                   before:cursor-pointer"
      />
    </div>
  );
}

export default TouchOptimizedSlider;
