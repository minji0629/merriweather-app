const MARKETING_KEY = 'merriweather_marketing_consented';
const MARKETING_DETAIL_KEY = 'merriweather_marketing_detail';
const RETURN_PAGE_KEY = 'merriweather_return_page';
const USER_ID_KEY = 'merriweather_user_id';
const PENDING_PURCHASE_KEY = 'merriweather_pending_purchase';

export interface PendingPurchase {
  paymentKey: string;
  orderId: string;
  amount: number;
  productType: string;
}

export function hasMarketingConsent(): boolean {
  return localStorage.getItem(MARKETING_KEY) === 'true';
}

export function setMarketingConsented(value: boolean) {
  localStorage.setItem(MARKETING_KEY, value ? 'true' : 'false');
}

export function loadMarketingDetail(): { kakao: boolean; email: boolean } {
  try {
    const raw = localStorage.getItem(MARKETING_DETAIL_KEY);
    if (raw) return JSON.parse(raw) as { kakao: boolean; email: boolean };
  } catch {
    // ignore
  }
  return { kakao: false, email: false };
}

export function saveMarketingDetail(consent: { kakao: boolean; email: boolean }) {
  localStorage.setItem(MARKETING_DETAIL_KEY, JSON.stringify(consent));
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

export function saveUserId(userId: string) {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function loadUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function clearUserId() {
  localStorage.removeItem(USER_ID_KEY);
}

export function savePendingPurchase(purchase: PendingPurchase) {
  localStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(purchase));
}

export function loadPendingPurchase(): PendingPurchase | null {
  try {
    const raw = localStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPurchase;
  } catch {
    return null;
  }
}

export function clearPendingPurchase() {
  localStorage.removeItem(PENDING_PURCHASE_KEY);
}
