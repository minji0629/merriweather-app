import { useEffect, useState } from 'react';
import { supabase, upsertUser, saveFreeResult } from '@/lib/supabase';
import { loadReturnPage, clearReturnPage } from '@/lib/authStorage';
import { useApp } from '@/store/useApp';
import { useAuth } from '@/store/useAuth';

export function AuthCallbackPage() {
  const { setCurrentPage, residentKey, answers } = useApp();
  const { setUser, marketingConsent } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        console.log('[Auth Callback] 시작');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('[Auth Callback] getSession:', { sessionError, hasSession: !!sessionData.session });
        if (sessionError || !sessionData.session) {
          throw new Error('세션을 가져오지 못했습니다.');
        }

        const authUser = sessionData.session.user;
        console.log('[Auth Callback] user:', { id: authUser.id, email: authUser.email });
        console.log('[Auth Callback] user_metadata:', authUser.user_metadata);

        const nickname =
          (authUser.user_metadata?.nickname as string) ||
          (authUser.user_metadata?.name as string) ||
          (authUser.user_metadata?.full_name as string) ||
          (authUser.user_metadata?.preferred_username as string) ||
          '사용자';
        const email = authUser.email ?? null;
        console.log('[Auth Callback] 추출값:', { nickname, email });

        const authUserObj = { id: authUser.id, nickname, email };
        setUser(authUserObj);

        console.log('[Auth Callback] upsertUser 호출:', { id: authUser.id, nickname, email, marketingConsent });
        const dbUser = await upsertUser(authUser.id, nickname, marketingConsent, email ?? undefined);
        console.log('[Auth Callback] upsertUser 결과:', dbUser);

        if (dbUser && residentKey) {
          console.log('[Auth Callback] saveFreeResult 호출:', { userId: dbUser.id, residentKey });
          const result = await saveFreeResult(dbUser.id, residentKey, { answers });
          console.log('[Auth Callback] saveFreeResult 결과:', result);
        }

        const returnPage = loadReturnPage();
        clearReturnPage();
        const targetPage = (returnPage as 'landing' | 'nickname' | 'result' | 'payment') || 'landing';
        console.log('[Auth Callback] 이동:', targetPage);
        setCurrentPage(targetPage);
      } catch (err) {
        console.error('[Auth Callback] 실패:', err);
        setError(err instanceof Error ? err.message : '로그인에 실패했어요.');
      }
    })();
  }, [setCurrentPage, setUser, marketingConsent, residentKey, answers]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base px-6">
      {error ? (
        <div className="text-center">
          <p className="font-batang text-xl text-text mb-2">로그인 실패</p>
          <p className="font-sans text-sm text-red-500 mb-6">{error}</p>
          <button
            onClick={() => setCurrentPage('landing')}
            className="px-6 py-3 bg-point text-white rounded-2xl font-sans font-medium text-sm
                       shadow-lg hover:bg-point-dark transition-all active:scale-95"
          >
            홈으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-3 border-point/30 border-t-point rounded-full animate-spin" />
          <p className="font-sans text-sm text-text-sub">로그인 처리 중...</p>
        </div>
      )}
    </div>
  );
}
