import { useEffect, useState } from 'react';
import { handleAuthCallback, loadReturnPage, clearReturnPage } from '@/lib/kakao';
import { upsertUser, saveFreeResult } from '@/lib/supabase';
import { useApp } from '@/store/useApp';
import { useAuth } from '@/store/useAuth';

export function AuthCallbackPage() {
  const { setCurrentPage, residentKey, answers } = useApp();
  const { setUser, marketingConsent } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    handleAuthCallback()
      .then(async (user) => {
        setUser(user);
        const dbUser = await upsertUser(
          user.id,
          user.nickname,
          marketingConsent,
        );
        if (dbUser && residentKey) {
          await saveFreeResult(dbUser.id, residentKey, { answers });
        }
        const returnPage = loadReturnPage();
        clearReturnPage();
        setCurrentPage((returnPage as 'landing' | 'nickname' | 'result' | 'payment') || 'landing');
      })
      .catch((err) => {
        console.error('[Kakao] Auth callback failed:', err);
        setError(err instanceof Error ? err.message : '로그인에 실패했어요.');
      });
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
