import type { PartialMinimalPair } from './shared';

export const vowelPairs: PartialMinimalPair[] = [
  {
    id: 'vowel-i-I',
    category: 'vowel',
    pairLabel: '/i/ vs /ɪ/',
    words: [
      { a: 'beat', b: 'bit', ipaA: '/biːt/', ipaB: '/bɪt/' },
      { a: 'seat', b: 'sit', ipaA: '/siːt/', ipaB: '/sɪt/' },
      { a: 'sheep', b: 'ship', ipaA: '/ʃiːp/', ipaB: '/ʃɪp/' },
      { a: 'heat', b: 'hit', ipaA: '/hiːt/', ipaB: '/hɪt/' },
      { a: 'feet', b: 'fit', ipaA: '/fiːt/', ipaB: '/fɪt/' },
    ],
    sentences: [
      { a: 'I can beat the record.', b: 'I can bit the apple.' },
      { a: 'Please take a seat.', b: 'Please sit down.' },
      { a: 'The sheep is white.', b: 'The ship is big.' },
    ],
    videoId: '',
    isVideoUnlocked: false,
  },
];
