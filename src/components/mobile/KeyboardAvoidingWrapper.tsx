
import React, { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function KeyboardAvoidingWrapper({ children, className = '' }: KeyboardAvoidingWrapperProps) {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }, 300);
      }
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('focusin', handleFocus);
      return () => wrapper.removeEventListener('focusin', handleFocus);
    }
  }, [isMobile]);

  if (!isMobile) return <>{children}</>;

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}

export default KeyboardAvoidingWrapper;
