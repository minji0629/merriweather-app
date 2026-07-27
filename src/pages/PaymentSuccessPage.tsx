import { useEffect } from 'react';
import { useApp } from '@/store/useApp';
import { useAuth } from '@/store/useAuth';
import { savePurchase, markLatestResultPaid } from '@/lib/supabase';
import { PageContainer } from '@/components/PageContainer';
import { Check, Sparkles } from '@/components/Icons';

export function PaymentSuccessPage() {
  const { setCurrentPage, residentKey } = useApp();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');

    const hasValidParams = paymentKey && orderId && amount;

    if (hasValidParams && user) {
      const productType = orderId.includes('expedition_plus')
        ? '탐험권+추가질문'
        : '탐험권';
      savePurchase(
        String(user.id),
        productType,
        Number(amount),
        paymentKey,
        orderId,
      ).catch((err) => console.error('[Supabase] savePurchase failed:', err));
      markLatestResultPaid(String(user.id)).catch((err) =>
        console.error('[Supabase] markLatestResultPaid failed:', err),
      );
    }

    const timer = setTimeout(() => {
      if (hasValidParams && residentKey) {
        setCurrentPage('premium');
      } else if (hasValidParams && !residentKey) {
        window.location.href = '/';
      } else {
        setCurrentPage('payment');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [setCurrentPage, residentKey, user]);

  return (
    <PageContainer className="bg-base">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-point/15 flex items-center justify-center mb-6 animate-scaleIn">
          <Check className="w-10 h-10 text-point" />
        </div>
        <h1 className="font-batang text-2xl text-text mb-3 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
          결제가 완료됐어요!
        </h1>
        <p className="font-sans text-sm text-text-sub mb-8 animate-fadeUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
          잠시 후 유료 결과 페이지로 이동합니다.
        </p>
        <div className="flex items-center gap-2 text-point-dark animate-fadeUp" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="font-sans text-sm">이동 중...</span>
        </div>
      </div>
    </PageContainer>
  );
}
