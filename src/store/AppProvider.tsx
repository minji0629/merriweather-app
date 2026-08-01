import { ReactNode, useState, useCallback, useMemo, useEffect } from 'react';
import { AppContext, AppState, Page, Answer } from '@/store/appContext';
import { ResidentKey } from '@/constants/questions';

const STORAGE_KEY = 'merriweather:app-state';

interface PersistedState {
  nickname: string;
  residentKey: ResidentKey | null;
  secondResidentKey: ResidentKey | null;
  answers: Answer[];
}

function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') return { nickname: '', residentKey: null, secondResidentKey: null, answers: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nickname: '', residentKey: null, secondResidentKey: null, answers: [] };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      nickname: parsed.nickname ?? '',
      residentKey: parsed.residentKey ?? null,
      secondResidentKey: parsed.secondResidentKey ?? null,
      answers: parsed.answers ?? [],
    };
  } catch {
    return { nickname: '', residentKey: null, secondResidentKey: null, answers: [] };
  }
}

function detectInitialPage(): Page {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname;
  if (path === '/payment/success') return 'paymentSuccess';
  if (path === '/payment/fail') return 'paymentFail';
  if (path === '/auth/callback') return 'authCallback';
  return 'landing';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = useMemo(loadPersistedState, []);

  const [nickname, setNickname] = useState(persisted.nickname);
  const [currentPage, setCurrentPageState] = useState<Page>(detectInitialPage());
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  const [answers, setAnswers] = useState<Answer[]>(persisted.answers);
  const [residentKey, setResidentKey] = useState<ResidentKey | null>(persisted.residentKey);
  const [secondResidentKey, setSecondResidentKey] = useState<ResidentKey | null>(persisted.secondResidentKey);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [selectedResidentKey, setSelectedResidentKey] = useState<ResidentKey | null>(null);

  const setCurrentPage = useCallback((page: Page) => {
    setCurrentPageState((prev) => {
      setPreviousPage(prev);
      return page;
    });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ nickname, residentKey, secondResidentKey, answers }),
      );
    } catch {
      // ignore quota / serialization errors
    }
  }, [nickname, residentKey, secondResidentKey, answers]);

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
    setSecondResidentKey(null);
    setCurrentPage('nickname');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value: AppState = {
    nickname,
    setNickname,
    currentPage,
    previousPage,
    setCurrentPage,
    answers,
    addAnswer,
    resetAnswers,
    residentKey,
    setResidentKey,
    secondResidentKey,
    setSecondResidentKey,
    selectedResultId,
    setSelectedResultId,
    selectedResidentKey,
    setSelectedResidentKey,
    previewMode,
    restart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
