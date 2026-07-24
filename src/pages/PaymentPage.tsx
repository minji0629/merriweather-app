import { useState } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { RESIDENT_CARD } from '@/constants/images';
import { Check, Clock, Sparkles } from '@/components/Icons';
import { TermsAgreement } from '@/components/TermsAgreement';
import { requestPayment, ProductId } from '@/lib/toss';

export function PaymentPage() {
  const { nickname, setCurrentPage } = useApp();
  const [selected, setSelected] = useState<ProductId>('expedition_plus');
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    if (!agreed) return;
    setPaying(true);
    setError('');
    try {
      await requestPayment(selected);
    } catch (e) {
      setError(e instanceof Error ? e.message : '결제 중 오류가 발생했어요.');
      setPaying(false);
    }
  };

  return (
    <PageContainer className="bg-base">
      <div className="overflow-y-auto scrollbar-hide min-h-screen">
        <div className="px-6 pt-10 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentPage('result')}
              className="text-sm font-sans text-text-sub hover:text-text transition-colors"
            >
              ← 뒤로
            </button>
            <span className="font-sans text-sm text-text-sub">결제</span>
          </div>

          {/* Resident card preview */}
          <div className="flex flex-col items-center mb-8 animate-fadeUp">
            <div className="w-32 h-40 rounded-2xl bg-gradient-to-b from-letter to-[#EDE5D0] shadow-md border border-[#E0DDD8] flex flex-col items-center justify-center p-4 relative overflow-hidden">
              {RESIDENT_CARD ? (
                <img src={RESIDENT_CARD} alt="주민 카드" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-point-light/50 to-point/40 flex items-center justify-center mb-2 shadow-inner">
                    <span className="text-xl font-batang text-point-dark">파</span>
                  </div>
                  <p className="text-[9px] font-sans text-text-sub">주민등록증</p>
                  <p className="font-batang text-xs text-text">조용한 파수꾼</p>
                  <p className="text-[8px] font-sans text-text-sub mt-0.5">No. {nickname || 'GUEST'}-001</p>
                </>
              )}
            </div>
          </div>

          <h2 className="font-batang text-xl text-text text-center mb-6 animate-fadeUp" style={{ animationDelay: '0.15s', opacity: 0 }}>
            탐험권을 선택해주세요
          </h2>

          {/* Option 1 */}
          <div
            onClick={() => setSelected('expedition')}
            className={`mb-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 animate-fadeUp
                        ${selected === 'expedition'
                          ? 'bg-white border-[1.5px] border-point shadow-lg'
                          : 'bg-white border border-[#E0DDD8]'
                        }`}
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                              ${selected === 'expedition' ? 'border-point bg-point' : 'border-[#E0DDD8]'}`}
                >
                  {selected === 'expedition' && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-sans font-medium text-text">탐험권</span>
              </div>
              <div className="text-right">
                <p className="font-sans font-bold text-lg text-text">4,990원</p>
                <p className="font-sans text-xs text-text-sub line-through">8,900원</p>
              </div>
            </div>
            <p className="font-sans text-sm text-text-sub ml-7">전체 결과 10개 섹션 + 루의 편지</p>
            <div className="mt-3 ml-7 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-point" />
              <p className="font-sans text-xs text-point-dark">베타 오픈 기간 한정</p>
            </div>
          </div>

          {/* Option 2 */}
          <div
            onClick={() => setSelected('expedition_plus')}
            className={`mb-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 animate-fadeUp relative
                        ${selected === 'expedition_plus'
                          ? 'bg-white border-[1.5px] border-point shadow-lg'
                          : 'bg-white border border-[#E0DDD8]'
                        }`}
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            <span className="absolute -top-2.5 right-5 px-3 py-0.5 bg-point text-white text-xs font-sans font-bold rounded-full shadow-md">
              추천
            </span>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                              ${selected === 'expedition_plus' ? 'border-point bg-point' : 'border-[#E0DDD8]'}`}
                >
                  {selected === 'expedition_plus' && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-sans font-medium text-text">탐험권 + 추가 질문 3회</span>
              </div>
              <div className="text-right">
                <p className="font-sans font-bold text-lg text-text">6,980원</p>
                <p className="font-sans text-xs text-text-sub line-through">10,890원</p>
              </div>
            </div>
            <p className="font-sans text-sm text-text-sub ml-7">전체 결과 + 루에게 추가 질문 3회</p>
            <div className="mt-3 ml-7 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-point" />
              <p className="font-sans text-xs text-point-dark">베타 오픈 기간 한정</p>
            </div>
          </div>

          {/* Terms agreement */}
          <div className="mb-6 animate-fadeUp" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <TermsAgreement agreed={agreed} onChange={setAgreed} />
          </div>
        </div>

        {/* Bottom: pay button + notice */}
        <div className="px-6 pb-8 sticky bottom-0 bg-base/95 backdrop-blur-sm pt-4 border-t border-[#E0DDD8]">
          {error && (
            <p className="font-sans text-xs text-red-500 text-center mb-3">{error}</p>
          )}
          <button
            onClick={handlePay}
            disabled={!agreed || paying}
            className="w-full py-5 bg-point text-white rounded-2xl font-sans font-bold text-lg
                       shadow-lg transition-all duration-300 hover:bg-point-dark hover:shadow-xl hover:scale-[1.02] active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {paying ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                결제 중...
              </span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                결제하기
              </>
            )}
          </button>
          <p className="mt-4 text-center font-sans text-sm text-text-sub">
            결제 후 즉시 전체 결과를 확인할 수 있어요.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
