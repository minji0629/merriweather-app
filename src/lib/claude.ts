import { ResidentKey } from '@/constants/questions';
import { RESIDENTS } from '@/constants/residents';
import { vocative } from '@/lib/korean';

const API_URL = '/api/claude';

async function callClaude(prompt: string): Promise<string> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[Claude] Edge function 오류:', res.status, errBody);
      throw new Error(`Edge function error: ${res.status}`);
    }

    const data = await res.json();
    const text: string | undefined = data?.text;
    if (typeof text !== 'string' || !text) {
      console.error('[Claude] 예상치 못한 응답:', data);
      throw new Error('Unexpected response from edge function');
    }
    return text;
  } catch (err) {
    console.error('[Claude] API 호출 실패:', err);
    throw err;
  }
}

/** 1. 당신 안에 흐르는 결 */
export async function generateGaul(
  nickname: string,
  residentKey: ResidentKey,
): Promise<string> {
  const prompt = `당신은 메리웨더라는 자기발견 서비스의 안내자 루야.
사용자의 주민 유형을 바탕으로
"당신 안에 흐르는 결" 섹션을 작성해줘.
주민 유형: ${residentKey} (${RESIDENTS[residentKey].name})
닉네임: ${nickname}
같은 주민이어도 사람마다 다른 결이 있어.
200자 내외로 따뜻하고 섬세하게 작성해줘.
Gowun Batang 폰트에 어울리는 문어체로.
"당신은 ~" 으로 시작해줘.`;
  return callClaude(prompt);
}

/** 2. 루의 편지 */
export async function generateLetter(
  nickname: string,
  residentKey: ResidentKey,
): Promise<string> {
  const call = vocative(nickname);
  const prompt = `당신은 메리웨더라는 자기발견 서비스의 안내자 루야.
사용자에게 따뜻한 편지를 써줘.
닉네임: ${nickname}
주민 유형: ${residentKey} (${RESIDENTS[residentKey].name})
편지 형식
- ${call}, 로 시작
- 500자 내외
- 따뜻하고 진심 어린 문체
- Gowun Batang 폰트에 어울리는 문어체
- 마지막은 "— 루" 로 끝내기
닉네임 호칭 시 마지막 글자의 받침 여부에 따라
받침이 있으면 -아, 없으면 -야를 붙여줘.`;
  return callClaude(prompt);
}

/** 3. 루에게 질문하기 */
export async function answerQuestion(
  nickname: string,
  residentKey: ResidentKey,
  question: string,
): Promise<string> {
  const call = vocative(nickname);
  const prompt = `당신은 메리웨더라는 자기발견 서비스의 안내자 루야.
사용자의 결과를 바탕으로 질문에 답해줘.
닉네임: ${nickname}
주민 유형: ${residentKey} (${RESIDENTS[residentKey].name})
질문: ${question}
답변 형식
- 200자 내외
- 따뜻하고 공감하는 문체
- 루의 말투로 (반말, 친근하게)
- "${call}" 로 호칭
닉네임 호칭 시 마지막 글자의 받침 여부에 따라
받침이 있으면 -아, 없으면 -야를 붙여줘.`;
  return callClaude(prompt);
}
