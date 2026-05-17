import type { PartialMinimalPair } from './shared';

export const consonantPairs: PartialMinimalPair[] = [
  {
    id: 'consonant-p-b',
    category: 'consonant',
    pairLabel: '/p/ vs /b/',
    words: [
      { a: 'pat', b: 'bat', ipaA: '/pæt/', ipaB: '/bæt/' },
      { a: 'pear', b: 'bear', ipaA: '/peər/', ipaB: '/beər/' },
      { a: 'pin', b: 'bin', ipaA: '/pɪn/', ipaB: '/bɪn/' },
      { a: 'pack', b: 'back', ipaA: '/pæk/', ipaB: '/bæk/' },
      { a: 'pig', b: 'big', ipaA: '/pɪɡ/', ipaB: '/bɪɡ/' },
    ],
    sentences: [
      { a: 'Pat the dog gently.', b: 'The bat flew away.' },
      { a: 'I like pears.', b: 'I saw a bear.' },
      { a: 'Use a pin to fix it.', b: 'Put it in the bin.' },
    ],
    videoId: '',
    isVideoUnlocked: false,
  },
  {
    id: 'consonant-t-d',
    category: 'consonant',
    pairLabel: '/t/ vs /d/',
    words: [
      { a: 'ten', b: 'den', ipaA: '/ten/', ipaB: '/den/' },
      { a: 'town', b: 'down', ipaA: '/taʊn/', ipaB: '/daʊn/' },
      { a: 'tie', b: 'die', ipaA: '/taɪ/', ipaB: '/daɪ/' },
      { a: 'two', b: 'do', ipaA: '/tuː/', ipaB: '/duː/' },
      { a: 'tear', b: 'dear', ipaA: '/tɪər/', ipaB: '/dɪər/' },
    ],
    sentences: [
      { a: 'I have ten apples.', b: 'The bear is in the den.' },
      { a: 'We live in town.', b: 'Please sit down.' },
      { a: 'Tie your shoes.', b: 'We all die someday.' },
    ],
    videoId: '',
    isVideoUnlocked: false,
  },
];
