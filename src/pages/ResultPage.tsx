import { useState } from 'react';
import { useApp } from '@/store/useApp';
import { useAuth } from '@/store/useAuth';
import { PageContainer } from '@/components/PageContainer';
import { RESIDENT_IMAGES, AD_AREA } from '@/constants/images';
import { getResidentProfile, withNickname } from '@/constants/residents';
import { Lock, Share2, Sparkles, Check, Gift } from '@/components/Icons';

export function ResultPage() {
  const { nickname, setCurrentPage, residentKey, previewMode, restart, previousPage } = useApp();
  const { user, login } = useAuth();
  const { currentPage } = useApp();
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const RESULT = residentKey ? getResidentProfile(residentKey) : null;

  if (!RESULT) {
    return (
      <PageContainer className="bg-base">
        <div className="flex items-center justify-center flex-1 min-h-0">
          <p className="font-sans text-sm text-text-sub">결과를 불러오고 있어요...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="bg-base">
      <div className="overflow-y-auto scrollbar-hide flex-1 min-h-0">
        <div className="px-6 pt-10 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            {previousPage === 'archive' ? (
              <button
                onClick={() => setCurrentPage('archive')}
                className="text-sm font-sans text-text-sub hover:text-text transition-colors"
              >
                ← 보관함으로
              </button>
            ) : (
              <span />
            )}
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-sans text-text-sub rounded-full bg-white border border-[#E0DDD8] hover:border-point hover:text-point transition-all duration-300">
              <Share2 className="w-3.5 h-3.5" />
              공유하기
            </button>
          </div>

          {/* Resident card */}
          <div className="flex flex-col items-center mb-8 animate-fadeUp -mx-6">
            <div className="w-full rounded-none bg-gradient-to-b from-letter to-[#EDE5D0] shadow-lg border-y border-[#E0DDD8] relative overflow-hidden">
              {RESIDENT_IMAGES[residentKey!] ? (
                <img src={RESIDENT_IMAGES[residentKey!]} alt={RESULT.name} className="w-full h-auto object-cover" />
              ) : (
                <>
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-golden/80 rounded-full text-[10px] font-sans text-text">
                    MERRIWEATHER
                  </div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-point-light/50 to-point/40 flex items-center justify-center mb-4 shadow-inner mx-auto mt-6">
                    <span className="text-4xl">{RESULT.emoji}</span>
                  </div>
                  <p className="text-xs font-sans text-text-sub mb-1 text-center">주민등록증</p>
                  <p className="font-batang text-lg text-text text-center">{RESULT.name}</p>
                  <p className="text-[10px] font-sans text-text-sub mt-1 text-center pb-6">No. {nickname || 'GUEST'}-001</p>
                </>
              )}
            </div>
          </div>

          {/* Name + intro */}
          <div className="text-center mb-8 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <h1 className="font-batang text-3xl text-text mb-2">{RESULT.name}</h1>
            <p className="font-sans text-sm text-text-sub">{RESULT.intro}</p>
          </div>

          {/* Lu's discoveries */}
          <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <h2 className="font-batang text-lg text-point-dark mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              루가 발견한 것
            </h2>
            <div className="space-y-3">
              {RESULT.discovered.map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-[#E0DDD8]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-point/15 text-point-dark text-xs font-sans font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="font-sans text-sm text-text leading-relaxed">{withNickname(item, nickname)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Representative insight */}
          <div className="mb-8 p-5 bg-gradient-to-br from-golden/30 to-golden/10 rounded-2xl border border-golden/40 animate-fadeUp" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <h3 className="font-batang text-sm text-text-sub mb-2">대표 통찰</h3>
            <p className="font-batang text-lg text-text leading-relaxed">{withNickname(RESULT.insight, nickname)}</p>
          </div>

          {/* Strengths */}
          <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <h2 className="font-batang text-lg text-point-dark mb-4">강점</h2>
            <div className="space-y-3">
              {RESULT.strengths.map((s, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-[#E0DDD8]">
                  <Check className="w-5 h-5 text-point flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-sm text-text leading-relaxed">{withNickname(s, nickname)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Misconception */}
          <div className="mb-8 p-5 bg-white rounded-xl border border-[#E0DDD8] animate-fadeUp" style={{ animationDelay: '0.7s', opacity: 0 }}>
            <h2 className="font-batang text-lg text-point-dark mb-3">자주 받는 착각</h2>
            <p className="font-sans text-sm text-text leading-relaxed">{withNickname(RESULT.misconception, nickname)}</p>
          </div>

          {/* Lu's letter preview (locked) */}
          <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.8s', opacity: 0 }}>
            <h2 className="font-batang text-lg text-point-dark mb-4">루의 편지</h2>
            <div className="p-6 bg-letter rounded-2xl border border-[#E0DDD8] relative overflow-hidden">
              <p className="font-batang text-base text-text leading-relaxed whitespace-pre-line">
                {withNickname(RESULT.letter, nickname)}
              </p>
              {/* Blur overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-letter via-letter/90 to-transparent flex items-end justify-center pb-3">
                <div className="flex items-center gap-1.5 px-4 py-2 bg-white/80 rounded-full text-text-sub text-sm font-sans backdrop-blur-sm">
                  <Lock className="w-3.5 h-3.5" />
                  편지 전체 보기는 탐험권이 필요해요
                </div>
              </div>
            </div>
          </div>

          {/* Locked sections preview */}
          <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.9s', opacity: 0 }}>
            <h2 className="font-batang text-lg text-text-sub mb-4">더 알아보기</h2>
            <div className="relative">
              <div className="space-y-3 filter blur-[5px] select-none pointer-events-none">
                <div className="p-4 bg-white rounded-xl border border-[#E0DDD8]">
                  <p className="font-batang text-sm text-text mb-2">당신이 걷는 숲의 길</p>
                  <div className="h-3 bg-[#E0DDD8] rounded w-full mb-2" />
                  <div className="h-3 bg-[#E0DDD8] rounded w-3/4" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E0DDD8]">
                  <p className="font-batang text-sm text-text mb-2">당신에게 어울리는 풍경</p>
                  <div className="h-3 bg-[#E0DDD8] rounded w-full mb-2" />
                  <div className="h-3 bg-[#E0DDD8] rounded w-2/3" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E0DDD8]">
                  <p className="font-batang text-sm text-text mb-2">루의 추천 산책길</p>
                  <div className="h-3 bg-[#E0DDD8] rounded w-full mb-2" />
                  <div className="h-3 bg-[#E0DDD8] rounded w-4/5" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Lock className="w-5 h-5 text-text-sub" />
                  </div>
                  <p className="font-sans text-sm text-text-sub">탐험권으로 열 수 있어요</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment buttons */}
        <div className="px-6 pb-6 space-y-3 sticky bottom-0 bg-base/95 backdrop-blur-sm pt-4 border-t border-[#E0DDD8]">
          {previewMode ? (
            <button
              onClick={() => setCurrentPage('premium')}
              className="w-full py-4 bg-point text-white rounded-2xl font-sans font-medium text-base
                         shadow-lg transition-all duration-300 hover:bg-point-dark hover:shadow-xl hover:scale-[1.02] active:scale-95
                         flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              유료 결과 미리보기
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  if (!user) {
                    setShowSavePrompt(true);
                  } else {
                    setCurrentPage('payment');
                  }
                }}
                className="w-full py-4 bg-point text-white rounded-2xl font-sans font-medium text-base
                           shadow-lg transition-all duration-300 hover:bg-point-dark hover:shadow-xl hover:scale-[1.02] active:scale-95
                           flex items-center justify-between px-6"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  탐험권 구매하기
                </span>
                <span className="font-bold">4,990원</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    if (!user) {
                      setShowSavePrompt(true);
                    } else {
                      setCurrentPage('payment');
                    }
                  }}
                  className="w-full py-4 bg-text text-white rounded-2xl font-sans font-medium text-base
                             shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95
                             flex items-center justify-between px-6"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    탐험권 + 추가 질문
                  </span>
                  <span className="font-bold">6,980원</span>
                </button>
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-golden text-text text-xs font-sans font-bold rounded-full shadow-md whitespace-nowrap">
                  추천
                </span>
              </div>
            </>
          )}
        </div>

        {/* Save result prompt (login required) */}
        {showSavePrompt && !user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSavePrompt(false)} />
            <div className="relative w-full max-w-sm bg-base rounded-3xl shadow-2xl border border-[#E0DDD8] animate-scaleIn p-6 text-center">
              <h2 className="font-batang text-xl text-text mb-2">결과를 저장하고 싶다면?</h2>
              <p className="font-sans text-sm text-text-sub mb-6">
                로그인하면 결과를 저장하고 언제든 다시 볼 수 있어요.
              </p>
              <button
                onClick={() => {
                  setShowSavePrompt(false);
                  login(currentPage);
                }}
                className="w-full py-4 bg-[#FEE500] text-[#3C1E1E] rounded-2xl font-sans font-bold text-base
                           shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
              >
                카카오로 로그인
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                className="w-full mt-2 py-3 font-sans text-sm text-text-sub hover:text-text transition-colors"
              >
                나중에 하기
              </button>
            </div>
          </div>
        )}

        {/* Gift button */}
        <div className="px-6 pb-4">
          <button
            onClick={() => setCurrentPage('gift')}
            className="w-full py-3.5 bg-white text-point-dark rounded-2xl font-sans font-medium text-sm
                       border border-point shadow-sm transition-all duration-300 hover:bg-point/5 hover:shadow-md active:scale-95
                       flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            소중한 사람에게 선물하기
          </button>
        </div>

        {/* Restart link */}
        <div className="px-6 pb-8 text-center">
          <button
            onClick={restart}
            className="font-sans text-sm text-text-sub hover:text-text transition-colors underline-offset-4 hover:underline"
          >
            다시 여행하기
          </button>
        </div>

        {/* Ad area */}
        <div className="px-6 pb-8">
          <div className="w-full h-24 rounded-2xl bg-[#F0F0EE] border border-[#E0DDD8] flex items-center justify-center text-text-sub text-sm font-sans">
            {AD_AREA ? (
              <img src={AD_AREA} alt="광고 영역" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              '광고 영역'
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
