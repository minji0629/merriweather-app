import { useState, useEffect } from 'react';
import { useApp } from '@/store/useApp';
import { useAuth } from '@/store/useAuth';
import { PageContainer } from '@/components/PageContainer';
import { RESIDENT_IMAGES } from '@/constants/images';
import { getResidentProfile, withNickname, RESIDENT_FEATURES } from '@/constants/residents';
import { hasFinalConsonant } from '@/lib/korean';
import { generateGaul, generateLetter, answerQuestion } from '@/lib/claude';
import { fetchUserResults, fetchQuestions, fetchLatestQuestionsByUser, createDefaultQuestions, decrementQuestion, QuestionRow } from '@/lib/supabase';
import { Sparkles, Send, Share2, Gift } from '@/components/Icons';
import ResidentFlipCard from '@/components/ResidentFlipCard';

export function PremiumResultPage() {
  const { nickname, setCurrentPage, residentKey, secondResidentKey, restart, previousPage } = useApp();
  const { user } = useAuth();

  const [gaulText, setGaulText] = useState('');
  const [gaulLoading, setGaulLoading] = useState(true);
  const [gaulError, setGaulError] = useState(false);

  const [letterText, setLetterText] = useState('');
  const [letterLoading, setLetterLoading] = useState(true);
  const [letterError, setLetterError] = useState(false);

  const [question, setQuestion] = useState('');
  const [luAnswer, setLuAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState(false);
  const [questionRow, setQuestionRow] = useState<QuestionRow | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);

  const RESULT = residentKey ? getResidentProfile(residentKey) : null;

  useEffect(() => {
    if (!RESULT || !residentKey) return;
    let cancelled = false;

    (async () => {
      try {
        const text = await generateGaul(nickname || '여행자', residentKey, secondResidentKey ?? residentKey);
        if (!cancelled) setGaulText(text);
      } catch {
        if (!cancelled) setGaulError(true);
      } finally {
        if (!cancelled) setGaulLoading(false);
      }
    })();

    (async () => {
      try {
        const text = await generateLetter(nickname || '여행자', residentKey, secondResidentKey ?? residentKey);
        if (!cancelled) setLetterText(text);
      } catch {
        if (!cancelled) setLetterError(true);
      } finally {
        if (!cancelled) setLetterLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [RESULT, residentKey, secondResidentKey, nickname]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const results = await fetchUserResults(user.id);
      if (cancelled || results.length === 0) return;
      const latest = results[0];
      setResultId(latest.id);

      console.log('[Questions] 현재 user_id:', user.id);
      console.log('[Questions] 현재 result_id:', latest.id);

      // 1) result_id로 정확히 매칭
      let qRow = await fetchQuestions(user.id, latest.id);

      // 2) 매칭 실패 시 user_id만으로 최근 행 조회
      if (!qRow) {
        console.log('[Questions] result_id 매칭 실패, user_id만으로 조회');
        qRow = await fetchLatestQuestionsByUser(user.id);
      }

      // 3) 여전히 없으면 탐험권 구매자용 기본 1회 자동 생성
      if (!qRow) {
        console.log('[Questions] 데이터 없음, 기본 1회 자동 생성');
        qRow = await createDefaultQuestions(user.id, latest.id, 1);
      }

      console.log('[Questions] 테이블에서 불러온 횟수:', qRow?.remaining_count ?? 0);
      if (!cancelled) setQuestionRow(qRow);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const remainingCount = questionRow?.remaining_count ?? 0;

  const handleAsk = async () => {
    if (!question.trim() || !questionRow || questionRow.remaining_count <= 0 || !residentKey) return;
    setIsAsking(true);
    setAskError(false);
    setLuAnswer('');
    try {
      const text = await answerQuestion(nickname || '여행자', residentKey, secondResidentKey ?? residentKey, question.trim());
      setLuAnswer(text);
      const ok = await decrementQuestion(questionRow.id, questionRow.remaining_count);
      if (ok) {
        setQuestionRow({ ...questionRow, remaining_count: questionRow.remaining_count - 1 });
      }
    } catch {
      setAskError(true);
    } finally {
      setIsAsking(false);
    }
  };

  if (!RESULT) {
    return (
      <PageContainer className="bg-base">
        <div className="flex items-center justify-center flex-1 min-h-0">
          <p className="font-batang text-sm text-text-sub">결과를 불러오고 있어요...</p>
        </div>
      </PageContainer>
    );
  }

  const renderGaul = () => {
    if (gaulLoading) {
      return (
        <p className="font-batang text-sm text-text-sub leading-relaxed text-center py-4">
          당신의 결을 읽어가는 중이에요...
        </p>
      );
    }
    if (gaulError || !gaulText) {
      return (
        <p className="font-batang text-sm text-text-sub leading-relaxed text-center py-4">
          지금은 결을 만들기 어려워요. 잠시 후 다시 확인해줘.
        </p>
      );
    }
    const secondKey = secondResidentKey ?? residentKey!;
    const firstFeature = RESIDENT_FEATURES[residentKey!];
    const firstParticle = hasFinalConsonant(firstFeature) ? '과' : '와';
    const secondFeature = RESIDENT_FEATURES[secondKey];
    const secondParticle = hasFinalConsonant(secondFeature) ? '이' : '가';
    const combinationLine = `${RESULT.name}의 ${firstFeature}${firstParticle} ${getResidentProfile(secondKey).name}의 ${secondFeature}${secondParticle} 만나 당신만의 결이 됩니다.`;
    return (
      <div>
        <p className="font-batang text-xs text-text-sub leading-relaxed mb-3">
          {combinationLine}
        </p>
        <p className="font-batang text-sm text-text leading-loose whitespace-pre-line">
          {gaulText}
        </p>
      </div>
    );
  };

  const renderLetter = () => {
    if (letterLoading) {
      return (
        <p className="font-batang text-sm text-text-sub leading-relaxed text-center py-4">
          루가 편지를 쓰고 있어요...
        </p>
      );
    }
    if (letterError || !letterText) {
      return (
        <p className="font-batang text-sm text-text-sub leading-relaxed text-center py-4">
          지금은 편지를 쓰기 어려워요. 잠시 후 다시 확인해줘.
        </p>
      );
    }
    return (
      <p className="font-batang text-sm text-text leading-loose whitespace-pre-line">
        {letterText}
      </p>
    );
  };

  return (
    <PageContainer className="bg-base">
      <div className="overflow-y-auto scrollbar-hide flex-1 min-h-0">
        <div className="px-4 sm:px-6 pt-10 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 pr-14 sm:pr-0">
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
                ← 결과로
              </button>
            )}
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-sans text-text-sub rounded-full bg-white border border-[#E0DDD8] hover:border-point hover:text-point transition-all duration-300">
              <Share2 className="w-3.5 h-3.5" />
              공유하기
            </button>
          </div>

          {/* Resident card */}
          <div className="flex flex-col items-center mb-8 animate-fadeUp">
            {RESIDENT_IMAGES[residentKey!] ? (
              <ResidentFlipCard
                frontImage={RESIDENT_IMAGES[residentKey!]}
                alt={RESULT.name}
              />
            ) : (
              <div
                className="relative overflow-hidden flex flex-col items-center justify-center"
                style={{
                  width: '280px',
                  height: '380px',
                  border: '2px solid #C9A84C',
                  borderRadius: '12px',
                  background: '#f5f0e0',
                }}
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-golden/80 rounded-full text-[10px] font-sans text-text">
                  MERRIWEATHER
                </div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-point-light/50 to-point/40 flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-4xl">{RESULT.emoji}</span>
                </div>
                <p className="text-xs font-sans text-text-sub mb-1">주민등록증</p>
                <p className="font-batang text-lg text-text">{RESULT.name}</p>
                <p className="text-[10px] font-sans text-text-sub mt-1">No. {nickname || 'GUEST'}-001</p>
              </div>
            )}
          </div>

          {/* Name + intro */}
          <div className="text-center mb-8 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <h1 className="font-batang text-3xl text-text mb-2">{RESULT.name}</h1>
            <p className="font-sans text-sm text-text-sub">{RESULT.intro}</p>
          </div>

          {/* All 10 premium sections */}
          {RESULT.premium.map((section, idx) => {
            const delay = `${0.3 + idx * 0.1}s`;
            const isGaul = section.title === '당신 안에 흐르는 결';
            const isLetter = section.title === '루의 편지';
            const isQuestion = section.title === '루에게 질문하기';

            return (
              <div key={idx} className="mb-8 animate-fadeUp" style={{ animationDelay: delay, opacity: 0 }}>
                {isQuestion ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-batang text-lg text-point-dark">루에게 질문하기</h2>
                      <span className="text-xs font-sans text-text-sub">
                        남은 횟수 {remainingCount}회
                      </span>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
                      <div className="flex flex-col gap-3 mb-4">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="루에게 물어보고 싶은 것을 적어줘"
                          className="w-full box-border px-4 py-3 text-sm font-sans text-text bg-base rounded-xl border border-[#E0DDD8] focus:border-point focus:outline-none transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAsk();
                          }}
                        />
                        <button
                          onClick={handleAsk}
                          disabled={isAsking || !question.trim() || remainingCount <= 0}
                          className="w-full box-border px-4 py-3 bg-point text-white rounded-xl font-sans text-sm
                                     transition-all duration-300 hover:bg-point-dark active:scale-95
                                     disabled:opacity-40 disabled:cursor-not-allowed
                                     flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-4 h-4" />
                          보내기
                        </button>
                      </div>

                      {isAsking && (
                        <div className="flex items-center justify-center py-4">
                          <p className="font-batang text-sm text-text-sub">루가 생각하는 중이에요...</p>
                        </div>
                      )}

                      {askError && (
                        <p className="font-batang text-sm text-text-sub leading-relaxed text-center py-4">
                          지금은 답하기 어려워요. 잠시 후 다시 시도해줘.
                        </p>
                      )}

                      {luAnswer && !isAsking && (
                        <div className="mt-2 p-4 bg-base rounded-xl border border-[#E0DDD8]">
                          <p className="font-batang text-sm text-text leading-relaxed pt-1 whitespace-pre-line">{luAnswer}</p>
                        </div>
                      )}

                      {remainingCount <= 0 && !luAnswer && !isAsking && (
                        <p className="font-batang text-sm text-text-sub text-center py-4">
                          남은 질문 횟수가 없어요. 추가 질문권을 구매하면 더 물어볼 수 있어요.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-batang text-lg text-point-dark mb-4 flex items-center gap-2">
                      {section.ai && <Sparkles className="w-4 h-4" />}
                      {section.title}
                    </h2>
                    <div className={isLetter ? 'p-6 bg-letter rounded-2xl border border-[#E0DDD8]' : 'p-5 bg-white rounded-xl border border-[#E0DDD8]'}>
                      {isGaul ? renderGaul() : isLetter ? renderLetter() : (
                        <p className="font-batang text-sm text-text leading-loose whitespace-pre-line">
                          {withNickname(section.body, nickname || '여행자')}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Gift button */}
          <div className="mb-6 animate-fadeUp" style={{ animationDelay: '0.6s', opacity: 0 }}>
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
          <div className="text-center pb-4">
            <button
              onClick={restart}
              className="font-sans text-sm text-text-sub hover:text-text transition-colors underline-offset-4 hover:underline"
            >
              다시 여행하기
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
