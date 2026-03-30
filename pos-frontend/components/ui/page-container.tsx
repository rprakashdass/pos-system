import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  topPadding?: string;
}

export default function PageContainer({ children, className = '', topPadding = 'pt-20' }: PageContainerProps) {
  return (
    <div className={`pl-6 sm:pl-8 lg:pl-12 pr-6 sm:pr-8 lg:pr-8 w-full ${topPadding} ${className}`}>
      {children}
    </div>
  );
}