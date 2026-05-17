// Common letters and IPA mappings used by the Common Letters modal.
// Only /i/ data is included as it's the only one displayed in the free trial.

export interface CommonLetter {
  letter: string;
  ipaSymbol: string;
  description: string;
  examples: string[];
  category: 'vowel_lax' | 'vowel_tense' | 'diphthong' | 'consonant_voiceless' | 'consonant_voiced';
  pronunciationTip: string;
  traps?: string[];
}

export interface CommonLettersCategory {
  category: string;
  letters: CommonLetter[];
}

export const commonLettersData: CommonLettersCategory[] = [
  {
    category: 'TENSE VOWEL',
    letters: [
      {
        letter: 'ee, ea, e, ie, ei, y',
        ipaSymbol: '/i/',
        description: 'Pola ejaan produktif untuk /i/:',
        examples: [
          'ee -> see, green, meet',
          'ea -> eat, teacher, clean',
          'e -> me, he, these',
          'ie -> piece, field, belief',
          'ei -> receive, ceiling',
          'y -> happy, baby, city',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Lidah depan tinggi, bunyi tegang dan lebih panjang.',
        traps: ['Perhatikan pengecualian ejaan seperti friend (bukan /i/).'],
      },
    ],
  },
];

// Helper functions to get common letters data
export const getCommonLettersByCategory = (category: string): CommonLetter[] => {
  const categoryData = commonLettersData.find((cat) => cat.category === category);
  return categoryData ? categoryData.letters : [];
};

export const getCommonLetterByIPA = (ipaSymbol: string): CommonLetter | undefined => {
  for (const category of commonLettersData) {
    const letter = category.letters.find((item) => item.ipaSymbol === ipaSymbol);
    if (letter) return letter;
  }
  return undefined;
};

export const getCommonLetterByLetter = (letter: string): CommonLetter[] => {
  const results: CommonLetter[] = [];
  for (const category of commonLettersData) {
    const letters = category.letters.filter((item) => item.letter.toLowerCase() === letter.toLowerCase());
    results.push(...letters);
  }
  return results;
};

export const getAllCommonLetters = (): CommonLetter[] => {
  return commonLettersData.flatMap((category) => category.letters);
};

export const getCommonLettersCategories = (): string[] => {
  return commonLettersData.map((category) => category.category);
};
