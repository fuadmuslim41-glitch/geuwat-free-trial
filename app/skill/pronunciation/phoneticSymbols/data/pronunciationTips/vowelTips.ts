// Vowel pronunciation tips dataset
// Only /i/ data is included as it's the only one displayed in the free trial.

import type { SymbolPronunciationTips } from './types';

export const vowelTips: SymbolPronunciationTips = {
  i: [
    { tip: 'Angkat lidah bagian depan setinggi mungkin mendekati langit-langit keras, tanpa menyentuh.', category: 'tongue' },
    { tip: 'Tarik bibir sedikit melebar seperti senyum tipis; rahang tetap relatif tertutup.', category: 'lips' },
    { tip: 'Nyalakan suara (voiced) dan tahan bunyi sedikit lebih panjang.', category: 'voice' },
    { tip: 'Cek cepat: bandingkan dengan /ɪ/, bunyi /i/ harus lebih tegang dan lebih panjang.', category: 'general' },
  ],
};
