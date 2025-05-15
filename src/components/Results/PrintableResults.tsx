
import React from 'react';

interface PrintableResultsProps {
  children: React.ReactNode;
}

export default function PrintableResults({ children }: PrintableResultsProps) {
  return (
    <div id="container_resultado_pdf" className="max-w-5xl mx-auto">
      {children}
    </div>
  );
}
