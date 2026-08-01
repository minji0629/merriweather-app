import { useEffect, useState } from 'react';
import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { CHAPTER_BG_1 } from '@/constants/images';

export function TransitionPage() {
  const { nickname, setCurrentPage } = useApp();
  const [phase, setPhase] = useState<'darken' | 'chapter'>('darken');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('chapter'), 1500);
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

      {/* Chapter 1 background */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ${
          phase === 'chapter' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img src={CHAPTER_BG_1} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center flex-1 min-h-0 px-6 transition-all duration-1000 ${
          phase === 'chapter' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="font-playfair text-4xl font-bold uppercase text-white tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-scaleIn">
          Chapter 1
        </h2>
        <p className="font-batang text-base text-white/90 mt-4 animate-fadeUp drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" style={{ animationDelay: '0.5s', opacity: 0 }}>
          기억의 숲
        </p>
        <p className="font-sans text-sm text-white/70 mt-3 animate-fadeUp drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" style={{ animationDelay: '0.8s', opacity: 0 }}>
          {nickname}님의 여행이 시작됩니다.
        </p>
      </div>
    </PageContainer>
  );
}
