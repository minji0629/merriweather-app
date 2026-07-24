import { useApp } from '@/store/useApp';
import { PageContainer } from '@/components/PageContainer';
import { X } from '@/components/Icons';

export function PaymentFailPage() {
  const { setCurrentPage } = useApp();

  return (
    <PageContainer className="bg-base">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-scaleIn">
          <X className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="font-batang text-2xl text-text mb-3 animate-fadeUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
          결제에 실패했어요.
        </h1>
        <p className="font-sans text-sm text-text-sub mb-8 animate-fadeUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
          다시 시도해주세요.
        </p>
        <button
          onClick={() => setCurrentPage('payment')}
          className="px-8 py-4 bg-point text-white rounded-full font-sans font-medium text-base
                     shadow-lg transition-all duration-300 hover:bg-point-dark hover:shadow-xl hover:scale-[1.02] active:scale-95
                     animate-fadeUp"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          다시 시도하기
        </button>
      </div>
    </PageContainer>
  );
}
