import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { LANDING_BG } from '@/constants/images';
import { ArrowRight } from '@/components/Icons';
import { BusinessFooter } from '@/components/BusinessFooter';

export function LandingPage() {
  const { setCurrentPage } = useApp();
  return (
    <div className="flex flex-col">
      <PageContainer className="bg-base" footer={false}>
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={LANDING_BG}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center min-h-0 flex-1 px-6 pt-24 pb-12">
          <h1 className="font-playfair text-2xl font-bold text-white tracking-[0.15em] animate-fadeIn drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            MERRIWEATHER
          </h1>
          <p className="font-batang text-sm text-white mt-3 animate-fadeIn drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" style={{ animationDelay: '0.3s', opacity: 0 }}>
            나를 찾아 떠나는 여행
          </p>
          <div className="flex-1" />
          <button
            onClick={() => setCurrentPage('nickname')}
            className="group flex items-center gap-2 px-8 py-4 bg-white/95 text-text rounded-full font-sans font-medium text-base
                       shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl
                       hover:scale-105 active:scale-95 animate-fadeUp"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            여행 시작하기
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </PageContainer>
      <BusinessFooter />
    </div>
  );
}
