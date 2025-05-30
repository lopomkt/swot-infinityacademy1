
import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface FormTextareaBlockProps {
  id: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
  register: UseFormRegister<any>;
  error?: FieldError;
  type?: 'textarea' | 'input';
  className?: string;
}

export function FormTextareaBlock({
  id,
  label,
  placeholder = "",
  helpText,
  maxLength,
  register,
  error,
  type = 'input',
  className = ""
}: FormTextareaBlockProps) {
  const Component = type === 'textarea' ? Textarea : Input;
  
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block mb-2 font-medium text-base">
        {label}
      </label>
      <Component
        {...register(id)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full border ${error ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none text-black placeholder-gray-400`}
        rows={type === 'textarea' ? 2 : undefined}
      />
      {helpText && (
        <p className="text-sm text-gray-500 mt-1">{helpText}</p>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
}
