import { ResidentKey } from '@/constants/questions';
import { RESIDENTS } from '@/constants/residents';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const MODEL = 'claude-sonnet-4-6';

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== 'string') {
    throw new Error('Claude API: unexpected response shape');
  }
  return text.trim();
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
  const prompt = `당신은 메리웨더라는 자기발견 서비스의 안내자 루야.
사용자에게 따뜻한 편지를 써줘.
닉네임: ${nickname}
주민 유형: ${residentKey} (${RESIDENTS[residentKey].name})
편지 형식
- ${nickname}야, 로 시작
- 500자 내외
- 따뜻하고 진심 어린 문체
- Gowun Batang 폰트에 어울리는 문어체
- 마지막은 "— 루" 로 끝내기`;
  return callClaude(prompt);
}

/** 3. 루에게 질문하기 */
export async function answerQuestion(
  nickname: string,
  residentKey: ResidentKey,
  question: string,
): Promise<string> {
  const prompt = `당신은 메리웨더라는 자기발견 서비스의 안내자 루야.
사용자의 결과를 바탕으로 질문에 답해줘.
닉네임: ${nickname}
주민 유형: ${residentKey} (${RESIDENTS[residentKey].name})
질문: ${question}
답변 형식
- 200자 내외
- 따뜻하고 공감하는 문체
- 루의 말투로 (반말, 친근하게)
- "~야" 로 호칭`;
  return callClaude(prompt);
}
