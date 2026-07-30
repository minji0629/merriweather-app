import { useState, useEffect } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { ExtraQuestionsModal } from '@/components/ExtraQuestionsModal';
import { RESIDENT_CARD, AI_SECTION_2, AI_LETTER } from '@/constants/images';
import { getResidentProfile, withNickname } from '@/constants/residents';
import { Share2, Send, Sparkles } from '@/components/Icons';
import { generateGaul, generateLetter, answerQuestion } from '@/lib/claude';

const QUESTION_LIMIT = 3;

export function PremiumResultPage() {
  const { nickname, setCurrentPage, residentKey, restart, previousPage } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [luAnswer, setLuAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const [gaulText, setGaulText] = useState('');
  const [gaulLoading, setGaulLoading] = useState(false);
  const [gaulError, setGaulError] = useState(false);

  const [letterText, setLetterText] = useState('');
  const [letterLoading, setLetterLoading] = useState(false);
  const [letterError, setLetterError] = useState(false);

  const RESULT = residentKey ? getResidentProfile(residentKey) : null;

  useEffect(() => {
    if (!RESULT || !residentKey) return;

    let cancelled = false;

    const runGaul = async () => {
      setGaulLoading(true);
      setGaulError(false);
      try {
        const text = await generateGaul(nickname || '여행자', residentKey);
        if (!cancelled) setGaulText(text);
      } catch {
        if (!cancelled) setGaulError(true);
      } finally {
        if (!cancelled) setGaulLoading(false);
      }
    };

    const runLetter = async () => {
      setLetterLoading(true);
      setLetterError(false);
      try {
        const text = await generateLetter(nickname || '여행자', residentKey);
        if (!cancelled) setLetterText(text);
      } catch {
        if (!cancelled) setLetterError(true);
      } finally {
        if (!cancelled) setLetterLoading(false);
      }
    };

    runGaul();
    runLetter();

    return () => {
      cancelled = true;
    };
  }, [RESULT, residentKey, nickname]);

  if (!RESULT) {
    return (
      <PageContainer className="bg-base">
        <div className="flex items-center justify-center flex-1 min-h-0">
          <p className="font-sans text-sm text-text-sub">결과를 불러오고 있어요...</p>
        </div>
      </PageContainer>
    );
  }

  const firstChar = RESULT.name.charAt(RESULT.name.length - 1);
  const remainingQuestions = QUESTION_LIMIT - questionCount;

  const handleAsk = async () => {
    if (!question.trim() || questionCount >= QUESTION_LIMIT || !residentKey) return;
    setIsAsking(true);
    setLuAnswer('');
    try {
      const text = await answerQuestion(nickname || '여행자', residentKey, question.trim());
      setLuAnswer(text);
      setQuestionCount((c) => c + 1);
    } catch {
      setLuAnswer('지금은 루가 답변을 드리기 어려워요. 잠시 후 다시 시도해줘.');
    } finally {
      setIsAsking(false);
      setQuestion('');
    }
  };

  const GaulContent = () => {
    if (gaulLoading) {
      return (
        <div className="flex items-center justify-center py-6">
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-point animate-pulse" />
            <p className="font-sans text-sm text-text-sub">루가 생각하는 중이에요...</p>
          </div>
        </div>
      );
    }
    if (gaulError) {
      return (
        <p className="font-sans text-sm text-text-sub leading-relaxed text-center py-4">
          지금은 결을 만들기 어려워요. 잠시 후 다시 확인해줘.
        </p>
      );
    }
    if (gaulText) {
      return (
        <p className="font-batang text-sm text-text leading-loose whitespace-pre-line">
          {gaulText}
        </p>
      );
    }
    return null;
  };

  const LetterContent = () => {
    if (letterLoading) {
      return (
        <div className="flex items-center justify-center py-6">
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-point animate-pulse" />
            <p className="font-sans text-sm text-text-sub">루가 생각하는 중이에요...</p>
          </div>
        </div>
      );
    }
    if (letterError) {
      return (
        <p className="font-batang text-base text-text leading-loose text-center py-4">
          지금은 편지를 쓰기 어려워요. 잠시 후 다시 확인해줘.
        </p>
      );
    }
    if (letterText) {
      return (
        <p className="font-batang text-base text-text leading-loose whitespace-pre-line">
          {letterText}
        </p>
      );
    }
    return null;
  };

  return (
    <PageContainer className="bg-base">
      <div className="overflow-y-auto scrollbar-hide flex-1 min-h-0">
        <div className="px-6 pt-10 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            {previousPage === 'archive' ? (
              <button
                onClick={() => setCurrentPage('archive')}
                className="text-sm font-sans text-text-sub hover:text-text transition-colors"
              >
                ← 보관함으로
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('result')}
                className="text-sm font-sans text-text-sub hover:text-text transition-colors"
              >
                ← 목록
              </button>
            )}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-sans text-text-sub rounded-full bg-white border border-[#E0DDD8] hover:border-point hover:text-point transition-all duration-300"
            >
              <Share2 className="w-3.5 h-3.5" />
              공유하기
            </button>
          </div>

          {/* Resident card */}
          <div className="flex flex-col items-center mb-6 animate-fadeUp">
            <div className="w-44 h-56 rounded-2xl bg-gradient-to-b from-letter to-[#EDE5D0] shadow-lg border border-[#E0DDD8] flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {RESIDENT_CARD ? (
                <img src={RESIDENT_CARD} alt="주민 카드" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-golden/80 rounded-full text-[9px] font-sans text-text">
                    MERRIWEATHER
                  </div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-point-light/50 to-point/40 flex items-center justify-center mb-3 shadow-inner">
                    <span className="text-3xl font-batang text-point-dark">{firstChar}</span>
                  </div>
                  <p className="text-[10px] font-sans text-text-sub mb-0.5">주민등록증</p>
                  <p className="font-batang text-base text-text">{RESULT.name}</p>
                  <p className="text-[9px] font-sans text-text-sub mt-0.5">No. {nickname || 'GUEST'}-001</p>
                </>
              )}
            </div>
          </div>

          {/* Name + intro */}
          <div className="text-center mb-10 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <h1 className="font-batang text-3xl text-text mb-2">{RESULT.name}</h1>
            <p className="font-sans text-sm text-text-sub">{RESULT.intro}</p>
          </div>

          {/* Premium sections 1-8 */}
          {RESULT.premium.slice(0, 8).map((section, i) => (
            <div
              key={i}
              className="mb-6 animate-fadeUp"
              style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-point text-white text-sm font-sans font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h2 className="font-batang text-lg text-text">{section.title}</h2>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#E0DDD8]">
                {section.ai ? (
                  AI_SECTION_2 ? (
                    <img src={AI_SECTION_2} alt={section.title} className="w-full rounded-xl" />
                  ) : (
                    <GaulContent />
                  )
                ) : (
                  <p className="font-sans text-sm text-text leading-relaxed whitespace-pre-line">
                    {withNickname(section.body, nickname)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Section 9: Lu's letter — cream paper with Gowun Batang */}
          <div className="mb-6 animate-fadeUp" style={{ animationDelay: '1.1s', opacity: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-point text-white text-sm font-sans font-bold flex items-center justify-center">
                9
              </span>
              <h2 className="font-batang text-lg text-text">루의 편지</h2>
            </div>
            <div
              className="p-6 rounded-2xl border border-[#E0DDD8] shadow-sm"
              style={{ backgroundColor: '#F5F0E0' }}
            >
              {AI_LETTER ? (
                <img src={AI_LETTER} alt="루의 편지" className="w-full rounded-xl" />
              ) : (
                <LetterContent />
              )}
            </div>
          </div>

          {/* Section 10: Ask Lu */}
          <div className="mb-8 animate-fadeUp" style={{ animationDelay: '1.2s', opacity: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-point text-white text-sm font-sans font-bold flex items-center justify-center">
                10
              </span>
              <h2 className="font-batang text-lg text-text">루에게 질문하기</h2>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#E0DDD8]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-xs text-text-sub">루에게 질문할 수 있어요</p>
                <span className="text-xs font-sans text-point-dark font-medium">
                  남은 횟수 {remainingQuestions}/{QUESTION_LIMIT}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="루에게 물어보고 싶은 것을 적어주세요."
                  maxLength={100}
                  disabled={remainingQuestions <= 0}
                  className="flex-1 px-4 py-3 bg-base rounded-xl font-sans text-sm text-text
                             placeholder:text-text-sub/50 border border-[#E0DDD8]
                             focus:border-point focus:bg-white transition-all duration-300
                             disabled:opacity-40"
                />
                <button
                  onClick={handleAsk}
                  disabled={!question.trim() || isAsking || remainingQuestions <= 0}
                  className="flex-shrink-0 px-4 py-3 bg-point text-white rounded-xl font-sans font-medium text-sm
                             transition-all duration-300 hover:bg-point-dark active:scale-95
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAsking ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" />
                      질문하기
                    </span>
                  )}
                </button>
              </div>
              {isAsking && (
                <div className="p-4 bg-letter rounded-xl animate-fadeIn mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-point/15 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-point animate-pulse" />
                    </div>
                    <p className="font-sans text-sm text-text-sub">루가 생각하는 중이에요...</p>
                  </div>
                </div>
              )}
              {luAnswer && !isAsking && (
                <div className="p-4 bg-letter rounded-xl animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-point/15 flex items-center justify-center">
                      <span className="text-sm font-batang text-point-dark">루</span>
                    </div>
                    <p className="font-batang text-sm text-text leading-relaxed pt-1 whitespace-pre-line">{luAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next journey teaser */}
          <div className="mb-8 animate-fadeUp" style={{ animationDelay: '1.3s', opacity: 0 }}>
            <h2 className="font-batang text-lg text-text mb-4 text-center">다음 여행 예고</h2>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-[#E0DDD8] flex items-center gap-3">
                <span className="text-2xl">🌊</span>
                <div className="flex-1">
                  <p className="font-sans text-sm font-medium text-text">물결의 바다</p>
                  <p className="font-sans text-xs text-text-sub">당신의 감정 패턴을 더 깊이 만날 수 있어요</p>
                </div>
                <span className="font-sans text-xs text-point-dark font-medium">Coming Soon</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#E0DDD8] flex items-center gap-3">
                <span className="text-2xl">🏞</span>
                <div className="flex-1">
                  <p className="font-sans text-sm font-medium text-text">메아리 협곡</p>
                  <p className="font-sans text-xs text-text-sub">당신의 관계 방식을 더 선명하게 볼 수 있어요</p>
                </div>
                <span className="font-sans text-xs text-point-dark font-medium">Coming Soon</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#E0DDD8] flex items-center gap-3">
                <span className="text-2xl">🌌</span>
                <div className="flex-1">
                  <p className="font-sans text-sm font-medium text-text">별의 천문대</p>
                  <p className="font-sans text-xs text-text-sub">당신이 향하는 방향을 함께 찾아볼 수 있어요</p>
                </div>
                <span className="font-sans text-xs text-point-dark font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={() => setShowExtraModal(true)}
            className="w-full py-4 bg-white text-point-dark rounded-2xl font-sans font-medium text-base
                       border border-point shadow-sm transition-all duration-300 hover:bg-point/5 hover:shadow-md active:scale-95
                       flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            루에게 추가 질문 3회 1,990원
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full py-4 bg-text text-white rounded-2xl font-sans font-medium text-base
                       shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95
                       flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            결과 공유하기
          </button>
        </div>

        {/* Restart link */}
        <div className="px-6 pb-10 text-center">
          <button
            onClick={restart}
            className="font-sans text-sm text-text-sub hover:text-text transition-colors underline-offset-4 hover:underline"
          >
            다시 여행하기
          </button>
        </div>
      </div>

      <ComingSoonModal open={showShareModal} onClose={() => setShowShareModal(false)} message="공유 기능이 곧 준비될 예정이에요" />
      <ExtraQuestionsModal open={showExtraModal} onClose={() => setShowExtraModal(false)} />
    </PageContainer>
  );
}
