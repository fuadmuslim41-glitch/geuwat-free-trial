'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Play, Pause, Lightbulb, Database, HelpCircle, Book, Copy, ChevronDown, Sparkles, Mic, CheckCircle2, Award } from 'lucide-react';
import '../styles/detail.css';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../components/buttonSavedProgress';
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';
import type { WordExample } from '../data/wordExamples/wordExamples';
import type { CommonLetter } from '../data/commonLetters/CommonLetters';

const RecordingControlsButton = dynamic(() => import('../../../components/RecordingControlsButton'), {
  ssr: false,
});
const CommonLettersModal = dynamic(() => import('./components/CommonLettersModal'), {
  ssr: false,
});

const VOWEL_LAX_SYMBOLS = ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a'] as const;
const VOWEL_TENSE_SYMBOLS = ['\u0251', 'i', 'u', '\u00e6', '\u0254'] as const;
const CONSONANT_VOICELESS_SYMBOLS = ['p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h'] as const;
const CONSONANT_VOICED_SYMBOLS = [
  'b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y',
] as const;
const DIPHTHONG_SYMBOLS = ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'] as const;

const toTourToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function getBaseGroup(category: string): 'vowel' | 'consonant' | 'diphthong' | null {
  if (category.startsWith('vowel')) return 'vowel';
  if (category.startsWith('consonant')) return 'consonant';
  if (category === 'diphthong') return 'diphthong';
  return null;
}

function getSymbolNavGroups(category: string): Array<{ title: string; symbols: readonly string[] }> {
  const baseGroup = getBaseGroup(category);
  if (baseGroup === 'vowel') {
    return [
      { title: 'Vowel Lax', symbols: VOWEL_LAX_SYMBOLS },
      { title: 'Vowel Tense', symbols: VOWEL_TENSE_SYMBOLS },
    ];
  }
  if (baseGroup === 'consonant') {
    return [
      { title: 'Consonant Voiceless', symbols: CONSONANT_VOICELESS_SYMBOLS },
      { title: 'Consonant Voiced', symbols: CONSONANT_VOICED_SYMBOLS },
    ];
  }
  if (baseGroup === 'diphthong') {
    return [{ title: 'Diphthong Symbols', symbols: DIPHTHONG_SYMBOLS }];
  }
  return [];
}

type BritishWordNote = {
  word: string;
  britishIpa: string;
  americanIpa: string;
};

type BritishSymbolNote = {
  description: string;
  items: BritishWordNote[];
};

type SymbolDetailSectionState = {
  practice?: boolean;
  tips?: boolean;
  video?: boolean;
  prompt?: boolean;
};

const BRITISH_NOTES_BY_SYMBOL: Record<string, BritishSymbolNote> = {
  '\u0254': {
    description: 'Beberapa kata contoh di simbol ini sering ditulis/terdengar gaya British. TTS American biasanya memakai vokal lebih ke /?/.',
    items: [
      { word: 'hot', britishIpa: '/h?t/', americanIpa: '/h?t/' },
      { word: 'not', britishIpa: '/n?t/', americanIpa: '/n?t/' },
      { word: 'lot', britishIpa: '/l?t/', americanIpa: '/l?t/' },
      { word: 'top', britishIpa: '/t?p/', americanIpa: '/t?p/' },
      { word: 'shop', britishIpa: '/??p/', americanIpa: '/??p/' },
      { word: 'box', britishIpa: '/b?ks/', americanIpa: '/b?ks/' },
      { word: 'fox', britishIpa: '/f?ks/', americanIpa: '/f?ks/' },
    ],
  },
  h: {
    description: 'Untuk beberapa kata dengan huruf h + o, model American biasanya tidak memakai bunyi /?/ British.',
    items: [
      { word: 'hot', britishIpa: '/h?t/', americanIpa: '/h?t/' },
      { word: 'holiday', britishIpa: "/'h?l?de?/", americanIpa: "/'h?l?de?/" },
    ],
  },
  w: {
    description: 'Khusus kata tertentu, pelafalan American punya ciri tambahan seperti flap /?/ dan r-colored vowel.',
    items: [
      { word: 'water', britishIpa: "/'w??t?/", americanIpa: "/'w???/" },
    ],
  },
  '\u025a': {
    description: 'Akhiran -er pada daftar ini kadang ditulis non-rhotic (gaya British). American biasanya memakai /?/ atau /?r/.',
    items: [
      { word: 'teacher', britishIpa: "/'ti?t??/", americanIpa: "/'ti?t??/" },
      { word: 'doctor', britishIpa: "/'d?kt?/", americanIpa: "/'d?kt?/" },
      { word: 'water', britishIpa: "/'w??t?/", americanIpa: "/'w???/" },
      { word: 'later', britishIpa: "/'le?t?/", americanIpa: "/'le???/" },
    ],
  },
  'e\u0259': {
    description: 'Simbol ini sangat umum di British. Dalam American, banyak kata biasanya terdengar lebih rhotic (pakai /r/).',
    items: [
      { word: 'care', britishIpa: '/ke\u0259/', americanIpa: '/k\u025Br/' },
      { word: 'share', britishIpa: '/\u0283e\u0259/', americanIpa: '/\u0283\u025Br/' },
      { word: 'fair', britishIpa: '/fe\u0259/', americanIpa: '/f\u025Br/' },
      { word: 'bear', britishIpa: '/be\u0259/', americanIpa: '/b\u025Br/' },
    ],
  },
  '\u026A\u0259': {
    description: 'Di British sering ditulis /\u026A\u0259/. Dalam American biasanya lebih dekat ke /\u026Ar/.',
    items: [
      { word: 'near', britishIpa: '/n\u026A\u0259/', americanIpa: '/n\u026Ar/' },
      { word: 'clear', britishIpa: '/kl\u026A\u0259/', americanIpa: '/kl\u026Ar/' },
      { word: 'fear', britishIpa: '/f\u026A\u0259/', americanIpa: '/f\u026Ar/' },
      { word: 'year', britishIpa: '/j\u026A\u0259/', americanIpa: '/j\u026Ar/' },
    ],
  },
  '\u028A\u0259': {
    description: 'Di British sering ditulis /\u028A\u0259/. Dalam American, kata yang sama biasanya cenderung /\u028Ar/ (atau variasi rhotic lain).',
    items: [
      { word: 'tour', britishIpa: '/t\u028A\u0259/', americanIpa: '/t\u028Ar/' },
      { word: 'poor', britishIpa: '/p\u028A\u0259/', americanIpa: '/p\u028Ar/' },
      { word: 'sure', britishIpa: '/\u0283\u028A\u0259/', americanIpa: '/\u0283\u028Ar/' },
      { word: 'your', britishIpa: '/j\u028A\u0259/', americanIpa: '/j\u028Ar/' },
    ],
  },
};

