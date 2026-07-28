import { ReactNode, useState, useCallback, useMemo } from 'react';
import { AuthContext, AuthState, AuthUser, MarketingConsent } from '@/store/authContext';
import { supabase } from '@/lib/supabase';
import {
  hasMarketingConsent,
  setMarketingConsented,
  loadMarketingDetail,
  saveMarketingDetail,
  saveReturnPage,
} from '@/lib/authStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMarketingOpen, setMarketingOpen] = useState(false);
  const [marketingConsent, setMarketingConsentState] = useState<MarketingConsent>(loadMarketingDetail);

  const setUser = useCallback((u: AuthUser) => {
    setUserState(u);
    if (!hasMarketingConsent()) {
      setMarketingOpen(true);
    }
  }, []);

  const login = useCallback(async (returnPage?: string) => {
    const pageToSave = returnPage || 'landing';
    console.log('[Auth] login - 저장할 returnPage:', pageToSave);
    saveReturnPage(pageToSave);
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: {
          scope: 'profile_nickname',
        },
      },
    });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUserState(null);
  }, []);

  const showLogin = useCallback(() => setLoginOpen(true), []);
  const hideLogin = useCallback(() => setLoginOpen(false), []);
  const showMarketing = useCallback(() => setMarketingOpen(true), []);
  const hideMarketing = useCallback(() => setMarketingOpen(false), []);

  const saveMarketingConsent = useCallback((consent: MarketingConsent) => {
    setMarketingConsentState(consent);
    saveMarketingDetail(consent);
    setMarketingConsented(true);
  }, []);

  const value: AuthState = useMemo(
    () => ({
      user,
      setUser,
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
    [user, setUser, login, logout, showLogin, hideLogin, isLoginOpen, showMarketing, hideMarketing, isMarketingOpen, saveMarketingConsent, marketingConsent],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
