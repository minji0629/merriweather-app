import { ReactNode } from 'react';
import { BusinessFooter } from '@/components/BusinessFooter';

export function PageContainer({ children, className = '', footer = true }: { children: ReactNode; className?: string; footer?: boolean }) {
  return (
    <div className={`relative w-full max-w-mobile min-h-screen mx-auto overflow-x-hidden flex flex-col ${className}`}>
      <div className="flex-1 min-h-0">{children}</div>
      {footer && <BusinessFooter />}
    </div>
  );
}
