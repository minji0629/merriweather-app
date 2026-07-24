import { ReactNode } from 'react';

export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative w-full max-w-mobile min-h-screen mx-auto overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
