
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function FormHeader({ title, subtitle, icon: Icon, className = "" }: FormHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="h-6 w-6 text-[#560005]" />}
        <h2 className="text-2xl font-bold text-[#560005]">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
