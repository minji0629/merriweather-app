import { ResidentKey } from '@/constants/questions';
import { RESIDENTS } from '@/constants/residents';
import { vocative } from '@/lib/korean';

const API_URL = '/api/claude';

const RESIDENT_LABELS: Record<ResidentKey, string> = {
  guardian: '파수꾼',
  guide: '길잡이',
  pioneer: '개척가',
  lightkeeper: '등불지기',
  voyager: '항해자',
  wayfarer: '여행자',
  forestKeeper: '숲지기',
  sculptor: '조각가',
};

const RESIDENT_GUAL_DESCRIPTIONS: Record<ResidentKey, string> = {
  guardian: '세상을 조용히 관찰하고 깊이 이해하는 사람',
  guide: '옳은 방향을 찾고 원칙을 중요시하는 사람',
  pioneer: '멈추지 않고 새로운 것을 만들어가는 사람',
  lightkeeper: '사람의 마음을 먼저 살피고 곁을 지키는 사람',
  voyager: '새로운 곳을 향해 자유롭게 나아가는 사람',
  wayfarer: '사람과 사람을 연결하고 새로운 시작을 만드는 사람',
  forestKeeper: '소중한 것을 지키고 오래도록 함께하는 사람',
  sculptor: '마음속 것을 세상에 표현하고 싶어하는 사람',
};

const RESIDENT_LETTER_DESCRIPTIONS: Record<ResidentKey, string> = {
  guardian: '세상을 천천히 깊이 이해하려 하고, 빠른 판단보다 충분히 살피는 것을 선호해. 느리다고 생각할 수 있지만 사실 제대로 보고 있는 거야. 혼자 생각이 많고, 이해받지 못한다는 느낌을 자주 받아.',
  guide: '옳은 방향을 찾는 게 중요해서 기준이 흔들리면 불안해해. 원칙을 지키려다 까다롭다는 말을 듣기도 해. 사실은 제대로 하고 싶은 마음이 큰 거야.',
  pioneer: '멈춰 있는 게 힘들고, 뭔가 계속 움직여야 살아있는 것 같아. 쉬어야 할 때도 멈추지 못하고, 더 해야 한다는 압박을 스스로 만들어.',
  lightkeeper: '다른 사람의 감정을 내 것처럼 느끼고, 먼저 챙기다가 지치는 경우가 많아. 내가 더 잘해줬어야 했는데 라는 생각을 자주 해.',
  voyager: '한 곳에 오래 있으면 답답하고, 새로운 것이 있으면 자연스럽게 끌려. 정착을 못 하는 건가 싶을 때도 있지만 사실 더 넓은 곳을 향하고 있는 거야.',
  wayfarer: '사람이 좋고 연결이 끊어지는 게 힘들어. 모든 관계를 붙잡으려다 지치기도 해. 사실은 진짜로 연결되고 싶은 마음이 큰 거야.',
  forestKeeper: '변화보다 익숙한 것이 편하고, 소중한 것을 잃는 게 두려워. 변화를 싫어하는 게 아니라 지키고 싶은 것이 있는 거야.',
  sculptor: '느끼는 것이 너무 많아서 담아두면 가득 차버려. 예민하다는 말을 자주 듣지만 사실 더 많이 느끼는 사람인 거야.',
};

async function callClaude(prompt: string): Promise<string> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[Claude] API 오류:', res.status, errBody);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const text: string | undefined = data?.text;
    if (typeof text !== 'string' || !text) {
      console.error('[Claude] 예상치 못한 응답:', data);
      throw new Error('Unexpected response from API');
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
  resident1: ResidentKey,
  resident2: ResidentKey,
): Promise<string> {
  const r1 = `${RESIDENT_LABELS[resident1]}(${resident1}): ${RESIDENT_GUAL_DESCRIPTIONS[resident1]}`;
  const r2 = `${RESIDENT_LABELS[resident2]}(${resident2}): ${RESIDENT_GUAL_DESCRIPTIONS[resident2]}`;
  const prompt = `당신은 사람의 내면을 섬세하게 읽는 글쓴이야.
아래 두 가지 유형의 조합으로 이 사람만이 가진 고유한 결을 써줘.
첫번째 주민: ${r1}
두번째 주민: ${r2}
닉네임: ${nickname}
두 유형이 이 사람 안에서 어떻게 섞여 있는지,
그 조합이 만들어내는 이 사람만의 독특한 면모를 써줘.
단순히 두 유형을 나열하지 말고,
둘이 만나서 생기는 새로운 특징을 찾아줘.
예를 들어
파수꾼 + 조각가 조합이면
"관찰하고 기억하는 능력이 표현 욕구와 만나서
남들이 지나치는 것에서 아름다움을 발견하고
그것을 언어나 형태로 남기고 싶어하는 사람"
처럼.
형식
- 300자 내외
- "당신은 ~" 으로 시작
- 따뜻하고 섬세한 문어체
- Gowun Batang 폰트에 어울리는 문장
- 줄바꿈 자연스럽게
마지막 문장은 반드시 이 사람을 향한 따뜻한 격려나 응원으로 끝내줘.
예) '그 결이 당신을 특별하게 만들어요.'
    '그 조합이 당신만의 빛이에요.' 같은 느낌으로.`;
  return callClaude(prompt);
}

