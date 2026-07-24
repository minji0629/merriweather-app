import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { LANDING_BG } from '@/constants/images';
import { ArrowRight } from '@/components/Icons';

export function LandingPage() {
  const { setCurrentPage } = useApp();

  return (
    <PageContainer className="bg-base">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={LANDING_BG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-20 pb-12">
        {/* Logo */}
        <h1 className="font-batang text-3xl text-white tracking-wide animate-fadeIn drop-shadow-lg">
          메리웨더
        </h1>
        <p className="font-batang text-sm text-white/70 mt-2 animate-fadeIn" style={{ animationDelay: '0.3s', opacity: 0 }}>
          Merriweather
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Main copy */}
        <div className="text-center mb-3 animate-fadeUp" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <h2 className="font-batang text-2xl text-white leading-relaxed drop-shadow-md">
            당신은 어떤 방식으로<br />빛나는 사람인가요?
          </h2>
        </div>

        {/* Sub copy */}
        <p
          className="font-sans text-sm text-white/80 text-center mb-12 animate-fadeUp"
          style={{ animationDelay: '1s', opacity: 0 }}
        >
          메리웨더가 함께 발견해드릴게요.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setCurrentPage('nickname')}
          className="group flex items-center gap-2 px-8 py-4 bg-white/95 text-text rounded-full font-sans font-medium text-base
                     shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl
                     hover:scale-105 active:scale-95 animate-fadeUp"
          style={{ animationDelay: '1.4s', opacity: 0 }}
        >
          여행 시작하기
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </PageContainer>
  );
}
