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
    authorize: (params: {
      redirectUri: string;
      throughTalk?: boolean;
      scope?: string;
      state?: string;
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

export interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

const USER_KEY = 'merriweather_user';
const TOKEN_KEY = 'merriweather_kakao_token';
const MARKETING_KEY = 'merriweather_marketing_consented';
const RETURN_PAGE_KEY = 'merriweather_return_page';

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
  localStorage.removeItem(TOKEN_KEY);
}

export function hasMarketingConsent(): boolean {
  return localStorage.getItem(MARKETING_KEY) === 'true';
}

export function setMarketingConsented(value: boolean) {
  localStorage.setItem(MARKETING_KEY, value ? 'true' : 'false');
}

export function saveReturnPage(page: string) {
  localStorage.setItem(RETURN_PAGE_KEY, page);
}

export function loadReturnPage(): string | null {
  return localStorage.getItem(RETURN_PAGE_KEY);
}

export function clearReturnPage() {
  localStorage.removeItem(RETURN_PAGE_KEY);
}

let initPromise: Promise<void> | null = null;

export function initKakao(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (!key) {
      console.warn('[Kakao] VITE_KAKAO_JAVASCRIPT_KEY 환경변수가 없습니다.');
      reject(new Error('VITE_KAKAO_JAVASCRIPT_KEY is not set'));
      return;
    }
    const tryInit = (attempts: number) => {
      const sdk = window.Kakao;
      if (sdk) {
        if (!sdk.isInitialized()) sdk.init(key);
        console.log('[Kakao] SDK initialized');
        resolve();
      } else if (attempts > 0) {
        setTimeout(() => tryInit(attempts - 1), 100);
      } else {
        reject(new Error('Kakao SDK failed to load'));
      }
    };
    tryInit(30);
  });
  return initPromise;
}

export async function ensureKakaoReady(): Promise<KakaoSDK> {
  await initKakao();
  const sdk = window.Kakao;
  if (!sdk) throw new Error('Kakao SDK not loaded');
  return sdk;
}

function getRedirectUri(): string {
  return window.location.origin + '/auth/callback';
}

export async function authorizeKakao(returnPage?: string): Promise<void> {
  if (returnPage) saveReturnPage(returnPage);
  const sdk = await ensureKakaoReady();
  const redirectUri = getRedirectUri();
  console.log('[Kakao] Redirect URI:', redirectUri);
  console.log('[Kakao] window.location.origin:', window.location.origin);
  console.log('[Kakao] window.location.href:', window.location.href);
  console.log('Redirect URI:', redirectUri);
  sdk.Auth.authorize({
    redirectUri,
  });
}

export async function handleAuthCallback(): Promise<KakaoUser> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');

  console.log('[Kakao] Callback URL:', window.location.href);
  console.log('[Kakao] Redirect URI (for token exchange):', getRedirectUri());

  if (error) {
    throw new Error(`카카오 로그인 실패: ${error}`);
  }
  if (!code) {
    throw new Error('인증 코드가 없습니다.');
  }

  const clientId = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
  const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const tokenClientId = restApiKey || clientId;

  console.log('[Kakao] Exchanging code for token...', {
    hasRestApiKey: !!restApiKey,
    hasJsKey: !!clientId,
    usingKey: restApiKey ? 'REST_API_KEY' : 'JS_KEY',
  });

  const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: tokenClientId,
      redirect_uri: getRedirectUri(),
      code,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error('[Kakao] Token exchange failed:', tokenRes.status, errText);
    throw new Error(`토큰 발급 실패 (${tokenRes.status})`);
  }

  const tokenData: KakaoTokenResponse = await tokenRes.json();
  localStorage.setItem(TOKEN_KEY, tokenData.access_token);
  console.log('[Kakao] Token acquired, fetching user info...');

  const meRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!meRes.ok) {
    throw new Error('사용자 정보 조회 실패');
  }

  const me: KakaoUserMe = await meRes.json();
  const user: KakaoUser = {
    id: me.id,
    nickname: me.kakao_account?.profile?.nickname ?? '사용자',
  };
  saveUser(user);
  console.log('[Kakao] User info saved:', user.nickname);
  return user;
}

export async function logoutKakao(): Promise<void> {
  try {
    const sdk = window.Kakao;
    if (sdk?.isInitialized()) {
      await new Promise<void>((resolve) => {
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
    } else {
      clearUser();
    }
  } catch {
    clearUser();
  }
}

export {};
