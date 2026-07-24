import { useEffect } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { X } from '@/components/Icons';

export function PaymentFailPage() {
  const { setCurrentPage } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const message = params.get('message');

    if (code && message) {
      // Real Toss failure redirect — go back to payment page
      const timer = setTimeout(() => setCurrentPage('payment'), 1500);
      return () => clearTimeout(timer);
    }
  }, [setCurrentPage]);

  return (
    <PageContainer className="bg-base">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-scaleIn">
          <X className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="font-batang text-2xl text-text mb-3 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
          결제에 실패했어요.
        </h1>
        <p className="font-sans text-sm text-text-sub mb-8 animate-fadeUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
          잠시 후 결제 페이지로 이동합니다.
        </p>
      </div>
    </PageContainer>
  );
}
