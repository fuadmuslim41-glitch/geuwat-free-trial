'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '../../../components/BackButton';
import { isSpeechSynthesisSupported, speakText, stopSpeech, waitForVoices } from '@/lib/tts/speech';
import './summary-of-phonetic-symbols.css';

type TabKey = 'vowel' | 'diphthong' | 'consonant';
type SymbolExample = { word: string; ipa: string };
type SymbolItem = { symbol: string; examples: [SymbolExample, SymbolExample, SymbolExample] };
type SpokenWordEntry = { key: string; word: string };

const SYMBOL_DATA: Record<TabKey, string[]> = {
  vowel: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a', '\u0251', 'i', 'u', '\u00e6', '\u0254'],
  diphthong: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'],
  consonant: [
    'p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h',
    'b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y',
  ],
};

const TAB_LABELS: Record<TabKey, string> = {
  vowel: 'VOWEL',
  diphthong: 'DIPHTHONG',
  consonant: 'CONSONANT',
};

const POP_SOUND_SYMBOLS = new Set(['p', 'b', 't', 'd', 'k', 'g', 'ʧ', 'ʤ']);

const VOWEL_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'Vowel Lax',
    items: [],
  },
  {
    title: 'Vowel Tense',
    items: [],
  },
];

const CONSONANT_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'Consonant Voiceless',
    items: [],
  },
  {
    title: 'Consonant Voiced',
    items: [],
  },
];

const DIPHTHONG_GROUPS: { title: string; items: SymbolItem[] }[] = [
  {
    title: 'Diphthongs',
    items: [],
  },
];

export default function SummaryOfPhoneticSymbolsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('vowel');
  const [activePlayGroup, setActivePlayGroup] = useState<string | null>(null);
  const [activeSpeakingExampleKey, setActiveSpeakingExampleKey] = useState<string | null>(null);
  const playGroupRef = useRef<string | null>(null);
  const playSessionRef = useRef(0);
  const exampleCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeSymbols = useMemo(() => SYMBOL_DATA[activeTab], [activeTab]);

  const buildExampleKey = (
    tab: TabKey,
    groupTitle: string,
    symbol: string,
    itemIndex: number,
    exampleIndex: number,
  ) => `${tab}-${groupTitle}-${symbol}-${itemIndex}-${exampleIndex}`;

  const scrollToExampleCard = (exampleKey: string) => {
    const node = exampleCardRefs.current[exampleKey];
    if (!node) return;
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  useEffect(() => {
    void waitForVoices();
    return () => {
      playSessionRef.current += 1;
      playGroupRef.current = null;
      stopSpeech();
      setActiveSpeakingExampleKey(null);
    };
  }, []);

  const handleTabChange = (nextTab: TabKey) => {
    if (nextTab === activeTab) return;
    playSessionRef.current += 1;
    stopSpeech();
    setActivePlayGroup(null);
    setActiveSpeakingExampleKey(null);
    playGroupRef.current = null;
    setActiveTab(nextTab);
  };

  const speakWord = async (word: string, exampleKey?: string) => {
    if (!isSpeechSynthesisSupported()) return;
    playSessionRef.current += 1;
    stopSpeech();
    setActivePlayGroup(null);
    setActiveSpeakingExampleKey(exampleKey ?? null);
    if (exampleKey) {
      scrollToExampleCard(exampleKey);
    }
    playGroupRef.current = null;
    await speakText(word, {
      preferredEnglish: 'en-US',
      rate: 0.86,
      pitch: 1,
      volume: 1,
      cancelBeforeSpeak: false,
    });
    setActiveSpeakingExampleKey(null);
  };

  const playAllWordsByGroup = async (groupKey: string, words: SpokenWordEntry[]) => {
    if (!isSpeechSynthesisSupported() || words.length === 0) return;

    if (activePlayGroup === groupKey) {
      playSessionRef.current += 1;
      stopSpeech();
      setActivePlayGroup(null);
      setActiveSpeakingExampleKey(null);
      playGroupRef.current = null;
      return;
    }

    playSessionRef.current += 1;
    const sessionId = playSessionRef.current;
    stopSpeech();
    setActivePlayGroup(groupKey);
    playGroupRef.current = groupKey;

    for (const currentWord of words) {
      if (playSessionRef.current !== sessionId || playGroupRef.current !== groupKey) break;
      setActiveSpeakingExampleKey(currentWord.key);
      scrollToExampleCard(currentWord.key);
      await speakText(currentWord.word, {
        preferredEnglish: 'en-US',
        rate: 0.86,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      });
      if (playSessionRef.current !== sessionId || playGroupRef.current !== groupKey) break;
    }

    if (playSessionRef.current === sessionId && playGroupRef.current === groupKey) {
      setActivePlayGroup(null);
      setActiveSpeakingExampleKey(null);
      playGroupRef.current = null;
    }
  };

  return (
    <main className="sps-page">
      <div className="sps-back">
        <BackButton to="/skill/pronunciation/phoneticSymbols" />
      </div>

      <section className="sps-shell">
        <header className="sps-header">
          <h1 className="sps-title">SUMMARY OF PHONETIC SYMBOLS</h1>
          <p className="sps-subtitle">Pilih tab untuk melihat semua simbol berdasarkan kategori.</p>
        </header>

        <div className="sps-tabs" role="tablist" aria-label="Phonetic symbol categories">
          {Object.keys(TAB_LABELS).map((key) => {
            const tabKey = key as TabKey;
            const active = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={active}
                className={`sps-tab ${active ? 'is-active' : ''}`}
                onClick={() => handleTabChange(tabKey)}
              >
                {TAB_LABELS[tabKey]}
              </button>
            );
          })}
        </div>

        {activeTab === 'vowel' || activeTab === 'consonant' || activeTab === 'diphthong' ? (
          <div className="sps-panel" role="tabpanel" aria-label={`${TAB_LABELS[activeTab]} symbols`}>
            <div className={`sps-vowel-columns ${activeTab === 'diphthong' ? 'is-single' : ''}`}>
              {(activeTab === 'vowel'
                ? VOWEL_GROUPS
                : activeTab === 'consonant'
                  ? CONSONANT_GROUPS
                  : DIPHTHONG_GROUPS).map((group) => (
                <section key={group.title} className="sps-vowel-column">
                  <div className="sps-column-head">
                    <h2 className="sps-column-title">{group.title}</h2>
                    <button
                      type="button"
                      className={`sps-play-all-btn ${activePlayGroup === `${activeTab}-${group.title}` ? 'is-playing' : ''}`}
                      onClick={() => {
                        const queuedWords = group.items.flatMap((item, itemIndex) =>
                          item.examples.map((example, exampleIndex) => ({
                            key: buildExampleKey(activeTab, group.title, item.symbol, itemIndex, exampleIndex),
                            word: example.word,
                          })),
                        );
                        void playAllWordsByGroup(`${activeTab}-${group.title}`, queuedWords);
                      }}
                      aria-label={activePlayGroup === `${activeTab}-${group.title}` ? 'Stop' : 'Play all words'}
                      title={activePlayGroup === `${activeTab}-${group.title}` ? 'Stop' : 'Play all words'}
                    >
                      <span aria-hidden="true">{activePlayGroup === `${activeTab}-${group.title}` ? '■' : '▶'}</span>
                    </button>
                  </div>
                  <div className="sps-symbol-list">
                    {group.items.map((item, itemIndex) => (
                      <div key={item.symbol} className="sps-symbol-card sps-symbol-card-with-examples">
                        <span
                          className={`sps-symbol ${
                            activeTab === 'consonant' && POP_SOUND_SYMBOLS.has(item.symbol) ? 'is-pop-sound' : ''
                          }`}
                        >
                          {item.symbol}
                        </span>
                        <ul className="sps-example-grid">
                          {item.examples.map((example, exampleIndex) => {
                            const exampleKey = buildExampleKey(activeTab, group.title, item.symbol, itemIndex, exampleIndex);
                            const isSpeakingExample = activeSpeakingExampleKey === exampleKey;

                            return (
                            <li key={`${item.symbol}-${example.word}-${exampleIndex}`}>
                              <button
                                type="button"
                                className={`sps-example-card ${isSpeakingExample ? 'is-speaking' : ''}`}
                                onClick={() => void speakWord(example.word, exampleKey)}
                                ref={(node) => {
                                  exampleCardRefs.current[exampleKey] = node;
                                }}
                                aria-label={`Play pronunciation for ${example.word}`}
                              >
                                <span className="sps-word">{example.word}</span>
                                <span className="sps-ipa">/{example.ipa}/</span>
                              </button>
                            </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {activeTab === 'consonant' ? (
              <div className="sps-note">
                <p className="sps-note-title">Catatan:</p>
                <ul className="sps-note-list">
                  <li>- Simbol berwarna biru menandakan <strong>pop sounds</strong>.</li>
                  <li>
                    - Pop sound adalah bunyi saat aliran udara ditahan sebentar lalu dilepas cepat (terdengar seperti
                    letupan kecil).
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="sps-panel" role="tabpanel" aria-label={`${TAB_LABELS[activeTab]} symbols`}>
            <div className="sps-grid">
              {activeSymbols.map((symbol) => (
                <div key={`${activeTab}-${symbol}`} className="sps-symbol-card">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
