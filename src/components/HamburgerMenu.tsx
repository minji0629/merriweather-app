import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useApp } from '@/store/useApp';

export function HamburgerMenu() {
  const { user, logout, showLogin } = useAuth();
  const { setCurrentPage } = useApp();
  const [open, setOpen] = useState(false);

  const handleLoginClick = () => {
    setOpen(false);
    showLogin();
  };

  const handleLogoutClick = async () => {
    await logout();
    setOpen(false);
  };

  const handleNavigate = (page: 'landing' | 'nickname') => {
    setOpen(false);
    setCurrentPage(page);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 right-5 z-40 w-10 h-10 flex flex-col items-center justify-center gap-1.5
                   bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
        aria-label="메뉴"
      >
        <span className="w-4 h-0.5 bg-text rounded-full" />
        <span className="w-4 h-0.5 bg-text rounded-full" />
        <span className="w-4 h-0.5 bg-text rounded-full" />
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

            <div className="flex-1 p-5 flex flex-col gap-2">
              <button
                onClick={() => handleNavigate('landing')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                홈
              </button>
              <button
                onClick={() => handleNavigate('nickname')}
                className="w-full text-left px-4 py-3 rounded-xl font-sans text-sm text-text hover:bg-point/5 transition-colors"
              >
                여행 시작하기
              </button>
            </div>

            <div className="p-5 border-t border-[#E0DDD8]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-point/15 flex items-center justify-center">
                      <span className="font-batang text-sm text-point-dark">
                        {user.nickname.charAt(0)}
                      </span>
                    </div>
                    <span className="font-sans text-sm text-text">{user.nickname}님</span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-3 bg-white border border-[#E0DDD8] rounded-xl font-sans text-sm text-text-sub
                               hover:text-text hover:border-point transition-all"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 bg-[#FEE500] text-[#3C1E1E] rounded-xl font-sans font-bold text-sm
                             shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  카카오 로그인
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
