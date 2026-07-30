export function BusinessFooter() {
  return (
    <footer className="w-full bg-[#14140f] text-white/50 font-sans">
      <div className="max-w-mobile mx-auto px-6 py-8 space-y-4">
        <div className="text-[11px] leading-[1.7] space-y-0.5">
          <p>상호: 릴 스튜디오</p>
          <p>대표자: 황민지</p>
          <p>사업자등록번호: 497-10-03495</p>
          <p>사업장 주소: 경상남도 창원시 마산회원구 회성동6길 14</p>
          <p>통신판매업 신고번호: 신고 완료 후 추가 예정</p>
          <p>이메일: merriweather.official@gmail.com</p>
          <p>
            문의:{' '}
            <a
              href="http://pf.kakao.com/_mxkcxnX"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70 transition-colors"
            >
              카카오톡 채널
            </a>
          </p>
        </div>

        <div className="text-[11px] leading-[1.7] text-white/40 pt-3 border-t border-white/10">
          <p>유선 상담은 운영하지 않습니다.</p>
          <p>문의사항은 카카오톡 채널을 통해 남겨주시면</p>
          <p>평일 10시~18시 내에 답변드립니다.</p>
        </div>

        <p className="text-[10px] text-white/30 pt-2">
          © 2026 릴 스튜디오. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