function formatIpaSymbolForPrompt(symbol: string): string {
  const trimmed = symbol.trim();
  if (!trimmed) return '/?/';
  const core = trimmed.replace(/^\/+|\/+$/g, '');
  return `/${core}/`;
}

function buildAccentEvaluationPrompt(focusIpaSymbol: string): string {
  return `🎯 Ingin menguasai pronunciation simbol ${focusIpaSymbol} dengan sempurna? Dapatkan analisis AI yang detail untuk setiap kata yang Anda ucapkan, lengkap dengan feedback spesifik dan skor akurasi! Upgrade ke Premium untuk unlock fitur AI Accent Evaluation dan raih American Accent yang natural.`;
}

const BETWEEN_PLAY_ALL_WORDS_MS = 220;

function addWordPauseForSpeech(text: string): string {
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  if (!normalizedText.includes(' ')) return normalizedText;
  return normalizedText.split(' ').join(', ');
}

async function speakWithSymbolDetailVoice(text: string): Promise<void> {
  if (!isSpeechSynthesisSupported() || !text.trim()) return;
  const speechText = addWordPauseForSpeech(text);

  await speakText(speechText, {
    preferredEnglish: 'en-US',
    rate: 0.86,
    pitch: 1,
    volume: 1,
    cancelBeforeSpeak: false,
  });
}

async function speakWithBritishSymbolDetailVoice(text: string): Promise<void> {
  if (!isSpeechSynthesisSupported() || !text.trim()) return;
  const speechText = addWordPauseForSpeech(text);

  await speakText(speechText, {
    preferredEnglish: 'en-GB',
    rate: 0.86,
    pitch: 1,
    volume: 1,
    cancelBeforeSpeak: false,
  });
}

