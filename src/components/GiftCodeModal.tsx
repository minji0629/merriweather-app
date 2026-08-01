import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/useAuth';
import { useApp } from '@/store/useApp';
import { savePurchase, markLatestResultPaid } from '@/lib/supabase';
import { X, Gift } from '@/components/Icons';

type Status = 'idle' | 'checking' | 'error' | 'success';

export function GiftCodeModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { setCurrentPage } = useApp();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(trimmed)) {
      setStatus('error');
      setMessage('6자리 영문/숫자 코드를 입력해주세요.');
      return;
    }
    setStatus('checking');
    setMessage('');

    const { data, error } = await supabase
      .from('gift_codes')
      .select('*')
      .eq('code', trimmed)
      .maybeSingle();

    if (error || !data) {
      setStatus('error');
      setMessage('유효하지 않은 코드예요.');
      return;
    }

    if (data.is_code_used) {
      setStatus('error');
      setMessage('이미 사용된 코드예요.');
      return;
    }

    if (new Date(data.expires_at) < new Date()) {
      setStatus('error');
      setMessage('유효기간이 지난 코드예요.');
      return;
    }

    const { error: updateError } = await supabase
      .from('gift_codes')
      .update({ is_code_used: true })
      .eq('id', data.id);

    if (updateError) {
      setStatus('error');
      setMessage('처리 중 오류가 발생했어요. 다시 시도해주세요.');
      return;
    }

    if (user) {
      await savePurchase(
        user.id,
        data.product_type,
        0,
        `gift_${data.id}`,
        `gift_${data.code}`,
      );
      await markLatestResultPaid(user.id);
    }

    setStatus('success');
    setMessage('선물 코드가 인증되었어요!');
    setTimeout(() => {
      onClose();
      setCurrentPage('premium');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-base rounded-3xl shadow-2xl border border-[#E0DDD8] animate-scaleIn p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-sub hover:text-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-point/15 flex items-center justify-center">
            <Gift className="w-6 h-6 text-point-dark" />
          </div>
          <h2 className="font-batang text-xl text-text mb-1">선물 코드 입력하기</h2>
          <p className="font-sans text-xs text-text-sub">받으신 6자리 코드를 입력해주세요.</p>
        </div>

        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
            setStatus('idle');
            setMessage('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
          placeholder="ABC123"
          maxLength={6}
          className="w-full px-5 py-4 bg-white/80 rounded-2xl font-sans text-lg text-center tracking-[0.3em] text-text
                     placeholder:text-text-sub/40 border border-[#E0DDD8] shadow-sm
                     focus:border-point focus:shadow-md transition-all duration-300"
        />

        {message && (
          <p
            className={`mt-3 font-sans text-sm text-center ${
              status === 'success' ? 'text-point-dark' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-5 space-y-2">
          <button
            onClick={handleRedeem}
            disabled={status === 'checking' || code.length !== 6}
            className="w-full py-4 bg-point text-white rounded-2xl font-sans font-medium text-base
                       shadow-lg transition-all duration-300 hover:bg-point-dark hover:shadow-xl active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'checking' ? '확인 중...' : '확인'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 font-sans text-sm text-text-sub hover:text-text transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
