// Symbol Speech Map - Configuration for TTS pronunciation of phonetic symbols
// Only /i/ data is included as it's the only one displayed in the free trial.

export interface SymbolSpeechProfile {
  prompt: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const defaultProfile: SymbolSpeechProfile = {
  prompt: '',
  rate: 0.8,
  pitch: 1.0,
  volume: 1.0,
};

// Map of phonetic symbols to their speech profiles
const symbolSpeechMap: Record<string, SymbolSpeechProfile> = {
  // Vowels - Tense
  'i': { prompt: 'ee', rate: 0.7, pitch: 1.0, volume: 1.0 },
};

export function getSymbolSpeechProfile(symbol: string): SymbolSpeechProfile {
  return symbolSpeechMap[symbol] || { ...defaultProfile, prompt: symbol };
}

export function hasSymbolSpeechProfile(symbol: string): boolean {
  return symbol in symbolSpeechMap;
}