const SymbolDetailPage: React.FC = () => {
  const { symbol } = useParams<{
    symbol: string;
  }>();
  const router = useRouter();
  
  // Decode URL-encoded symbol
  const decodedSymbol = symbol ? decodeURIComponent(symbol) : '';
  const normalizedSymbol = decodedSymbol.trim().toLowerCase();
  const shouldRedirectToSummary =
    normalizedSymbol === 'summary of phonetic symbols' ||
    normalizedSymbol === 'summary-of-phonetic-symbols';
  
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showCommonLettersPopup, setShowCommonLettersPopup] = useState(false);
  const [commonLetters, setCommonLetters] = useState<CommonLetter[] | null>(null);
  const [commonLettersLoading, setCommonLettersLoading] = useState(false);
  const [commonLettersError, setCommonLettersError] = useState<string | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [isWordExamplesCopied, setIsWordExamplesCopied] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [shouldAutoplayVideo, setShouldAutoplayVideo] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isSectionStateHydrated, setIsSectionStateHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(false); // Start with false to match server
  const [isClient, setIsClient] = useState(false);
  const [symbolData, setSymbolData] = useState<{
    description: string;
    category: string;
    examples: WordExample[];
    tips: string[];
    videoId?: string;
  }>({
    description: 'International Phonetic Alphabet Symbol',
    category: 'Unknown',
    examples: [],
    tips: [],
    videoId: undefined,
  });
  const symbolNavGroups = useMemo(() => getSymbolNavGroups(symbolData.category), [symbolData.category]);
  const britishNote = useMemo(
    () => BRITISH_NOTES_BY_SYMBOL[decodedSymbol] ?? null,
    [decodedSymbol]
  );
  const promptFocusSymbol = useMemo(() => formatIpaSymbolForPrompt(decodedSymbol), [decodedSymbol]);
  const accentEvaluationPrompt = useMemo(
    () => buildAccentEvaluationPrompt(promptFocusSymbol),
    [promptFocusSymbol],
  );
  const sectionStateStorageKey = useMemo(
    () => `phoneticSymbolSectionState:${normalizedSymbol || 'default'}`,
    [normalizedSymbol]
  );
  const videoEmbedSrc = useMemo(() => {
    if (!symbolData.videoId) return '';
    const autoplayQuery = shouldAutoplayVideo && isVideoOpen ? '&autoplay=1' : '';
    return `https://www.youtube.com/embed/${symbolData.videoId}?rel=0&modestbranding=1&controls=1&showinfo=0${autoplayQuery}`;
  }, [isVideoOpen, shouldAutoplayVideo, symbolData.videoId]);

  useEffect(() => {
    if (shouldRedirectToSummary) {
      router.replace('/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols');
    }
  }, [router, shouldRedirectToSummary]);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      setIsProgressSaved(!!savedProgress[`phoneticSymbols_${decodedSymbol}`]);

      const rawSectionState = localStorage.getItem(sectionStateStorageKey);
      if (rawSectionState) {
        try {
          const sectionState = JSON.parse(rawSectionState) as SymbolDetailSectionState;
          setIsPracticeOpen(!!sectionState.practice);
          setIsTipsOpen(!!sectionState.tips);
          setIsVideoOpen(!!sectionState.video);
          setShouldAutoplayVideo(false);
          setIsPromptOpen(!!sectionState.prompt);
        } catch {
          setIsPracticeOpen(false);
          setIsTipsOpen(false);
          setIsVideoOpen(false);
          setShouldAutoplayVideo(false);
          setIsPromptOpen(false);
        }
      } else {
        setIsPracticeOpen(false);
        setIsTipsOpen(false);
        setIsVideoOpen(false);
        setShouldAutoplayVideo(false);
        setIsPromptOpen(false);
      }

      setIsSectionStateHydrated(true);
    }
  }, [decodedSymbol, sectionStateStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isSectionStateHydrated) return;

    const nextSectionState: SymbolDetailSectionState = {
      practice: isPracticeOpen,
      tips: isTipsOpen,
      video: isVideoOpen,
      prompt: isPromptOpen,
    };
    localStorage.setItem(sectionStateStorageKey, JSON.stringify(nextSectionState));
  }, [
    isPracticeOpen,
    isTipsOpen,
    isVideoOpen,
    isPromptOpen,
    isSectionStateHydrated,
    sectionStateStorageKey,
  ]);
  
  const wordCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wordExamplesRef = useRef<HTMLDivElement>(null);
  const playSessionRef = useRef(0);
  const playNextTimeoutRef = useRef<number | null>(null);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const wordExamplesCopyTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    let active = true;
    if (!decodedSymbol) {
      setSymbolData({
        description: 'International Phonetic Alphabet Symbol',
        category: 'Unknown',
        examples: [],
        tips: [],
        videoId: undefined,
      });
      return () => {
        active = false;
      };
    }

    setSymbolLoading(true);
    (async () => {
      try {
        const [wordExamplesModule, descriptionModule, tipsModule, videoModule] = await Promise.all([
          import('../data/wordExamples/wordExamples'),
          import('../data/symbolDescriptions'),
          import('../data/pronunciationTips/PronunciationTips'),
          import('../data/videoIds'),
        ]);

        if (!active) return;

        setSymbolData({
          description: descriptionModule.getSymbolDescription(decodedSymbol),
          category: descriptionModule.getCategoryDisplayName(decodedSymbol),
          examples: wordExamplesModule.getWordExamples(decodedSymbol),
          tips: tipsModule.getPronunciationTips(decodedSymbol),
          videoId: videoModule.getVideoIdBySymbol(decodedSymbol),
        });
      } catch (error) {
        console.error('Failed to load symbol data:', error);
        if (!active) return;
        setSymbolData({
          description: 'International Phonetic Alphabet Symbol',
          category: 'Unknown',
          examples: [],
          tips: [],
          videoId: undefined,
        });
      } finally {
        if (active) setSymbolLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [decodedSymbol]);

  // Manual scroll to word examples
  const scrollToWordExamples = () => {
    if (wordExamplesRef.current) {
      wordExamplesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Set active word to first example to ensure first card is highlighted
      if (symbolData.examples.length > 0) {
        setActiveWord(symbolData.examples[0].word);
        setActiveWordIndex(0);
      }
    }
  };

  useEffect(() => {
    void waitForVoices();

    return () => {
      playSessionRef.current += 1;
      if (playNextTimeoutRef.current) {
        window.clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = null;
      }
      setIsPlayingAll(false);
      setActiveWord(null);
      setActiveWordIndex(null);
      stopSpeech();
    };
  }, []);

  // Debug: Check if data is loaded correctly
  useEffect(() => {
    console.log('Original symbol:', symbol);
    console.log('Decoded symbol:', decodedSymbol);
    console.log('Symbol data:', symbolData);
    console.log('Examples count:', symbolData.examples.length);
    console.log('Tips count:', symbolData.tips.length);
  }, [symbol, decodedSymbol, symbolData]);


  const stopPlayAllWords = () => {
    playSessionRef.current += 1;
    if (playNextTimeoutRef.current) {
      window.clearTimeout(playNextTimeoutRef.current);
      playNextTimeoutRef.current = null;
    }
    stopSpeech();
    setIsPlayingAll(false);
    setActiveWord(null);
    setActiveWordIndex(null);
  };

  const handlePlayAllWords = () => {
    if (!isSpeechSynthesisSupported() || symbolLoading || symbolData.examples.length === 0) return;

    if (isPlayingAll) {
      stopPlayAllWords();
      return;
    }

    stopPlayAllWords();
    const currentSession = playSessionRef.current;
    setIsPlayingAll(true);

    void (async () => {
      for (let currentIndex = 0; currentIndex < symbolData.examples.length; currentIndex++) {
        if (currentSession !== playSessionRef.current) return;

        const example = symbolData.examples[currentIndex];
        setActiveWord(example.word);
        setActiveWordIndex(currentIndex);

        if (wordCardRefs.current[currentIndex]) {
          wordCardRefs.current[currentIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }

        await speakWithSymbolDetailVoice(example.word);

        if (currentSession !== playSessionRef.current) return;
        if (currentIndex < symbolData.examples.length - 1) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, BETWEEN_PLAY_ALL_WORDS_MS);
          });
        }
      }

      if (currentSession === playSessionRef.current) {
        setIsPlayingAll(false);
        setActiveWord(null);
        setActiveWordIndex(null);
      }
    })();
  };

  const handlePlayWord = (word: string, wordIndex?: number) => {
    if (!isSpeechSynthesisSupported()) return;

    stopPlayAllWords();
    const currentSession = playSessionRef.current;
    stopSpeech();
    setActiveWord(word);
    setActiveWordIndex(typeof wordIndex === 'number' ? wordIndex : null);

    void (async () => {
      await speakWithSymbolDetailVoice(word);

      if (currentSession !== playSessionRef.current) return;
      setActiveWord(null);
      setActiveWordIndex(null);
    })();
  };

  const handlePlayBritishNoteWord = (word: string) => {
    if (!isSpeechSynthesisSupported()) return;

    stopPlayAllWords();
    stopSpeech();
    setActiveWord(word);
    setActiveWordIndex(null);

    const currentSession = playSessionRef.current;
    void (async () => {
      // BrE button should use British voice to match the UK IPA note.
      await speakWithBritishSymbolDetailVoice(word);

      if (currentSession !== playSessionRef.current) return;
      setActiveWord(null);
      setActiveWordIndex(null);
    })();
  };

  const handleSaveProgress = async (percentage: number) => {
    setIsProgressSaved(true);
    
    // Save to localStorage for persistence with symbol-specific key (client-side only)
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      currentProgress[`phoneticSymbols_${decodedSymbol}`] = percentage;
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      // Calculate average progress for all phonetic symbols
      const phoneticSymbolKeys = Object.keys(currentProgress).filter(key => key.startsWith('phoneticSymbols_'));
      const phoneticSymbolProgress = phoneticSymbolKeys.map(key => currentProgress[key]);
      const averagePhoneticProgress = phoneticSymbolProgress.length > 0 
        ? Math.round(phoneticSymbolProgress.reduce((acc: number, curr: number) => acc + curr, 0) / phoneticSymbolProgress.length)
        : 0;
      
      // Update overall pronunciation progress including all categories
      const allProgress = Object.values(currentProgress) as number[];
      const overallAverageProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      
      // Save to dashboard progress
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = overallAverageProgress;
      dashboardProgress.phoneticSymbols = averagePhoneticProgress; // Specific for phonetic symbols category
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Symbol /${decodedSymbol}/ progress saved: ${percentage}%`);
      console.log(`Phonetic Symbols average progress: ${averagePhoneticProgress}%`);
      console.log(`Overall pronunciation average: ${overallAverageProgress}%`);
    }
  };

  const handleUnsaveProgress = async () => {
    setIsProgressSaved(false);
    
    // Remove from localStorage
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      delete currentProgress[`phoneticSymbols_${decodedSymbol}`];
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      // Recalculate averages
      const phoneticSymbolKeys = Object.keys(currentProgress).filter(key => key.startsWith('phoneticSymbols_'));
      const phoneticSymbolProgress = phoneticSymbolKeys.map(key => currentProgress[key]);
      const averagePhoneticProgress = phoneticSymbolProgress.length > 0 
        ? Math.round(phoneticSymbolProgress.reduce((acc: number, curr: number) => acc + curr, 0) / phoneticSymbolProgress.length)
        : 0;
      
      const allProgress = Object.values(currentProgress) as number[];
      const overallAverageProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      
      // Update dashboard progress
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = overallAverageProgress;
      dashboardProgress.phoneticSymbols = averagePhoneticProgress;
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Symbol /${decodedSymbol}/ progress removed`);
    }
  };

  const openCommonLettersModal = async () => {
    setShowCommonLettersPopup(true);

    if (commonLetters || commonLettersLoading) {
      return;
    }

    setCommonLettersLoading(true);
    setCommonLettersError(null);
    try {
      const commonLettersModule = await import('../data/commonLetters/CommonLetters');
      setCommonLetters(commonLettersModule.getAllCommonLetters());
    } catch (error) {
      console.error('Failed to load common letters:', error);
      setCommonLettersError('Gagal memuat data common letters. Silakan coba lagi.');
    } finally {
      setCommonLettersLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(accentEvaluationPrompt);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      setIsPromptCopied(false);
    }
  };

  const handleCopyWordExamples = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      return;
    }

    const words = symbolData.examples
      .map(example => example.word?.trim())
      .filter((word): word is string => !!word);

    if (words.length === 0) {
      return;
    }

    try {
      // Copy plain words only (no IPA), for the currently opened sound.
      await navigator.clipboard.writeText(words.join(', '));
      setIsWordExamplesCopied(true);
      if (wordExamplesCopyTimeoutRef.current) {
        window.clearTimeout(wordExamplesCopyTimeoutRef.current);
      }
      wordExamplesCopyTimeoutRef.current = window.setTimeout(() => {
        setIsWordExamplesCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy word examples:', error);
      setIsWordExamplesCopied(false);
    }
  };

  useEffect(() => {
    return () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      if (wordExamplesCopyTimeoutRef.current) {
        window.clearTimeout(wordExamplesCopyTimeoutRef.current);
      }
    };
  }, []);

  if (shouldRedirectToSummary) {
    return null;
  }

  return (
    // Responsive container: handles safe areas and dynamic viewport heights
    <div className="pronunciation-layout symbol-detail-container supports-[height:100dvh]:h-[100dvh] font-sans flex flex-col overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid z-0 opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent z-20 shadow-[0_0_20px_#be29ec]"></div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-30" data-tour="phonetic-back">
        <BackButton to="/skill/pronunciation/phoneticSymbols" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        theme="cyber"
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* Main Interface - Responsive Padding & Layout */}
      <main className="symbol-detail-main relative z-10 flex-1 flex flex-col items-center pt-40 pb-24 md:pt-36 md:pb-32 overflow-y-auto w-full px-3 sm:px-4 scrollbar-hide">
        
        {/* HERO: The Reactor Core - Responsive Sizing */}
          <div className="relative mt-6 md:mt-8 lg:mt-6 mb-6 md:mb-10 group flex-shrink-0">
          
          {/* Outer Rotating Ring */}
          <div className="absolute inset-[-14px] sm:inset-[-18px] md:inset-[-24px] lg:inset-[-32px] border border-cyber-cyan/20 rounded-full border-dashed animate-spin-slow pointer-events-none"></div>
          
          {/* Inner Hex/Circle Core - Scaled for Mobile/Desktop */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center">
             {/* Glow Background */}
             <div className="absolute inset-0 bg-cyber-cyan/5 rounded-full blur-3xl animate-pulse"></div>
             
             {/* Main Container */}
             <div className="relative w-full h-full bg-cyber-slate/40 backdrop-blur-sm border border-cyber-cyan/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(190,41,236,0.2)]">
                
                {/* HUD Lines */}
                <div className="absolute top-0 bottom-0 w-px bg-cyber-cyan/20"></div>
                <div className="absolute left-0 right-0 h-px bg-cyber-cyan/20"></div>

                <div className="z-10 text-center">
                    <p className="font-mono text-purple-400/60 text-[10px] md:text-xs tracking-widest mb-1 md:mb-2">TARGET_PHONEME</p>
                    <h2 className="text-6xl md:text-8xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Lucida Sans Unicode, Arial Unicode MS, Times New Roman, serif' }}>
                        /{decodedSymbol}/
                    </h2>
                    <div className="mt-2 px-2 py-0.5 md:px-3 md:py-1 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[10px] md:text-xs">
                        {symbolData.category}
                    </div>
                </div>

                {/* Interactive Trigger (Main Action Button) */}
                <button 
                  onClick={handlePlayAllWords}
                  disabled={symbolLoading || symbolData.examples.length === 0}
                  data-tour="phonetic-play"
                  className="absolute -bottom-5 md:-bottom-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(190,41,236,0.4)] z-20 group-hover:scale-110 bg-cyber-cyan text-black hover:bg-white"
                  title={isPlayingAll ? "Stop All Words" : "Play All Words"}
                >
                    {isPlayingAll ? <Pause className="md:w-5 md:h-5 fill-current" /> : <Play className="md:w-5 md:h-5 fill-current" />}
                </button>
             </div>
          </div>
        </div>

        {/* Word Grid Module */}
        <div ref={wordExamplesRef} className="w-full scroll-mt-24 mt-12 md:mt-14">
          <div className="word-examples-section w-full max-w-6xl mx-auto p-2 md:p-4 z-10 relative" data-tour="phonetic-examples">
             <div className="word-examples-header flex items-center justify-between mb-3 md:mb-5 border-b border-purple-500/30 pb-2">
               <div className="flex items-center gap-2">
                 <Database className="text-purple-400" size={16} />
                 <h3 className="text-xs md:text-lg font-display font-bold text-purple-400 tracking-widest uppercase">
                   <button
                     type="button"
                     onClick={handleCopyWordExamples}
                     data-tour="symbol-word-examples-copy"
                     className="inline-flex items-center gap-2 hover:text-purple-300 transition-colors"
                     title="Salin semua Word Examples (tanpa IPA)"
                   >
                     <span>Word_Examples</span>
                     <Copy size={14} className="opacity-70" />
                     <span className="font-mono text-[10px] md:text-xs normal-case tracking-normal opacity-70">
                       {isWordExamplesCopied ? 'Tersalin' : 'Salin'}
                     </span>
                   </button>
                 </h3>
               </div>
               <button
                 onClick={() => {
                   // Scroll to video section
                  const videoSection = document.querySelector('[data-video-section]');
                  if (videoSection) {
                    videoSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                }}
                data-tour="symbol-go-to-video"
                className="px-2.5 py-1 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[10px] hover:bg-purple-900/20 transition-colors flex items-center gap-1"
              >
                <Play size={12} />
                <span>Go to Video</span>
              </button>
            </div>
            
            {/* Word Examples Grid - controlled by CSS */}
            <div className="word-grid w-full">
              {symbolData.examples.map((example: WordExample, index: number) => {
                const isActiveByIndex = activeWordIndex === index;
                const isActiveByWord = activeWordIndex === null && example.word === activeWord;
                const isActive = isActiveByIndex || isActiveByWord;
                
                return (
                  <button
                    key={index}
                    ref={el => { wordCardRefs.current[index] = el; }}
                    onClick={() => handlePlayWord(example.word, index)}
                    onMouseEnter={() => {
                      if (isPlayingAll) return;
                      setActiveWord(example.word);
                      setActiveWordIndex(index);
                    }}
                    onMouseLeave={() => {
                      if (isPlayingAll) return;
                      setActiveWord(null);
                      setActiveWordIndex(null);
                    }}
                    data-tour={`symbol-word-${toTourToken(example.word)}`}
                    className={`word-card relative group p-3 md:p-4 rounded-lg border transition-all duration-300 overflow-hidden w-full ${
                      isActive 
                        ? 'active is-speaking bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105 z-10' 
                        : 'bg-black/40 border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-102'
                    } backdrop-blur-sm`}
                  >
                    {/* Grid Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="w-full h-full" style={{
                        backgroundImage: `
                          linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '8px 8px'
                      }}></div>
                    </div>
                    
                    {/* Corner Markers */}
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'border-purple-400 opacity-100' 
                        : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                    }`}></div>
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'border-purple-400 opacity-100' 
                        : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                    }`}></div>
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'border-purple-400 opacity-100' 
                        : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                    }`}></div>

                    <div className="flex flex-col items-center justify-center h-full z-10 relative px-1">
                      <span className={`font-sans font-bold text-base md:text-lg tracking-wide transition-colors truncate w-full text-center ${isActive ? 'text-purple-400' : 'text-white group-hover:text-purple-400'}`}>
                        {example.word}
                      </span>
                      <span className={`text-[10px] md:text-xs font-mono mt-0.5 md:mt-1 truncate w-full text-center ${isActive ? 'text-white/80' : 'text-purple-400/60'}`} style={{ fontFamily: 'Lucida Sans Unicode, Arial Unicode MS, Times New Roman, serif' }}>
                        [{example.ipa}]
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {britishNote && (
          <div className="w-full max-w-4xl mx-auto mt-2 mb-2">
            <div className="bg-black/80 border border-amber-400/40 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(251,191,36,0.18)]">
              <div className="bg-amber-400/10 px-4 py-2 border-b border-amber-400/30">
                <span className="font-mono text-[10px] md:text-xs text-amber-300 tracking-wider">CATATAN (UK vs US)</span>
              </div>
              <div className="p-3 md:p-4 text-xs md:text-sm text-gray-200">
                <p className="mb-3">{britishNote.description}</p>
                <div className="space-y-2">
                  {britishNote.items.map((item) => (
                    <div key={item.word} className="rounded-md border border-amber-300/20 bg-amber-400/5 px-3 py-2">
                      <div className="font-semibold text-amber-200">{item.word}</div>
                      <div className="text-gray-300">
                        BrE <span className="font-mono text-amber-200">{item.britishIpa}</span>
                        {' '}&rarr; AmE <span className="font-mono text-cyan-300">{item.americanIpa}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => handlePlayBritishNoteWord(item.word)}
                          className="inline-flex items-center gap-1 rounded-md border border-amber-300/40 bg-amber-400/10 px-2 py-1 text-[11px] text-amber-200 hover:bg-amber-400/20 transition-colors"
                          title={`Play BrE: ${item.word}`}
                        >
                          <Play size={12} />
                          <span>BrE</span>
                        </button>
                        <button
                          onClick={() => handlePlayWord(item.word)}
                          className="inline-flex items-center gap-1 rounded-md border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-200 hover:bg-cyan-400/20 transition-colors"
                          title={`Play AmE: ${item.word}`}
                        >
                          <Play size={12} />
                          <span>AmE</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Progress Section */}
        <div className="w-full max-w-4xl mx-auto mt-6 mb-6">
          <div className="flex flex-col items-center gap-4">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName={`Phonetic Symbol /${decodedSymbol}/`}
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section w-full max-w-4xl mx-auto mt-6 mb-10" data-tour="phonetic-tips">
          <div className="bg-black/80 border border-cyber-pink/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.15)]">
                    
            {/* Terminal Header */}
            <div className="bg-cyber-pink/10 px-4 py-2 flex justify-between items-center border-b border-cyber-pink/30">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-cyber-pink" size={16} />
                <span className="ml-2 font-mono text-[10px] md:text-xs text-cyber-pink tracking-wider">PRONUNCIATION_TIPS</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTipsOpen(prev => !prev)}
                  className="symbol-detail-chevron-toggle text-cyber-pink hover:text-cyber-pink/80 transition-colors cursor-pointer"
                  aria-expanded={isTipsOpen}
                  title={isTipsOpen ? 'Tutup Pronunciation Tips' : 'Buka Pronunciation Tips'}
                >
                  <ChevronDown
                    size={14}
                    className={`symbol-detail-chevron-icon ${isTipsOpen ? 'is-open' : ''}`}
                  />
                </button>
                <button
                  onClick={openCommonLettersModal}
                  data-tour="phonetic-common-letters"
                  className="text-cyber-pink hover:text-cyber-pink/80 transition-colors cursor-pointer"
                  title="Lihat huruf umum dan simbol IPA"
                >
                  <Book size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            {isTipsOpen && (
              <div className="p-3 md:p-5 font-mono text-[11px] md:text-sm text-gray-300 min-h-[130px]">
                <div className="whitespace-pre-line leading-relaxed">
                  {symbolData.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <span className="text-green-400 block">{index + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
                <span className="inline-block w-2 h-4 bg-cyber-pink animate-pulse mt-2 align-middle"></span>
              </div>
            )}
          </div>
        </div>

        {/* YouTube Video Section */}
        {symbolData.videoId && (
          <div data-video-section data-tour="phonetic-alternative-audio" className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-black/90 border border-purple-500/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                      
              {/* Terminal Header */}
              <div className="bg-purple-900/20 px-4 py-2 flex justify-between items-center border-b border-purple-500/30">
                <div className="flex items-center gap-2">
                  <Play className="text-purple-400" size={16} />
                  <span className="ml-2 font-mono text-[10px] md:text-xs text-purple-400 tracking-wider">ALTERNATIVE_AUDIO</span>
                  <span className="text-xs text-white/60">Symbol: /{decodedSymbol}/</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVideoOpen((prev) => !prev)}
                  data-tour="symbol-video-section-toggle"
                  className="symbol-detail-chevron-toggle text-purple-300 hover:text-purple-100 transition-colors"
                  aria-expanded={isVideoOpen}
                  title={isVideoOpen ? 'Tutup Alternative Audio' : 'Buka Alternative Audio'}
                >
                  <ChevronDown
                    size={14}
                    className={`symbol-detail-chevron-icon ${isVideoOpen ? 'is-open' : ''}`}
                  />
                </button>
              </div>

              {/* Persuasive Content with CTA */}
              {isVideoOpen && (
                <div className="p-6 md:p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border-2 border-purple-400/50 flex items-center justify-center">
                        <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Persuasive Text */}
                  <div className="text-center mb-8">
                    <h4 className="text-h3 text-white mb-3">
                      Perfect Your Accent with Alternative Audio! 🎵
                    </h4>
                    
                    <p className="text-body text-slate-300 leading-relaxed max-w-lg mx-auto mb-4">
                      Dengarkan <span className="text-purple-400 font-semibold">audio alternatif berkualitas tinggi</span> dari berbagai native speaker untuk setiap simbol fonetik. 
                      Latih telinga Anda dengan variasi aksen dan kecepatan bicara yang berbeda!
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Audio HD</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Variasi kecepatan: slow, normal, fast</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Contoh dalam kalimat dan konteks nyata</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Download audio untuk latihan offline</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="https://learningenglishgeuwat-ten.vercel.app/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-center transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02]"
                  >
                    Daftar Sekarang - Akses Alternative Audio!
                  </a>

                  {/* Small text */}
                  <p className="text-center text-xs-custom text-slate-500 mt-4">
                    Latih listening dengan audio berkualitas • 100% Gratis
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Practice Section (below ALTERNATIVE_AUDIO) */}
        <div className="w-full max-w-4xl mx-auto mt-6" data-tour="phonetic-practice">
          <div className="bg-black/85 border border-cyber-cyan/40 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(6,182,212,0.15)]">
            <button
              type="button"
              onClick={() => setIsPracticeOpen(prev => !prev)}
              data-tour="symbol-practice-section-toggle"
              className="w-full bg-cyber-cyan/10 px-4 py-2 border-b border-cyber-cyan/30 flex items-center justify-between gap-2 text-left hover:bg-cyber-cyan/15 transition-colors"
              aria-expanded={isPracticeOpen}
            >
              <div className="flex items-center gap-2">
                <Database className="text-cyber-cyan" size={16} />
                <span className="ml-2 font-mono text-[10px] md:text-xs text-cyber-cyan tracking-wider">PRACTICE</span>
              </div>
              <span className="symbol-detail-chevron-toggle text-cyber-cyan">
                <ChevronDown
                  size={14}
                  className={`symbol-detail-chevron-icon ${isPracticeOpen ? 'is-open' : ''}`}
                />
              </span>
            </button>
             {isPracticeOpen && (
               <div className="p-3 md:p-5 text-[11px] md:text-sm text-gray-200 leading-relaxed">
                 <p>
                   <strong>Mission:</strong>
                   <br />
                   Baca semua kata di{' '}
                   <button
                     type="button"
                     onClick={handleCopyWordExamples}
                     className="text-cyber-cyan hover:text-white underline decoration-cyber-cyan/50 underline-offset-2 transition-colors"
                     title="Salin semua Word Examples (tanpa IPA)"
                   >
                     Word_Examples
                   </button>
                   .
                 </p>
                 <div className="mt-2 flex flex-wrap items-center gap-2">
                   <span className="font-mono text-[10px] md:text-xs text-cyber-cyan/80 tracking-wider uppercase">
                     Salin:
                   </span>
                   <button
                     type="button"
                     onClick={handleCopyWordExamples}
                     className="inline-flex items-center gap-1 font-mono text-[10px] md:text-xs text-cyber-cyan hover:text-white underline decoration-cyber-cyan/50 underline-offset-2 transition-colors"
                     title="Salin semua Word Examples (tanpa IPA)"
                   >
                     <Copy size={12} />
                     <span>{isWordExamplesCopied ? 'Word Examples (Tersalin)' : 'Word Examples'}</span>
                   </button>
                   <span className="text-gray-400/80">dan</span>
                   <button
                     type="button"
                     onClick={handleCopyPrompt}
                     className="inline-flex items-center gap-1 font-mono text-[10px] md:text-xs text-cyber-pink hover:text-white underline decoration-cyber-pink/50 underline-offset-2 transition-colors"
                     title="Salin prompt"
                   >
                     <Copy size={12} />
                     <span>{isPromptCopied ? 'Prompt (Tersalin)' : 'Prompt'}</span>
                   </button>
                 </div>
               </div>
             )}
           </div>
         </div>

        {/* Prompt Section (below PRACTICE) */}
        <div className="w-full max-w-4xl mx-auto mt-6">
          <div className="bg-black/85 border border-cyber-pink/40 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(255,0,255,0.14)]">
            <div className="bg-cyber-pink/10 px-4 py-2 border-b border-cyber-pink/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-cyber-pink" size={16} />
                <span className="ml-2 font-mono text-[10px] md:text-xs text-cyber-pink tracking-wider">PROMPT</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromptOpen(prev => !prev)}
                  data-tour="symbol-prompt-section-toggle"
                  className="symbol-detail-chevron-toggle text-cyber-pink hover:bg-cyber-pink/20 transition-colors"
                  aria-expanded={isPromptOpen}
                  title={isPromptOpen ? 'Tutup Prompt' : 'Buka Prompt'}
                >
                  <ChevronDown
                    size={13}
                    className={`symbol-detail-chevron-icon ${isPromptOpen ? 'is-open' : ''}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  data-tour="symbol-prompt-copy-button"
                  className="inline-flex items-center gap-1.5 rounded border border-cyber-pink/40 bg-cyber-pink/10 px-2 py-1 text-[10px] md:text-xs font-mono text-cyber-pink hover:bg-cyber-pink/20 transition-colors"
                  title="Salin prompt"
                >
                  <Copy size={13} />
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
            </div>
            {isPromptOpen && (
              <div className="p-3 md:p-5">
                <p className="text-[11px] md:text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                  &quot;{accentEvaluationPrompt}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Symbol Navigation - Persuasive Section with Registration CTA */}
        {symbolNavGroups.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-black/90 border border-purple-500/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              
              {/* Terminal Header */}
              <div className="bg-purple-900/20 px-4 py-2 flex justify-between items-center border-b border-purple-500/30">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="ml-2 font-mono text-[10px] md:text-xs text-purple-400 tracking-wider">SYMBOL_NAVIGATION</span>
                  <span className="text-xs text-white/60">{getBaseGroup(symbolData.category)?.toUpperCase()}</span>
                </div>
              </div>

              {/* Persuasive Content with CTA */}
              <div className="p-6 md:p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border-2 border-purple-400/50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Persuasive Text */}
                <div className="text-center mb-8">
                  <h4 className="text-h3 text-white mb-3">
                    Explore All 44 Phonetic Symbols! 🔓
                  </h4>
                  
                  <p className="text-body text-slate-300 leading-relaxed max-w-lg mx-auto mb-4">
                    Navigasi cepat ke <span className="text-purple-400 font-semibold">semua simbol fonetik</span> yang terorganisir dengan rapi. 
                    Pelajari setiap bunyi bahasa Inggris dengan sistem navigasi yang intuitif dan efisien!
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Akses lengkap ke 44 simbol IPA (vowels, consonants, diphthongs)</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Kategori terorganisir: Lax, Tense, Voiced, Voiceless</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Navigasi cepat antar simbol dengan satu klik</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-small text-purple-300">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Track progress untuk setiap simbol yang sudah dipelajari</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://learningenglishgeuwat-ten.vercel.app/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-center transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02]"
                >
                  Daftar Sekarang - Unlock All Symbols!
                </a>

                {/* Small text */}
                <p className="text-center text-xs-custom text-slate-500 mt-4">
                  Akses penuh ke semua simbol fonetik • 100% Gratis
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Control Button */}
      <RecordingControlsButton downloadFileName={`phonetic-${decodedSymbol}-GEUWAT-recording.wav`} />


      {/* Help Popup Modal - Premium Feature */}
      {showHelpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelpPopup(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-[#0a0f1c] via-[#0d1420] to-[#050a10] border-2 border-cyber-cyan/50 rounded-3xl p-6 max-w-[90vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto w-full shadow-[0_0_80px_rgba(190,41,236,0.4)] mx-4 sm:mx-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowHelpPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 z-10"
              title="Tutup popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-pink rounded-full mb-4">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-pink to-purple-400 mb-2">
                Unlock AI-Powered Pronunciation Coach
              </h3>
              <p className="text-gray-300 text-sm">
                Tingkatkan pronunciation skills Anda dengan teknologi AI terdepan
              </p>
            </div>

            {/* Main Message */}
            <div className="mb-6 p-5 bg-gradient-to-r from-cyber-cyan/10 via-cyber-pink/10 to-purple-500/10 border border-cyber-cyan/30 rounded-xl">
              <p className="text-gray-200 text-center leading-relaxed mb-4">
                🎯 <span className="text-cyber-cyan font-semibold">Bayangkan</span> bisa merekam pronunciation Anda, 
                mendapatkan <span className="text-cyber-pink font-semibold">analisis detail dari AI</span>, 
                dan melihat <span className="text-purple-400 font-semibold">progress Anda meningkat</span> setiap hari!
              </p>
              <p className="text-gray-300 text-center text-sm">
                Dengan fitur Premium Recording & AI Evaluation, Anda akan mendapatkan feedback yang personal dan actionable untuk setiap kata yang Anda ucapkan.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyber-cyan/10 to-transparent border border-cyber-cyan/30 rounded-xl p-4 hover:border-cyber-cyan/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cyber-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="text-cyber-cyan" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-sm">High-Quality Recording</h4>
                    <p className="text-gray-400 text-xs">Rekam pronunciation dengan kualitas studio, dengarkan ulang kapan saja</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyber-pink/10 to-transparent border border-cyber-pink/30 rounded-xl p-4 hover:border-cyber-pink/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cyber-pink/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-cyber-pink" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-sm">AI Accent Analysis</h4>
                    <p className="text-gray-400 text-xs">Feedback detail untuk setiap phonetic symbol dengan skor akurasi</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-sm">Progress Tracking</h4>
                    <p className="text-gray-400 text-xs">Monitor perkembangan pronunciation Anda dari waktu ke waktu</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 rounded-xl p-4 hover:border-teal-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-teal-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-sm">Unlimited Practice</h4>
                    <p className="text-gray-400 text-xs">Rekam sebanyak yang Anda mau, tanpa batasan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-6 p-5 bg-gradient-to-r from-cyber-cyan/5 via-cyber-pink/5 to-purple-500/5 border border-cyber-cyan/20 rounded-xl">
              <h4 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                <Sparkles className="text-cyber-pink" size={18} />
                Yang Anda Dapatkan:
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={16} />
                  <span>Kontrol recording lengkap: Record, Stop, Play, Download</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={16} />
                  <span>AI evaluation dengan feedback spesifik per phonetic symbol</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={16} />
                  <span>Skor akurasi pronunciation (1-100) untuk setiap latihan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={16} />
                  <span>Progress tracking untuk monitor improvement Anda</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={16} />
                  <span>Akses ke 100+ pronunciation exercises & word examples</span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="mb-4 p-3 bg-gradient-to-r from-cyber-pink/10 to-purple-500/10 border border-cyber-pink/30 rounded-xl">
                <p className="text-cyber-pink font-semibold text-sm mb-1">
                  🎁 Bonus Eksklusif untuk Member Baru!
                </p>
                <p className="text-gray-300 text-xs">
                  Dapatkan akses ke semua fitur Premium + AI feedback unlimited
                </p>
              </div>
              
              <a
                href="https://learningenglishgeuwat-ten.vercel.app/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-base rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300"
              >
                🚀 Daftar Sekarang & Mulai Belajar
              </a>
              
              <p className="text-gray-400 text-xs mt-3">
                Bergabunglah dengan learners yang sudah meningkatkan pronunciation mereka
              </p>
            </div>
          </div>
        </div>
      )}

      <CommonLettersModal
        isOpen={showCommonLettersPopup}
        onClose={() => setShowCommonLettersPopup(false)}
        letters={commonLetters}
        isLoading={commonLettersLoading}
        error={commonLettersError}
        onRetry={openCommonLettersModal}
      />

    </div>
  );
};

export default SymbolDetailPage;

