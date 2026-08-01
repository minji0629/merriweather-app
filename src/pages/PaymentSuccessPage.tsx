import { useEffect, useState } from 'react';
import { useApp } from '@/store/useApp';
import { useAuth } from '@/store/useAuth';
import { supabase, savePurchase, markResultPaid, upsertQuestions } from '@/lib/supabase';
import {
  loadUserId,
  savePendingPurchase,
  loadPendingPurchase,
  clearPendingPurchase,
  loadResultId,
  clearResultId,
  PendingPurchase,
} from '@/lib/authStorage';
import { PageContainer } from '@/components/PageContainer';
import { Check, Sparkles } from '@/components/Icons';

export function PaymentSuccessPage() {
  const { setCurrentPage, residentKey, setSelectedResultId } = useApp();
  const { login } = useAuth();
  const [status, setStatus] = useState<'processing' | 'done' | 'needLogin'>('processing');

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentKey = params.get('paymentKey');
      const orderId = params.get('orderId');
      const amount = params.get('amount');

      console.log('[Payment Success] 파라미터:', { paymentKey, orderId, amount });

      const hasValidParams = paymentKey && orderId && amount;
      if (!hasValidParams) {
        console.warn('[Payment Success] 필수 파라미터 누락');
        setStatus('done');
        return;
      }

      const productType = orderId!.includes('expedition_plus')
        ? '탐험권+추가질문'
        : orderId!.includes('extra_questions')
          ? '추가질문'
          : '탐험권';

      // 1. supabase.auth.getSession() 으로 세션 직접 확인
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('[Payment Success] getSession:', {
        hasSession: !!sessionData.session,
        sessionError: sessionError?.message,
      });

      let userId: string | null = null;

      if (sessionData.session) {
        userId = sessionData.session.user.id;
        console.log('[Payment Success] 세션에서 사용자 ID 확인:', userId);
      } else {
        // 2. localStorage에서 저장된 사용자 ID 확인
        userId = loadUserId();
        console.log('[Payment Success] localStorage 사용자 ID:', userId);
      }

      // 3. 사용자 ID가 없으면 결제 정보를 localStorage에 임시 저장 후 로그인 페이지로
      if (!userId) {
        console.warn('[Payment Success] 사용자 ID 없음 - 임시 저장 후 로그인 필요');
        const pending: PendingPurchase = {
          paymentKey: paymentKey!,
          orderId: orderId!,
          amount: Number(amount),
          productType,
        };
        savePendingPurchase(pending);
        console.log('[Payment Success] 임시 저장 완료:', pending);
        setStatus('needLogin');
        return;
      }

      // 4. purchases 테이블에 저장
      console.log('[Payment Success] purchases insert 호출:', {
        userId,
        productType,
        amount: Number(amount),
        paymentKey,
        orderId,
      });
      try {
        const result = await savePurchase(
          userId,
          productType,
          Number(amount),
          paymentKey!,
          orderId!,
        );
        if (result) {
          console.log('[Results] PaymentSuccess - purchases insert 성공:', result.id);
        } else {
          console.error('[Results] PaymentSuccess - purchases insert 실패: null 반환');
        }
      } catch (err) {
        console.error('[Results] PaymentSuccess - savePurchase 예외:', err);
      }

      // localStorage에서 결제 전 저장한 result_id를 정확히 사용
      const savedResultId = loadResultId();
      console.log('[Payment] 결제 전 저장된 result_id:', savedResultId);

      let targetResultId: string | null = savedResultId;

      if (targetResultId) {
        try {
          console.log('[Payment] markResultPaid 호출, result_id:', targetResultId);
          const ok = await markResultPaid(targetResultId);
          console.log('[Payment] markResultPaid 결과:', ok);
        } catch (err) {
          console.error('[Payment] markResultPaid 예외:', err);
        }
      } else {
        console.error('[Payment] 저장된 result_id 없음 - 결제 전 saveFreeResult가 선행되지 않았을 수 있습니다.');
      }

      // 표시할 주민 키 확인
      const { data: resultRow } = await supabase
        .from('results')
        .select('id, resident_key')
        .eq('id', targetResultId ?? '')
        .maybeSingle();
      console.log('[Payment] 결제 후 불러온 result_id:', resultRow?.id ?? null);
      console.log('[Payment] 표시된 주민 키:', resultRow?.resident_key ?? null);

      // questions 테이블 생성/업데이트
      if (targetResultId) {
        try {
          const qRow = await upsertQuestions(userId, targetResultId, productType);
          console.log('[Payment] upsertQuestions 결과:', qRow);
        } catch (err) {
          console.error('[Payment] upsertQuestions 예외:', err);
        }
      }

      // 유료 결과 페이지에서 정확한 result_id를 사용하도록 설정
      if (targetResultId) {
        setSelectedResultId(targetResultId);
        console.log('[Payment] selectedResultId 설정:', targetResultId);
      }

      setStatus('done');
    })();
  }, [setCurrentPage]);

  // 처리 완료 후 페이지 이동
  useEffect(() => {
    if (status !== 'done') return;
    const timer = setTimeout(() => {
      if (residentKey) {
        setCurrentPage('premium');
      } else {
        window.location.href = '/';
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [status, setCurrentPage, residentKey]);

  // 로그인 필요 상태 - 로그인 모달 호출
  useEffect(() => {
    if (status !== 'needLogin') return;
    console.log('[Payment Success] 로그인 페이지로 이동');
    login('authCallback');
  }, [status, login]);

  return (
    <PageContainer className="bg-base" footer={false}>
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 px-6 text-center">
        {status === 'needLogin' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-point/15 flex items-center justify-center mb-6 animate-scaleIn">
              <Sparkles className="w-10 h-10 text-point" />
            </div>
            <h1 className="font-batang text-2xl text-text mb-3 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
              결제가 완료됐어요!
            </h1>
            <p className="font-sans text-sm text-text-sub mb-8 animate-fadeUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
              결제를 저장하려면 로그인이 필요해요. 로그인 창으로 이동합니다.
            </p>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </PageContainer>
  );
}
