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

    console.log('[Payment Success] 파라미터:', { paymentKey, orderId, amount });
    console.log('[Payment Success] 현재 사용자:', user ? { id: user.id, nickname: user.nickname } : null);

    const hasValidParams = paymentKey && orderId && amount;

    if (!hasValidParams) {
      console.warn('[Payment Success] 필수 파라미터 누락 - 저장 생략');
    } else if (!user) {
      console.warn('[Payment Success] 로그인된 사용자 없음 - 저장 생략');
    } else {
      const productType = orderId!.includes('expedition_plus')
        ? '탐험권+추가질문'
        : '탐험권';
      console.log('[Payment Success] purchases insert 호출:', {
        userId: user.id,
        productType,
        amount: Number(amount),
        paymentKey,
        orderId,
      });
      savePurchase(
        String(user.id),
        productType,
        Number(amount),
        paymentKey!,
        orderId!,
      )
        .then((result) => {
          if (result) {
            console.log('[Payment Success] purchases insert 성공:', result);
          } else {
            console.error('[Payment Success] purchases insert 실패: null 반환 (오류 발생)');
          }
        })
        .catch((err) => console.error('[Payment Success] savePurchase 예외:', err));
      markLatestResultPaid(String(user.id))
        .then((ok) => console.log('[Payment Success] markLatestResultPaid 결과:', ok))
        .catch((err) => console.error('[Payment Success] markLatestResultPaid 예외:', err));
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
