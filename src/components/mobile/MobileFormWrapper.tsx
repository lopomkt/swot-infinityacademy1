
import React from 'react';
import { useIsSmallScreen } from '@/hooks/use-mobile';

interface MobileFormWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileFormWrapper({ children, className = '' }: MobileFormWrapperProps) {
  const isSmallScreen = useIsSmallScreen();

  if (isSmallScreen) {
    return (
      <div className={`px-4 py-6 max-w-md mx-auto w-full overflow-hidden ${className}`}>
        <div className="scroll-y-auto">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default MobileFormWrapper;