/** 2. 루의 편지 */
export async function generateLetter(
  nickname: string,
  resident1: ResidentKey,
  resident2: ResidentKey,
): Promise<string> {
  const call = vocative(nickname);
  const desc = `${RESIDENT_LETTER_DESCRIPTIONS[resident1]} 또한 ${RESIDENT_LETTER_DESCRIPTIONS[resident2]}`;
  const prompt = `너는 이 사람을 오래 지켜봐온 따뜻한 상담 선생님이야.
상대방을 깊이 이해하고 있지만, 절대 단정 짓지 않아.
반말이지만 조심스럽고 부드럽게 말해.
단정짓지 말고 '~일 수도 있어', '~지 않았어?', '~했을 것 같아' 처럼
여지를 두는 표현을 써.
사용자가 스스로 고개를 끄덕이게 만드는 공감으로.
루는 다 알고 있지만 강요하지 않는 느낌으로.
닉네임: ${nickname}
이 사람의 성향: ${desc}
편지에 꼭 들어가야 할 것
- 이 사람이 자주 하는 생각이나 고민
- 그게 사실은 단점이 아니라는 것 (단정짓지 말고 여지를 두어서)
- 이 사람이 가진 힘과 가능성
- 앞으로도 괜찮을 거라는 진심 어린 응원
절대 넣으면 안 되는 것
- 메리웨더, 기억의 숲, 주민 같은 서비스 용어
- "당신의 여정" 같은 거창한 표현
- "너는 ~한 사람이야" 같은 단정적인 문장
- AI가 쓴 것처럼 느껴지는 공식적인 문장
형식
- ${call}, 로 시작
- 800자 내외 (충분히 길게)
- 따뜻한 상담 선생님의 말투 (반말, 조심스럽고 부드럽게)
- 단정짓지 말고 여지를 두는 표현 사용
- 줄바꿈 자연스럽게
- 편지 마지막에 '— 루' 바로 전에 이 사람에 대한 진심 어린 응원이나
  앞으로도 괜찮을 거라는 따뜻한 말로 마무리해줘.
  너무 거창하지 않게, 친구가 마지막으로 건네는 말처럼 자연스럽게.
- 마지막은 "— 루" 로 끝내기`;
  return callClaude(prompt);
}

/** 3. 루에게 질문하기 (대화 이어가기) */
export async function answerQuestion(
  nickname: string,
  resident1: ResidentKey,
  resident2: ResidentKey,
  question: string,
  history: { question: string; answer: string }[] = [],
): Promise<string> {
  const call = vocative(nickname);
  const desc = `${RESIDENT_LABELS[resident1]}과 ${RESIDENT_LABELS[resident2]}의 기질을 함께 가진 사람`;

  const historyBlock =
    history.length > 0
      ? `\n지금까지 나눈 대화:\n${history
          .map((h, i) => `대화 ${i + 1}\n나: ${h.question}\n루: ${h.answer}`)
          .join('\n\n')}\n`
      : '';

  const prompt = `너는 이 사람을 오래 지켜봐온 따뜻한 상담 선생님이야.
반말이지만 조심스럽고 부드럽게 말해.
단정짓지 말고 '~일 수도 있어', '~지 않았어?', '~했을 것 같아' 처럼
여지를 두는 표현을 써.
이 사람의 성향: ${desc}
닉네임: ${nickname}
${historyBlock}
이번 질문: ${question}
답변 형식
- 200자 내외
- 따뜻하고 공감하는 문체 (반말, 조심스럽고 부드럽게)
- 단정짓지 말고 여지를 두는 표현 사용
- "${call}" 로 호칭
- 이전 대화 내용을 반영해서 자연스럽게 이어지는 답변
- 메리웨더, 기억의 숲, 주민 같은 서비스 용어 절대 쓰지 마
- 줄바꿈 자연스럽게`;
  return callClaude(prompt);
}
