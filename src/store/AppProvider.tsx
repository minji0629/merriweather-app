import { ReactNode, useState, useCallback, useMemo } from 'react';
import { AppContext, AppState, Page, Answer } from '@/store/appContext';
import { ResidentKey } from '@/constants/questions';

function detectInitialPage(): Page {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname;
  if (path === '/payment/success') return 'paymentSuccess';
  if (path === '/payment/fail') return 'paymentFail';
  return 'landing';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [nickname, setNickname] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>(detectInitialPage());
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [residentKey, setResidentKey] = useState<ResidentKey | null>(null);

  const addAnswer = useCallback((answer: Answer) => {
    setAnswers((prev) => [...prev, answer]);
  }, []);

  const resetAnswers = useCallback(() => setAnswers([]), []);

  const previewMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'true';
  }, []);

  const restart = useCallback(() => {
    setNickname('');
    setAnswers([]);
    setResidentKey(null);
    setCurrentPage('nickname');
  }, []);

  const value: AppState = {
    nickname,
    setNickname,
    currentPage,
    setCurrentPage,
    answers,
    addAnswer,
    resetAnswers,
    residentKey,
    setResidentKey,
    previewMode,
    restart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
