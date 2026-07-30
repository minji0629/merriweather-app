import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] 환경변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserRow {
  id: string;
  nickname: string;
  email: string | null;
  marketing_kakao: boolean;
  marketing_email: boolean;
  created_at: string;
}

export interface ResultRow {
  id: string;
  user_id: string;
  resident_key: string;
  answers: Record<string, unknown>;
  is_paid: boolean;
  created_at: string;
}

export interface PurchaseRow {
  id: string;
  user_id: string;
  product_type: string;
  amount: number;
  payment_key: string;
  order_id: string;
  created_at: string;
}

export interface GiftCodeRow {
  id: string;
  code: string;
  link_token: string;
  buyer_id: string;
  receiver_name: string;
  message: string;
  product_type: string;
  is_link_used: boolean;
  is_code_used: boolean;
  expires_at: string;
  created_at: string;
}

export interface QuestionRow {
  id: string;
  user_id: string;
  result_id: string;
  remaining_count: number;
  created_at: string;
}

export async function upsertUser(
  userId: string,
  nickname: string,
  marketing: { kakao: boolean; email: boolean },
  email?: string,
): Promise<UserRow | null> {
  const id = String(userId);
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id,
        nickname,
        email: email ?? null,
        marketing_kakao: marketing.kakao,
        marketing_email: marketing.email,
      },
      { onConflict: 'id' },
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('[Supabase] upsertUser error:', error.message);
    return null;
  }
  return data as UserRow | null;
}

export async function saveFreeResult(
  userId: string,
  residentKey: string,
  answers: Record<string, unknown>,
): Promise<ResultRow | null> {
  const { data, error } = await supabase
    .from('results')
    .insert({
      user_id: userId,
      resident_key: residentKey,
      answers,
      is_paid: false,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('[Supabase] saveFreeResult error:', error.message);
    return null;
  }
  return data as ResultRow | null;
}

export async function savePurchase(
  userId: string,
  productType: string,
  amount: number,
  paymentKey: string,
  orderId: string,
): Promise<PurchaseRow | null> {
  const { data, error } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      product_type: productType,
      amount,
      payment_key: paymentKey,
      order_id: orderId,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('[Supabase] savePurchase error:', error.message);
    return null;
  }
  return data as PurchaseRow | null;
}

export async function markResultPaid(resultId: string): Promise<boolean> {
  const { error } = await supabase
    .from('results')
    .update({ is_paid: true })
    .eq('id', resultId);

  if (error) {
    console.error('[Supabase] markResultPaid error:', error.message);
    return false;
  }
  return true;
}

export async function markLatestResultPaid(userId: string): Promise<boolean> {
  const { data: latest, error: selectError } = await supabase
    .from('results')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selectError || !latest) {
    console.error('[Supabase] markLatestResultPaid lookup failed:', selectError?.message);
    return false;
  }

  return markResultPaid(latest.id);
}

export async function fetchUserResults(userId: string): Promise<ResultRow[]> {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] fetchUserResults error:', error.message);
    return [];
  }
  return (data as ResultRow[]) ?? [];
}

/**
 * 상품별 초기 질문 횟수
 * expedition: 1, expedition_plus: 3, extra_questions: +3 추가
 */
const INITIAL_COUNTS: Record<string, number> = {
  '탐험권': 1,
  '탐험권+추가질문': 3,
};

/**
 * 결제 완료 시 questions 행 생성 또는 횟수 추가.
 * extra_questions는 기존 행의 remaining_count에 3을 더함.
 */
export async function upsertQuestions(
  userId: string,
  resultId: string,
  productType: string,
): Promise<QuestionRow | null> {
  if (productType === '추가질문') {
    // 기존 행 찾아서 +3
    const { data: existing } = await supabase
      .from('questions')
      .select('id, remaining_count')
      .eq('user_id', userId)
      .eq('result_id', resultId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('questions')
        .update({ remaining_count: existing.remaining_count + 3 })
        .eq('id', existing.id)
        .select()
        .maybeSingle();
      if (error) {
        console.error('[Supabase] upsertQuestions(extra) error:', error.message);
        return null;
      }
      return data as QuestionRow | null;
    }
    // 행이 없으면 3으로 새로 생성
    const { data, error } = await supabase
      .from('questions')
      .insert({ user_id: userId, result_id: resultId, remaining_count: 3 })
      .select()
      .maybeSingle();
    if (error) {
      console.error('[Supabase] upsertQuestions(extra-new) error:', error.message);
      return null;
    }
    return data as QuestionRow | null;
  }

  const count = INITIAL_COUNTS[productType] ?? 1;
  const { data, error } = await supabase
    .from('questions')
    .insert({ user_id: userId, result_id: resultId, remaining_count: count })
    .select()
    .maybeSingle();
  if (error) {
    console.error('[Supabase] upsertQuestions error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

/** 사용자의 결과에 대한 질문 행 조회 */
export async function fetchQuestions(
  userId: string,
  resultId: string,
): Promise<QuestionRow | null> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('user_id', userId)
    .eq('result_id', resultId)
    .maybeSingle();
  if (error) {
    console.error('[Supabase] fetchQuestions error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

/** result_id 매칭 실패 시 user_id만으로 가장 최근 questions 행 조회 */
export async function fetchLatestQuestionsByUser(
  userId: string,
): Promise<QuestionRow | null> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('[Supabase] fetchLatestQuestionsByUser error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

/** questions 행이 없을 때 탐험권 구매자용 기본 1회 자동 생성 */
export async function createDefaultQuestions(
  userId: string,
  resultId: string,
  count = 1,
): Promise<QuestionRow | null> {
  const { data, error } = await supabase
    .from('questions')
    .insert({ user_id: userId, result_id: resultId, remaining_count: count })
    .select()
    .maybeSingle();
  if (error) {
    console.error('[Supabase] createDefaultQuestions error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

/** 질문 1회 사용: remaining_count - 1. 이미 0이면 false 반환 */
export async function decrementQuestion(rowId: string, current: number): Promise<boolean> {
  if (current <= 0) return false;
  const { error } = await supabase
    .from('questions')
    .update({ remaining_count: current - 1 })
    .eq('id', rowId);
  if (error) {
    console.error('[Supabase] decrementQuestion error:', error.message);
    return false;
  }
  return true;
}

export async function deleteResult(resultId: string, userId: string): Promise<boolean> {
  console.log('[Delete Result] 1. 삭제할 result id:', resultId, '/ user_id:', userId);
  console.log('[Delete Result] 2. Supabase delete 호출...');
  const { data, error } = await supabase
    .from('results')
    .delete()
    .eq('id', resultId)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('[Delete Result] 3. 삭제 실패:', error.message, '(code:', error.code + ')');
    return false;
  }
  console.log('[Delete Result] 3. 삭제 완료. 삭제된 행 수:', data?.length ?? 0);
  return true;
}
