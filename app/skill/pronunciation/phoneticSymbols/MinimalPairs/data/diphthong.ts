import type { PartialMinimalPair } from './shared';

export const diphthongPairs: PartialMinimalPair[] = [
  {
    id: 'diphthong-eI-aI',
    category: 'diphthong',
    pairLabel: '/eɪ/ vs /aɪ/',
    words: [
      { a: 'bay', b: 'buy', ipaA: '/beɪ/', ipaB: '/baɪ/' },
      { a: 'day', b: 'die', ipaA: '/deɪ/', ipaB: '/daɪ/' },
      { a: 'may', b: 'my', ipaA: '/meɪ/', ipaB: '/maɪ/' },
      { a: 'say', b: 'sigh', ipaA: '/seɪ/', ipaB: '/saɪ/' },
      { a: 'way', b: 'why', ipaA: '/weɪ/', ipaB: '/waɪ/' },
    ],
    sentences: [
      { a: 'The bay is beautiful.', b: 'I want to buy it.' },
      { a: 'What a lovely day!', b: 'I will never die.' },
      { a: 'May I help you?', b: 'This is my book.' },
    ],
    videoId: '',
    isVideoUnlocked: false,
  },
];
