import { ReactNode, useState, useCallback, useMemo, useEffect } from 'react';
import { AuthContext, AuthState, MarketingConsent } from '@/store/authContext';
import {
  KakaoUser,
  loadUser,
  loginWithKakao,
  logoutKakao,
  hasMarketingConsent,
  setMarketingConsented,
  initKakao,
} from '@/lib/kakao';

const MARKETING_DETAIL_KEY = 'merriweather_marketing_detail';

function loadMarketingDetail(): MarketingConsent {
  try {
    const raw = localStorage.getItem(MARKETING_DETAIL_KEY);
    if (raw) return JSON.parse(raw) as MarketingConsent;
  } catch {
    // ignore
  }
  return { kakao: false, email: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<KakaoUser | null>(() => loadUser());
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMarketingOpen, setMarketingOpen] = useState(false);
  const [marketingConsent, setMarketingConsentState] = useState<MarketingConsent>(loadMarketingDetail);

  useEffect(() => {
    initKakao().catch((err) => console.warn('Kakao init failed:', err));
  }, []);

  const login = useCallback(async () => {
    const u = await loginWithKakao();
    setUser(u);
    if (!hasMarketingConsent()) {
      setMarketingOpen(true);
    }
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutKakao();
    setUser(null);
  }, []);

  const showLogin = useCallback(() => setLoginOpen(true), []);
  const hideLogin = useCallback(() => setLoginOpen(false), []);
  const showMarketing = useCallback(() => setMarketingOpen(true), []);
  const hideMarketing = useCallback(() => setMarketingOpen(false), []);

  const saveMarketingConsent = useCallback((consent: MarketingConsent) => {
    setMarketingConsentState(consent);
    localStorage.setItem(MARKETING_DETAIL_KEY, JSON.stringify(consent));
    setMarketingConsented(true);
  }, []);

  const value: AuthState = useMemo(
    () => ({
      user,
      login,
      logout,
      showLogin,
      hideLogin,
      isLoginOpen,
      showMarketing,
      hideMarketing,
      isMarketingOpen,
      saveMarketingConsent,
      marketingConsent,
    }),
    [user, login, logout, showLogin, hideLogin, isLoginOpen, showMarketing, hideMarketing, isMarketingOpen, saveMarketingConsent, marketingConsent],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
