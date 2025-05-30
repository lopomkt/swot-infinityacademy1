
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFormWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileFormWrapper({ children, className = '' }: MobileFormWrapperProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={`px-4 sm:px-6 max-w-md mx-auto overflow-y-auto min-h-screen bg-white rounded-2xl pb-[88px] ${className}`}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

export default MobileFormWrapper;
