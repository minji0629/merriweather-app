import { AppProvider } from '@/store/AppProvider';
import { useApp } from '@/store/useApp';
import { LandingPage } from '@/pages/LandingPage';
import { NicknamePage } from '@/pages/NicknamePage';
import { TransitionPage } from '@/pages/TransitionPage';
import { LuPage } from '@/pages/LuPage';
import { QuestionPage } from '@/pages/QuestionPage';
import { LoadingPage } from '@/pages/LoadingPage';
import { ResultPage } from '@/pages/ResultPage';
import { PremiumResultPage } from '@/pages/PremiumResultPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { GiftPage } from '@/pages/GiftPage';
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage';
import { PaymentFailPage } from '@/pages/PaymentFailPage';

function Router() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'nickname':
      return <NicknamePage />;
    case 'transition':
      return <TransitionPage />;
    case 'lu':
      return <LuPage />;
    case 'question':
      return <QuestionPage />;
    case 'loading':
      return <LoadingPage />;
    case 'result':
      return <ResultPage />;
    case 'premium':
      return <PremiumResultPage />;
    case 'payment':
      return <PaymentPage />;
    case 'gift':
      return <GiftPage />;
    case 'paymentSuccess':
      return <PaymentSuccessPage />;
    case 'paymentFail':
      return <PaymentFailPage />;
    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
