import { useEffect } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { calculateResident, calculateResidentDebug, RESIDENTS } from '@/constants/residents';

const FIREFLIES = [
  { top: '30%', left: '35%', size: 'w-3 h-3', delay: '0s', duration: '2s' },
  { top: '45%', left: '55%', size: 'w-2.5 h-2.5', delay: '0.5s', duration: '2.5s' },
  { top: '38%', left: '48%', size: 'w-4 h-4', delay: '1s', duration: '3s' },
  { top: '52%', left: '40%', size: 'w-2 h-2', delay: '0.3s', duration: '2.2s' },
  { top: '42%', left: '62%', size: 'w-3.5 h-3.5', delay: '0.8s', duration: '2.8s' },
];

export function LoadingPage() {
  const { answers, setCurrentPage, setResidentKey } = useApp();

  useEffect(() => {
    const key = calculateResident(answers);
    setResidentKey(key);

    const debug = calculateResidentDebug(answers);
    const dimScores = debug.dimScores;
    const rs = debug.residentScores;

    console.group('%c[주민 배정 알고리즘 결과]', 'color:#4A9E8E; font-weight:bold; font-size:14px;');
    console.log('%c1. 차원별 최종 점수', 'color:#3A8474; font-weight:bold;');
    console.table(dimScores);
    console.log('%c2. Q24 주민별 가중치', 'color:#3A8474; font-weight:bold;');
    console.table(debug.residentWeights);
    console.log('%c3. 8명 주민별 매칭 점수', 'color:#3A8474; font-weight:bold;');
    console.table(rs);
    console.log('%c4. 주민 순위 (내림차순)', 'color:#3A8474; font-weight:bold;');
    console.table(debug.sorted);
    console.log(
      `%c5. 최종 배정 주민: ${RESIDENTS[key].name} (${key})`,
      'color:#4A9E8E; font-weight:bold; font-size:13px;',
    );
    console.groupEnd();

    const timer = setTimeout(() => setCurrentPage('result'), 3000);
    return () => clearTimeout(timer);
  }, [answers, setCurrentPage, setResidentKey]);

  return (
    <PageContainer className="bg-gradient-to-b from-purple-bg to-purple-bg-dark">
      <div className="relative flex flex-col items-center justify-center flex-1 min-h-0 px-6">
        {/* Fireflies */}
        <div className="relative w-full h-64 mb-12">
          {FIREFLIES.map((fly, i) => (
            <div
              key={i}
              className={`absolute ${fly.size} rounded-full bg-golden`}
              style={{
                top: fly.top,
                left: fly.left,
                animation: `firefly ${fly.duration} ease-in-out ${fly.delay} infinite`,
                boxShadow: '0 0 12px rgba(240, 232, 144, 0.8), 0 0 24px rgba(240, 232, 144, 0.4)',
              }}
            />
          ))}
        </div>

        {/* Message */}
        <p className="font-batang text-xl text-text text-center animate-fadeUp" style={{ animationDelay: '0.5s', opacity: 0 }}>
          숲이 당신의 이름을<br />찾고 있어요.
        </p>
      </div>

      <style>{`
        @keyframes firefly {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </PageContainer>
  );
}
