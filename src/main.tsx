import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initKakao } from './lib/kakao';

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
console.log('[Kakao] VITE_KAKAO_JAVASCRIPT_KEY:', kakaoKey ? '설정됨' : '설정되지 않음');
if (!kakaoKey) {
  console.warn('[Kakao] Vercel 환경변수 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다. Vercel 프로젝트 설정 > Environment Variables에서 추가해주세요.');
}

initKakao()
  .then(() => console.log('[Kakao] SDK 초기화 완료'))
  .catch((err) => console.warn('[Kakao] SDK 초기화 실패:', err));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
