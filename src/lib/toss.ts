import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';

export type ProductId = 'expedition' | 'expedition_plus' | 'extra_questions' | 'gift_basic' | 'gift_plus';

export interface Product {
  id: ProductId;
  name: string;
  amount: number;
  orderName: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  expedition: { id: 'expedition', name: '탐험권', amount: 4990, orderName: '메리웨더 탐험권' },
  expedition_plus: { id: 'expedition_plus', name: '탐험권 + 추가 질문 3회', amount: 6980, orderName: '메리웨더 탐험권 + 추가 질문 3회' },
  extra_questions: { id: 'extra_questions', name: '추가 질문 3회', amount: 1990, orderName: '메리웨더 추가 질문 3회' },
  gift_basic: { id: 'gift_basic', name: '선물하기 - 탐험권', amount: 4990, orderName: '메리웨더 선물 - 탐험권' },
  gift_plus: { id: 'gift_plus', name: '선물하기 - 탐험권 + 추가 질문', amount: 6980, orderName: '메리웨더 선물 - 탐험권 + 추가 질문 3회' },
};

type TossPaymentsSDK = Awaited<ReturnType<typeof loadTossPayments>>;
let tossPaymentsInstance: TossPaymentsSDK | null = null;

async function getTossPayments(): Promise<TossPaymentsSDK> {
  if (!tossPaymentsInstance) {
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    if (!clientKey) throw new Error('VITE_TOSS_CLIENT_KEY가 설정되지 않았습니다.');
    tossPaymentsInstance = await loadTossPayments(clientKey);
  }
  return tossPaymentsInstance;
}

export async function requestPayment(productId: ProductId) {
  const product = PRODUCTS[productId];
  const tossPayments = await getTossPayments();
  const payment = tossPayments.payment({ customerKey: ANONYMOUS });
  const orderId = `merriweather-${productId}-${Date.now()}`;
  const origin = window.location.origin;

  await payment.requestPayment({
    method: 'CARD',
    amount: { currency: 'KRW', value: product.amount },
    orderId,
    orderName: product.orderName,
    successUrl: `${origin}/payment/success`,
    failUrl: `${origin}/payment/fail`,
  });
}
