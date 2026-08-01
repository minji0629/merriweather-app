import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useApp } from '@/store/useApp';

export function HamburgerMenu() {
  const { user, logout, login } = useAuth();
  const { setCurrentPage, currentPage } = useApp();
  const [open, setOpen] = useState(false);

  const handleLoginClick = async () => {
    setOpen(false);
    try {
      await login(currentPage);
    } catch (e) {
      console.warn('[Kakao] login failed:', e);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    setOpen(false);
  };

  const handleNavigate = (page: 'landing' | 'nickname' | 'archive' | 'gift' | 'notice' | 'contact') => {
    setOpen(false);
    setCurrentPage(page);
  };

  const handleExternal = (url: string) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 right-5 z-40 flex flex-col items-center justify-center gap-1.5"
        aria-label="메뉴"
      >
        <span className="w-5 h-0.5 bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="w-5 h-0.5 bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="w-5 h-0.5 bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 z-50 w-64 h-full bg-base shadow-2xl animate-slideIn flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#E0DDD8]">
              <span className="font-batang text-lg text-text">메뉴</span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-text-sub hover:text-text transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
              {/* 로그인 / 로그아웃 */}
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-point/15 flex items-center justify-center">
                      <span className="font-batang text-sm text-point-dark">
                        {user.nickname.charAt(0)}
                      </span>
                    </div>
                    <span className="font-sans text-sm text-text">{user.nickname}님</span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text-sub
                               hover:bg-point/5 hover:text-text transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text
                             hover:bg-point/5 transition-colors"
                >
                  로그인
                </button>
              )}

              <div className="my-1 h-px bg-[#E0DDD8]" />

              {/* 보관함 */}
              <button
                onClick={() => handleNavigate('archive')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                보관함
              </button>

              {/* 선물하기 */}
              <button
                onClick={() => handleNavigate('gift')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                선물하기
              </button>

              <div className="my-1 h-px bg-[#E0DDD8]" />

              {/* 공지사항 */}
              <button
                onClick={() => handleNavigate('notice')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                공지사항
              </button>

              {/* 문의하기 */}
              <button
                onClick={() => handleNavigate('contact')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                문의하기
              </button>

              {/* 이용약관 */}
              <button
                onClick={() => handleExternal('https://merriweather.kr/terms')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                이용약관
              </button>

              {/* 개인정보처리방침 */}
              <button
                onClick={() => handleExternal('https://merriweather.kr/privacy')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
