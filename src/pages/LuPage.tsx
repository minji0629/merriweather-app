import { useState, useCallback } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { TypewriterText } from '@/components/TypewriterText';
import { LU_CHARACTER } from '@/constants/images';
import { ArrowRight, ChevronRight } from '@/components/Icons';

const DIALOGUES = [
  '안녕. 나는 루야.',
  '나는 메리웨더의 문지기이자, 이 숲을 함께 걷는 안내자야.',
  '여기 온 사람들은 저마다 다른 이유로 오지만, 걷다 보면 하나씩 알게 되더라고.',
  '자신이 어떤 사람인지, 어떤 방식으로 빛나는 사람인지.',
  '나랑 같이 가볼래?',
];

export function LuPage() {
  const { setCurrentPage } = useApp();
  const [lineIndex, setLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const handleTypingDone = useCallback(() => {
    setIsTyping(false);
  }, []);

  const handleNext = () => {
    if (lineIndex < DIALOGUES.length - 1) {
      setLineIndex((prev) => prev + 1);
      setIsTyping(true);
    } else {
      setCurrentPage('question');
    }
  };

  const handleSkip = () => {
    setCurrentPage('question');
  };

  const isLast = lineIndex === DIALOGUES.length - 1;

  return (
    <PageContainer className="bg-gradient-to-b from-[#F0FAF0] to-[#D4F0D0]" footer={false} style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Skip button - top right */}
      <button
        onClick={handleSkip}
        className="absolute top-4 left-4 z-30 flex items-center gap-1 px-3 py-1.5 text-sm font-sans text-text-sub
                   rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/90 hover:text-text transition-all duration-300"
      >
        숲으로 들어가기
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Content area */}
      <div className="relative flex flex-col flex-1 min-h-0 px-6 pt-14 pb-4">
        {/* Dialogue area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          {/* Lu character placeholder */}
          <div className="flex justify-center animate-fadeIn">
            {LU_CHARACTER ? (
              <div style={{ transform: 'scaleX(-1)' }}>
                <img src={LU_CHARACTER} alt="루" className="object-contain max-h-[55vh] animate-breathe" style={{ height: '55vh', width: 'auto' }} />
              </div>
            ) : (
              <div className="w-44 h-44 rounded-full bg-gradient-to-b from-point-light/40 to-point/30 flex items-center justify-center animate-float shadow-lg">
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#B8E0D0] to-[#8ACBB8] flex items-center justify-center text-5xl font-batang text-point-dark shadow-inner">
                  루
                </div>
              </div>
            )}
          </div>

          {/* Dialogue text */}
          <div
            key={lineIndex}
            className="w-full min-h-[80px] flex items-center justify-center text-center animate-fadeIn"
          >
            <p className="font-batang text-lg text-text leading-relaxed max-w-xs">
              <TypewriterText
                text={DIALOGUES[lineIndex]}
                speed={60}
                onDone={handleTypingDone}
              />
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="h-16 flex items-end justify-center">
          {!isTyping && (
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-8 py-3.5 bg-point text-white rounded-full font-sans font-medium text-base
                         shadow-lg transition-all duration-300 hover:bg-point-dark hover:shadow-xl hover:scale-105 active:scale-95 animate-fadeUp"
            >
              {isLast ? '숲으로 들어가기' : '다음'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
