// Minimal Kakao SDK type declarations and helpers

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export interface KakaoSDK {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (params: {
      success: (authObj: KakaoAuthObj) => void;
      fail?: (err: unknown) => void;
    }) => void;
    logout: (params: {
      success?: () => void;
      fail?: (err: unknown) => void;
    }) => void;
  };
  API: {
    request: (params: {
      url: string;
      success: (res: KakaoUserMe) => void;
      fail?: (err: unknown) => void;
    }) => void;
  };
}

export interface KakaoAuthObj {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface KakaoUserMe {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
    };
  };
}

export interface KakaoUser {
  id: number;
  nickname: string;
}

const USER_KEY = 'merriweather_user';
const MARKETING_KEY = 'merriweather_marketing_consented';

export function loadUser(): KakaoUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as KakaoUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: KakaoUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function hasMarketingConsent(): boolean {
  return localStorage.getItem(MARKETING_KEY) === 'true';
}

export function setMarketingConsented(value: boolean) {
  localStorage.setItem(MARKETING_KEY, value ? 'true' : 'false');
}

let initPromise: Promise<void> | null = null;

export function initKakao(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (!key) {
      reject(new Error('VITE_KAKAO_JAVASCRIPT_KEY is not set'));
      return;
    }
    const tryInit = (attempts: number) => {
      const sdk = window.Kakao;
      if (sdk) {
        if (!sdk.isInitialized()) sdk.init(key);
        resolve();
      } else if (attempts > 0) {
        setTimeout(() => tryInit(attempts - 1), 100);
      } else {
        reject(new Error('Kakao SDK failed to load'));
      }
    };
    tryInit(20);
  });
  return initPromise;
}

export function loginWithKakao(): Promise<KakaoUser> {
  return new Promise((resolve, reject) => {
    const sdk = window.Kakao;
    if (!sdk) {
      reject(new Error('Kakao SDK not loaded'));
      return;
    }
    sdk.Auth.login({
      success: (authObj) => {
        sdk.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const user: KakaoUser = {
              id: res.id,
              nickname: res.kakao_account?.profile?.nickname ?? '사용자',
            };
            saveUser(user);
            resolve(user);
          },
          fail: (err) => reject(err),
        });
      },
      fail: (err) => reject(err),
    });
  });
}

export function logoutKakao(): Promise<void> {
  return new Promise((resolve) => {
    const sdk = window.Kakao;
    if (!sdk) {
      clearUser();
      resolve();
      return;
    }
    sdk.Auth.logout({
      success: () => {
        clearUser();
        resolve();
      },
      fail: () => {
        clearUser();
        resolve();
      },
    });
  });
}

export {};
