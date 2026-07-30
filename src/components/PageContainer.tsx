import { ReactNode } from 'react';
import { BusinessFooter } from '@/components/BusinessFooter';

export function PageContainer({ children, className = '', footer = true }: { children: ReactNode; className?: string; footer?: boolean }) {
  return (
    <div className={`relative w-full max-w-mobile mx-auto overflow-x-hidden ${className}`}>
      <div className="relative min-h-screen flex flex-col">{children}</div>
      {footer && <BusinessFooter />}
    </div>
  );
}
