
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function FormHeader({ title, description, children }: FormHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div 
      id="form-header"
      className={`${isMobile ? 'fixed top-0 left-0 right-0 z-50 bg-white shadow-sm' : ''} px-4 sm:px-6 py-4`}
    >
      <h2 className="text-2xl font-bold text-[#560005] mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}

export default FormHeader;
