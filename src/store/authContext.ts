import { createContext } from 'react';
import { KakaoUser } from '@/lib/kakao';

export interface MarketingConsent {
  kakao: boolean;
  email: boolean;
}

export interface AuthState {
  user: KakaoUser | null;
  setUser: (user: KakaoUser) => void;
  login: (returnPage?: string) => Promise<void>;
  logout: () => Promise<void>;
  showLogin: () => void;
  hideLogin: () => void;
  isLoginOpen: boolean;
  showMarketing: () => void;
  hideMarketing: () => void;
  isMarketingOpen: boolean;
  saveMarketingConsent: (consent: MarketingConsent) => void;
  marketingConsent: MarketingConsent;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);
