import { useEffect, useState } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { FOREST_BG } from '@/constants/images';

export function TransitionPage() {
  const { nickname, setCurrentPage } = useApp();
  const [phase, setPhase] = useState<'darken' | 'forest'>('darken');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('forest'), 1500);
    const t2 = setTimeout(() => setCurrentPage('lu'), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [setCurrentPage]);

  return (
    <PageContainer className="bg-black" footer={false}>
      {/* Darkening overlay */}
      <div
        className={`absolute inset-0 z-30 bg-black transition-opacity duration-[1500ms] ${
          phase === 'darken' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Forest background */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ${
          phase === 'forest' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img src={FOREST_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center flex-1 min-h-0 px-6 transition-all duration-1000 ${
          phase === 'forest' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="font-batang text-4xl text-white tracking-wide drop-shadow-lg animate-scaleIn">
          기억의 숲
        </h2>
        <p className="font-sans text-base text-white/80 mt-6 animate-fadeUp" style={{ animationDelay: '0.8s', opacity: 0 }}>
          {nickname}님의 여행이 시작됩니다.
        </p>
      </div>
    </PageContainer>
  );
}
