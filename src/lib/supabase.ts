import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'public-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('[supabase] 환경변수가 설정되지 않았습니다.');
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
  ai_result: string | null;
  ai_letter: string | null;
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

export interface QuestionHistoryEntry {
  question: string;
  answer: string;
  created_at: string;
}

export interface QuestionRow {
  id: string;
  user_id: string;
  result_id: string;
  remaining_count: number;
  question_history: QuestionHistoryEntry[] | null;
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
    console.error('[supabase] upsertUser error:', error.message);
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
    console.error('[supabase] saveFreeResult error:', error.message);
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
    console.error('[supabase] savePurchase error:', error.message);
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
    console.error('[supabase] markResultPaid error:', error.message);
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
    console.error('[supabase] markLatestResultPaid lookup failed:', selectError?.message);
    return false;
  }

  return markResultPaid(latest.id);
}

export async function fetchUserResults(userId: string): Promise<ResultRow[]> {
  const { data, error } = await supabase
    .from('results')
    .select('id, user_id, resident_key, is_paid, ai_result, ai_letter, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabase] fetchUserResults error:', error.message);
    return [];
  }
  return (data as ResultRow[]) ?? [];
}

export async function fetchResultById(resultId: string): Promise<ResultRow | null> {
  const { data, error } = await supabase
    .from('results')
    .select('id, user_id, resident_key, is_paid, ai_result, ai_letter, created_at')
    .eq('id', resultId)
    .maybeSingle();

  if (error) {
    console.error('[supabase] fetchResultById error:', error.message);
    return null;
  }
  return data as ResultRow | null;
}

export async function saveAiText(
  resultId: string,
  field: 'ai_result' | 'ai_letter',
  text: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('results')
    .update({ [field]: text })
    .eq('id', resultId);
  if (error) {
    console.error(`[supabase] saveAiText (${field}) error:`, error.message);
    return false;
  }
  return true;
}

export async function appendQuestionHistory(
  questionId: string,
  entry: QuestionHistoryEntry,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('questions')
    .select('question_history')
    .eq('id', questionId)
    .maybeSingle();
  if (error) {
    console.error('[supabase] appendQuestionHistory fetch error:', error.message);
    return false;
  }
  const existing = (data?.question_history as QuestionHistoryEntry[] | null) ?? [];
  const updated = [...existing, entry];
  const { error: updateError } = await supabase
    .from('questions')
    .update({ question_history: updated })
    .eq('id', questionId);
  if (updateError) {
    console.error('[supabase] appendQuestionHistory update error:', updateError.message);
    return false;
  }
  return true;
}

const INITIAL_COUNTS: Record<string, number> = {
  '탐험권': 1,
  '탐험권+추가질문': 3,
};

export async function upsertQuestions(
  userId: string,
  resultId: string,
  productType: string,
): Promise<QuestionRow | null> {
  if (productType === '추가질문') {
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
        console.error('[supabase] upsertQuestions(extra) error:', error.message);
        return null;
      }
      return data as QuestionRow | null;
    }
    const { data, error } = await supabase
      .from('questions')
      .insert({ user_id: userId, result_id: resultId, remaining_count: 3 })
      .select()
      .maybeSingle();
    if (error) {
      console.error('[supabase] upsertQuestions(extra-new) error:', error.message);
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
    console.error('[supabase] upsertQuestions error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

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
    console.error('[supabase] fetchQuestions error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

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
    console.error('[supabase] fetchLatestQuestionsByUser error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

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
    console.error('[supabase] createDefaultQuestions error:', error.message);
    return null;
  }
  return data as QuestionRow | null;
}

export async function decrementQuestion(rowId: string, current: number): Promise<boolean> {
  if (current <= 0) return false;
  const { error } = await supabase
    .from('questions')
    .update({ remaining_count: current - 1 })
    .eq('id', rowId);
  if (error) {
    console.error('[supabase] decrementQuestion error:', error.message);
    return false;
  }
  return true;
}

export async function deleteResult(resultId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('results')
    .delete()
    .eq('id', resultId)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('[Delete Result] 삭제 실패:', error.message);
    return false;
  }
  return true;
}
