export interface Choice {
  text: string;
  scores: DimensionScores;
  /** Q24 only: resident keys that get +1 weight */
  residentWeights?: ResidentKey[];
}

export interface DimensionScores {
  D1?: number;
  D2?: number;
  D3?: number;
  D4?: number;
  D5?: number;
  D6?: number;
}

export type Dimension = keyof DimensionScores;

export type ResidentKey =
  | 'guardian'
  | 'guide'
  | 'pioneer'
  | 'lightkeeper'
  | 'voyager'
  | 'wayfarer'
  | 'forestKeeper'
  | 'sculptor';

export interface Question {
  id: number;
  chapter: number;
  chapterName: string;
  question: string;
  choices: Choice[];
}

export const QUESTIONS: Question[] = [
  // ── Chapter 2 — 첫 번째 갈림길 (Q1~Q5) ──
  {
    id: 1,
    chapter: 2,
    chapterName: '첫 번째 갈림길',
    question: '설레는 마음으로 숲에 첫 발을 내딛었어.\n너는 무엇에 가장 먼저 눈길이 갈까?',
    choices: [
      { text: '멀리 펼쳐진 숲 전체를 바라본다', scores: { D1: 2, D4: 2 } },
      { text: '앞으로 이어진 길의 방향에 집중한다', scores: { D1: 1, D4: 1 } },
      { text: '발밑과 주변의 작은 흔적들을 따라 시선이 움직인다', scores: { D1: -1, D4: -1 } },
      { text: '나뭇잎 사이로 흔들리는 빛이나 움직임을 따라 시선이 간다', scores: { D1: -2, D4: -2 } },
    ],
  },
  {
    id: 2,
    chapter: 2,
    chapterName: '첫 번째 갈림길',
    question: '숲을 걷다가 갈림길이 나왔다.\n이 갈림길에서 너는 어떻게 해?',
    choices: [
      { text: '잠시 멈춰 서서 두 길을 충분히 비교해본다', scores: { D3: 2, D5: -2 } },
      { text: '짧게 생각하고 괜찮아 보이는 쪽으로 움직인다', scores: { D3: -1, D5: 1 } },
      { text: '주변을 살펴 단서나 흔적을 먼저 확인한다', scores: { D3: 1, D5: -1 } },
      { text: '생각할 것도 없이 발이 먼저 움직인다', scores: { D3: -2, D5: 2 } },
    ],
  },
  {
    id: 3,
    chapter: 2,
    chapterName: '첫 번째 갈림길',
    question: '걷던 중 숲 어딘가에서 작은 움직임이 느껴진다.\n그 순간 너의 행동은 어때?',
    choices: [
      { text: '즉시 멈춰 상황을 파악하려 한다', scores: { D4: -1, D5: -1 } },
      { text: '가까이 다가가 직접 확인해본다', scores: { D4: 2, D5: 2 } },
      { text: '조용히 거리를 두고 지켜본다', scores: { D4: -2, D5: -2 } },
      { text: '별다른 의미가 없다고 생각하고 계속 걸어간다', scores: { D4: 1, D5: 1 } },
    ],
  },
  {
    id: 4,
    chapter: 2,
    chapterName: '첫 번째 갈림길',
    question: '앞에 쓰러진 나무로 길이 막혀 있다.\n너는 어떻게 해결할거야?',
    choices: [
      { text: '다른 길이 있는지 먼저 찾는다', scores: { D3: 1, D5: -1 } },
      { text: '직접 넘거나 치우는 방법을 시도한다', scores: { D3: -2, D5: 2 } },
      { text: '잠시 멈춰 상황을 파악한 뒤 가장 나은 방법을 찾는다', scores: { D3: 2, D5: -2 } },
      { text: '주변에 도움을 요청할 수 있는 사람이 있는지 살펴본다', scores: { D3: -1, D5: 1 } },
    ],
  },
  {
    id: 5,
    chapter: 2,
    chapterName: '첫 번째 갈림길',
    question: '잠시 숲 속에 가만히 서 있다.\n이 순간 가장 가까운 느낌은?',
    choices: [
      { text: '조용하고 편안하다', scores: { D1: -2, D4: -2 } },
      { text: '낯설지만 흥미롭다', scores: { D1: 1, D4: 1 } },
      { text: '더 깊이 들어가고 싶어진다', scores: { D1: 2, D4: 2 } },
      { text: '조심스럽고 약간 긴장된 느낌이 든다', scores: { D1: -1, D4: -1 } },
    ],
  },
  // ── Chapter 3 — 오래된 흔적 (Q6~Q10) ──
  {
    id: 6,
    chapter: 3,
    chapterName: '오래된 흔적',
    question: '낡은 표지판 하나가 나무에 걸려 있다. 글씨는 거의 지워져 있다.\n너는 어떤 생각이 들어?',
    choices: [
      { text: '누가 남겼을지 잠시 떠올려본다', scores: { D2: -1, D6: -1 } },
      { text: '왜 이렇게 됐는지 이유를 생각해본다', scores: { D2: 1, D6: 1 } },
      { text: '잠시 눈길이 가지만 발걸음은 계속 이어간다', scores: { D2: -2, D6: -2 } },
      { text: '눈에 들어오지 않고 그냥 지나친다', scores: { D2: 2, D6: 2 } },
    ],
  },
  {
    id: 7,
    chapter: 3,
    chapterName: '오래된 흔적',
    question: '오래전부터 사람들이 다닌 듯한 길이 이어져 있다.\n이 길을 걸으면서 너는 어떤 쪽이야?',
    choices: [
      { text: '이 길을 걸었던 사람들을 떠올리며 따라간다', scores: { D2: -2, D6: -2 } },
      { text: '왜 이런 길이 생겼는지 생각해본다', scores: { D2: 2, D6: 2 } },
      { text: '분위기를 느끼며 천천히 걷는다', scores: { D2: -1, D6: -1 } },
      { text: '별 관심이 없다', scores: { D2: 1, D6: 1 } },
    ],
  },
  {
    id: 8,
    chapter: 3,
    chapterName: '오래된 흔적',
    question: '숲길에 누군가가 남긴 작은 표시가 있다. 방향처럼 보인다.\n너는 어떻게 해?',
    choices: [
      { text: '표시를 따라가기 전에 다른 단서도 더 찾아보고 결정한다', scores: { D3: 2, D6: -1 } },
      { text: '일단 따라가보기로 한다', scores: { D3: -2, D6: -1 } },
      { text: '이 표시가 어떤 의미일지 생각하며 천천히 따라간다', scores: { D3: -1, D6: -2 } },
      { text: '목적지에 빨리 도착하는 데 이 표시가 도움이 될지 판단하고 결정한다', scores: { D3: 1, D6: 2 } },
    ],
  },
  {
    id: 9,
    chapter: 3,
    chapterName: '오래된 흔적',
    question: '흔적이 계속 이어지고 있다. 끝이 보이지 않는다.\n걸으면서 어떤 생각이 들어?',
    choices: [
      { text: '이걸 남긴 사람은 어디까지 갔을까 궁금해진다', scores: { D2: -2, D6: -1 } },
      { text: '이 흔적이 어떤 의미인지 파악하고 싶어진다', scores: { D2: 2, D6: -1 } },
      { text: '끝이 어디든 걷는 것 자체가 좋다는 생각이 든다', scores: { D2: -1, D6: -2 } },
      { text: '끝이 어딘지 직접 확인하고 싶어진다', scores: { D2: 1, D6: 2 } },
    ],
  },
  {
    id: 10,
    chapter: 3,
    chapterName: '오래된 흔적',
    question: '오래된 흔적 앞에 잠시 서 있다.\n이 순간 가장 가까운 느낌은 뭐야?',
    choices: [
      { text: '누군가의 이야기를 마주한 느낌이다', scores: { D2: -2, D6: -2 } },
      { text: '이 흔적이 어떤 구조인지 궁금하다', scores: { D2: 2, D6: 2 } },
      { text: '그냥 오래된 것이라 인상 깊다', scores: { D2: -1, D6: -1 } },
      { text: '별다른 의미가 느껴지지 않는다', scores: { D2: 1, D6: 1 } },
    ],
  },
  // ── Chapter 4 — 숲속의 쉼터 (Q11~Q15) ──
  {
    id: 11,
    chapter: 4,
    chapterName: '숲속의 쉼터',
    question: '쉼터에 몇 명의 사람들이 앉아 있다.\n이 쉼터에 들어가면 너는 보통 어떻게 해?',
    choices: [
      { text: '자연스럽게 사람들 사이로 들어간다', scores: { D1: 2, D5: 2 } },
      { text: '먼저 전체적인 분위기를 살피고 들어간다', scores: { D1: 1, D5: -1 } },
      { text: '조용히 한쪽에 자리잡고 상황을 지켜본다', scores: { D1: -1, D5: -2 } },
      { text: '그냥 지나치거나 따로 행동한다', scores: { D1: -2, D5: 1 } },
    ],
  },
  {
    id: 12,
    chapter: 4,
    chapterName: '숲속의 쉼터',
    question: '쉼터에 잠시 머물고 있다.\n사람들 사이에서 너는 보통 어떤 편이야?',
    choices: [
      { text: '자연스럽게 사람들 속으로 섞여 든다', scores: { D1: 2, D2: -2 } },
      { text: '필요할 때만 대화에 참여한다', scores: { D1: 1, D2: -1 } },
      { text: '조용히 주변을 살펴보는 편이다', scores: { D1: -1, D2: 1 } },
      { text: '혼자 있는 게 더 편하다', scores: { D1: -2, D2: 2 } },
    ],
  },
  {
    id: 13,
    chapter: 4,
    chapterName: '숲속의 쉼터',
    question: '누군가 너에게 말을 건다.\n이럴 때 너는 어떤 식으로 반응해?',
    choices: [
      { text: '자연스럽게 대화를 이어간다', scores: { D1: 2, D2: -1 } },
      { text: '상대의 이야기를 먼저 듣고 반응한다', scores: { D1: 1, D2: -2 } },
      { text: '짧게 반응하고 상황을 지켜본다', scores: { D1: -1, D2: 1 } },
      { text: '대화에서 빠져나오는 쪽을 선택한다', scores: { D1: -2, D2: 2 } },
    ],
  },
  {
    id: 14,
    chapter: 4,
    chapterName: '숲속의 쉼터',
    question: '쉼터에서 쉬고 있는데\n예상보다 시간이 많이 지나\n원래 계획대로 움직이기 어려울 것 같아.\n너는 어떻게 해?',
    choices: [
      { text: '바로 일어나 계획을 다시 조정하고 움직인다', scores: { D3: 2, D5: 2 } },
      { text: '잠깐 멈추고 어떻게 하면 좋을지 먼저 생각해본다', scores: { D3: 1, D5: -1 } },
      { text: '계획보다 지금 이 순간이 더 중요하다고 생각한다', scores: { D3: -1, D5: -2 } },
      { text: '일단 움직이면서 상황에 맞게 맞춰간다', scores: { D3: -2, D5: 1 } },
    ],
  },
  {
    id: 15,
    chapter: 4,
    chapterName: '숲속의 쉼터',
    question: '누군가 힘든 감정을 털어놓고 있다.\n너는 보통 어떤 사람이야?',
    choices: [
      { text: '적극적으로 공감하며 함께 이야기를 나눈다', scores: { D1: 2, D6: -2 } },
      { text: '조용히 옆에 있어주는 것으로 충분하다', scores: { D1: -2, D6: -1 } },
      { text: '어떻게 해결할 수 있을지 함께 찾아본다', scores: { D1: 1, D6: 2 } },
      { text: '어떻게 하면 나아질 수 있을지 혼자 조용히 생각해보게 된다', scores: { D1: -1, D6: 1 } },
    ],
  },
  // ── Chapter 5 — 깊은 숲 (Q16~Q20) ──
  {
    id: 16,
    chapter: 5,
    chapterName: '깊은 숲',
    question: '숲길이 두 갈래로 이어진다.\n하나는 사람들이 많이 지나간 흔적이 넓게 남아 있는 길\n하나는 발자국이 거의 남지 않은 좁은 길\n너라면 어느 쪽으로 발걸음이 향할 것 같아?',
    choices: [
      { text: '흔적이 넓게 남아 있는 길로 간다', scores: { D4: -2, D5: -1 } },
      { text: '발자국이 거의 없는 길로 들어가본다', scores: { D4: 2, D5: 2 } },
      { text: '두 길을 비교하면서 더 나은 방향을 판단한다', scores: { D4: -1, D5: -2 } },
      { text: '딱히 이유 없이 끌리는 쪽으로 발걸음이 향한다', scores: { D4: 1, D5: 1 } },
    ],
  },
  {
    id: 17,
    chapter: 5,
    chapterName: '깊은 숲',
    question: '숲길에 오래된 작은 다리가 있다. 일부가 흔들린다.\n이 다리 앞에서 너는 어떻게 할 것 같아?',
    choices: [
      { text: '조심해서 그대로 건넌다', scores: { D4: -1, D5: 1 } },
      { text: '다리를 흔들어보고 안전을 확인한다', scores: { D4: 1, D5: 2 } },
      { text: '주변을 살펴 다른 방법을 찾아본다', scores: { D4: -2, D5: -1 } },
      { text: '건너지 않고 우회 경로를 찾는다', scores: { D4: -2, D5: -2 } },
    ],
  },
  {
    id: 18,
    chapter: 5,
    chapterName: '깊은 숲',
    question: '숲길에서 갈림길을 만났다.\n표지판이 있지만 글씨가 흐릿하게 지워져 있어\n방향만 겨우 알아볼 수 있다.\n이럴 때 너는 어떻게 해?',
    choices: [
      { text: '표지판에서 알아볼 수 있는 방향대로 일단 움직인다', scores: { D3: 1, D5: 2 } },
      { text: '깊게 생각하지 않고 느낌 가는 방향으로 간다', scores: { D3: -2, D5: 1 } },
      { text: '주변을 둘러보며 힌트가 될 만한 것을 찾아본다', scores: { D3: 2, D5: -1 } },
      { text: '잠시 서서 어느 쪽이 맞을지 머릿속으로 따져본다', scores: { D3: 1, D5: -2 } },
    ],
  },
  {
    id: 19,
    chapter: 5,
    chapterName: '깊은 숲',
    question: '일행과 함께 걷다가 어느 순간 서로 떨어지게 됐다.\n주변은 숲길이고 방향이 잠시 헛갈리는 상태다.\n이 순간 너는 가장 먼저 어떻게 해?',
    choices: [
      { text: '잠시 멈추고 주변을 살펴 어느 방향으로 가야 할지 파악한다', scores: { D3: 1, D5: -1 } },
      { text: '일행이 갔을 것 같은 방향을 떠올리며 바로 움직인다', scores: { D3: -1, D5: 1 } },
      { text: '왔던 길을 기억해서 되돌아가 다시 만날 지점을 찾는다', scores: { D3: 2, D5: 2 } },
      { text: '일단 계속 걸으면서 상황이 해결되길 기다린다', scores: { D3: -2, D5: -2 } },
    ],
  },
  {
    id: 20,
    chapter: 5,
    chapterName: '깊은 숲',
    question: '숲길이 두 갈래로 나뉜다.\n한쪽은 길이 익숙하게 이어지지만 돌아가야 해서 시간이 오래 걸린다.\n다른 한쪽은 지름길처럼 보이지만 지형이 험하고 위험 요소가 있다.\n이 갈림길 앞에서 너는 어떤 선택을 할 것 같아?',
    choices: [
      { text: '익숙하고 안전해 보이는 길을 선택한다', scores: { D4: -2, D5: -2 } },
      { text: '빠르게 도착할 수 있어 보이는 길을 선택한다', scores: { D4: 2, D5: 2 } },
      { text: '두 길의 장단점을 생각해보고 결정한다', scores: { D4: -1, D5: -1 } },
      { text: '잠깐 실제로 걸어보며 길의 느낌을 확인한다', scores: { D4: 1, D5: 1 } },
    ],
  },
  // ── Chapter 6 — 중심의 나무 (Q21~Q25) ──
  {
    id: 21,
    chapter: 6,
    chapterName: '중심의 나무',
    question: '루의 말\n"이제 곧 숲을 떠나게 될 거야."\n"하지만 사람마다..."\n"오래도록 마음속에 남는 건 조금씩 다르더라."\n"너라면 무엇이 가장 오래 마음에 남을 것 같아?"',
    choices: [
      { text: '함께 걸으며 느꼈던 시간들', scores: { D6: -2 } },
      { text: '숲을 걸으며 새롭게 알게 된 나', scores: { D6: -1 } },
      { text: '끝까지 걸어오며 해낼 수 있다는 걸 알게 된 순간', scores: { D6: 1 } },
      { text: '결국 숲의 끝에 도착했다는 사실', scores: { D6: 2 } },
    ],
  },
  {
    id: 22,
    chapter: 6,
    chapterName: '중심의 나무',
    question: '루의 말\n"숲에서는..."\n"생각했던 대로 흘러가는 날도 있었고."\n"전혀 예상하지 못한 길을 만나기도 했지."\n"그럴 때 너는 어떤 모습에 가장 가까울 것 같아?"',
    choices: [
      { text: '가능하면 처음 정한 계획대로 다시 길을 이어가려고 한다', scores: { D3: 2 } },
      { text: '큰 방향은 그대로 두되, 필요한 만큼만 계획을 조정한다', scores: { D3: 1 } },
      { text: '처음 계획에 얽매이지 않고, 상황에 맞는 선택을 이어간다', scores: { D3: -1 } },
      { text: '처음 계획보다 지금의 흐름을 믿고 자연스럽게 방향을 바꾼다', scores: { D3: -2 } },
    ],
  },
  {
    id: 23,
    chapter: 6,
    chapterName: '중심의 나무',
    question: '루의 말\n"이 숲에서는..."\n"가끔 누구도 예상하지 못한 일이 일어나곤 해."\n"그럴 때 사람들은 저마다 다른 방식으로 그 일을 마주하더라."\n"너는 가장 먼저 어떤 쪽으로 마음이 움직일 것 같아?"',
    choices: [
      { text: '왜 이런 일이 생겼는지 궁금해서 끝까지 알아보고 싶어진다', scores: { D2: -2 } },
      { text: '비슷한 일이 반복되지 않도록 무엇이 원인이었는지 먼저 이해하고 싶어진다', scores: { D2: -1 } },
      { text: '원인을 따지기보다 지금 당장 움직이는 게 먼저다', scores: { D2: 1 } },
      { text: '앞으로 비슷한 일이 반복되지 않도록 기준이나 방법부터 만들고 싶어진다', scores: { D2: 2 } },
    ],
  },
  {
    id: 24,
    chapter: 6,
    chapterName: '중심의 나무',
    question: '루의 말\n"앞에는 아직 아무도 가보지 않은 길이 하나 있어."\n"꼭 가야 하는 건 아니야."\n"이 길을 바라본 순간, 가장 먼저 어떤 마음이 들 것 같아?"',
    choices: [
      {
        text: '"뭔가 재미있는 일이 기다리고 있을 것 같은데?"',
        scores: {},
        residentWeights: ['pioneer', 'voyager'],
      },
      {
        text: '"저 길에서는 어떤 사람들을 만날 수 있을까?"',
        scores: {},
        residentWeights: ['wayfarer', 'lightkeeper'],
      },
      {
        text: '"힘들어 보이긴 하지만... 그래서 더 가보고 싶다."',
        scores: {},
        residentWeights: ['pioneer', 'guide'],
      },
      {
        text: '"굳이 지금 새로운 길로 갈 필요는 없을 것 같다."',
        scores: {},
        residentWeights: ['guardian', 'forestKeeper'],
      },
    ],
  },
  {
    id: 25,
    chapter: 6,
    chapterName: '중심의 나무',
    question: '루의 말\n"숲의 끝이 보이기 시작했어."\n"이제 곧 너는 이 숲을 떠나게 될 거야."\n"뒤를 돌아보니,"\n"네가 걸어온 길은 어느새 숲속으로 천천히 사라지고 있었어."\n"그 순간, 가장 먼저 드는 마음은 뭐야?"',
    choices: [
      { text: '"끝이라기보다 또 다른 시작처럼 느껴진다."', scores: { D4: 2, D6: 1 } },
      { text: '"이 숲을 나답게 기억하고 싶다."', scores: { D4: -1, D6: -1 } },
      { text: '"걸어온 길 자체가 소중하게 느껴진다."', scores: { D4: -2, D6: -2 } },
      { text: '"여기까지 해냈다는 게 뿌듯하다."', scores: { D4: 1, D6: 2 } },
    ],
  },
];

export const TOTAL_QUESTIONS = 25;
