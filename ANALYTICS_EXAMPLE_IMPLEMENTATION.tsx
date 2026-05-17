// CONTOH IMPLEMENTASI GOOGLE ANALYTICS
// File ini adalah contoh bagaimana menambahkan tracking ke komponen Anda
// Jangan gunakan file ini langsung, tapi copy kode yang relevan ke komponen Anda

'use client';

import { useEffect } from 'react';
import { 
  trackFeatureUsage, 
  trackButtonClick,
  trackPronunciation,
  trackNavigation,
  trackAudio
} from '@/lib/analytics';

// ============================================
// CONTOH 1: Track Page View di Pronunciation
// ============================================
export function PhoneticPortalWithTracking() {
  // Track saat halaman dibuka
  useEffect(() => {
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Portal');
  }, []);

  return <div>Phonetic Portal Content</div>;
}

// ============================================
// CONTOH 2: Track Button Clicks
// ============================================
export function ButtonWithTracking() {
  const handleOpenSymbolTable = () => {
    // Track button click
    trackButtonClick('Open Symbol Table', 'Phonetic Portal');
    
    // ... logic untuk membuka symbol table
  };

  const handleOpenCommonMistakes = () => {
    trackButtonClick('Common Mistakes', 'Phonetic Portal');
    // ... logic
  };

  const handleOpenTongueTwister = () => {
    trackButtonClick('Tongue Twister', 'Phonetic Portal');
    // ... logic
  };

  return (
    <div>
      <button onClick={handleOpenSymbolTable}>
        PHONETIC SYMBOL CHART
      </button>
      <button onClick={handleOpenCommonMistakes}>
        COMMON MISTAKES
      </button>
      <button onClick={handleOpenTongueTwister}>
        TONGUE TWISTER
      </button>
    </div>
  );
}

// ============================================
// CONTOH 3: Track Portal Card Clicks
// ============================================
export function PortalCardWithTracking() {
  const handlePortalClick = (portalType: string) => {
    // Track portal yang diklik
    trackFeatureUsage('Pronunciation', 'portal_opened', portalType);
    trackButtonClick(`${portalType} Portal`, 'Phonetic Portal');
    
    // ... logic untuk membuka portal
  };

  return (
    <div className="portal-grid">
      <div onClick={() => handlePortalClick('Vowel')}>
        <h2>VOWELS</h2>
      </div>
      <div onClick={() => handlePortalClick('Consonant')}>
        <h2>CONSONANTS</h2>
      </div>
      <div onClick={() => handlePortalClick('Diphthong')}>
        <h2>DIPHTHONGS</h2>
      </div>
    </div>
  );
}

// ============================================
// CONTOH 4: Track Symbol Audio Playback
// ============================================
export function SymbolAudioWithTracking() {
  const speakSymbol = async (symbol: string) => {
    // Track audio playback
    trackPronunciation('play_audio', symbol);
    trackAudio('play', `phonetic_symbol_${symbol}`);
    
    // ... logic untuk play audio
  };

  const playAllSymbols = async () => {
    // Track play all feature
    trackPronunciation('play_all_symbols');
    trackButtonClick('Play All Symbols', 'Symbol Table');
    
    // ... logic untuk play all
  };

  return (
    <div>
      <button onClick={() => speakSymbol('æ')}>Play /æ/</button>
      <button onClick={() => speakSymbol('ɪ')}>Play /ɪ/</button>
      <button onClick={playAllSymbols}>Play All</button>
    </div>
  );
}

// ============================================
// CONTOH 5: Track Symbol Detail Navigation
// ============================================
export function SymbolNavigationWithTracking() {
  const handleSymbolClick = (symbol: string) => {
    // Track navigation ke detail symbol
    trackPronunciation('symbol_detail_opened', symbol);
    trackNavigation('Phonetic Portal', `Symbol Detail - ${symbol}`);
    
    // ... navigation logic
  };

  return (
    <div>
      <button onClick={() => handleSymbolClick('æ')}>
        View /æ/ Details
      </button>
    </div>
  );
}

// ============================================
// CONTOH 6: Track Premium Feature Clicks
// ============================================
export function PremiumFeatureWithTracking() {
  const handlePremiumClick = (featureName: string) => {
    // Track premium feature yang diklik
    trackFeatureUsage('Premium', 'premium_feature_clicked', featureName);
    trackButtonClick('Daftar Sekarang', `Premium Modal - ${featureName}`);
    
    // ... logic untuk redirect ke registration
  };

  return (
    <div className="premium-modal">
      <h3>Unlock {featureName}</h3>
      <button onClick={() => handlePremiumClick('Symbol Chart')}>
        Daftar Sekarang
      </button>
    </div>
  );
}

// ============================================
// CONTOH 7: Track Modal Open/Close
// ============================================
export function ModalWithTracking() {
  const openModal = (modalName: string) => {
    trackFeatureUsage('Modal', 'modal_opened', modalName);
    // ... open modal logic
  };

  const closeModal = (modalName: string) => {
    trackFeatureUsage('Modal', 'modal_closed', modalName);
    // ... close modal logic
  };

  return (
    <div>
      <button onClick={() => openModal('Symbol Table')}>Open</button>
      <button onClick={() => closeModal('Symbol Table')}>Close</button>
    </div>
  );
}

// ============================================
// CONTOH 8: Track Video Interactions
// ============================================
export function VideoWithTracking() {
  const handleVideoPlay = (videoId: string) => {
    trackPronunciation('video_played', videoId);
    // ... video play logic
  };

  const handleVideoComplete = (videoId: string) => {
    trackPronunciation('video_completed', videoId);
    // ... video complete logic
  };

  return (
    <video 
      onPlay={() => handleVideoPlay('pronunciation_intro')}
      onEnded={() => handleVideoComplete('pronunciation_intro')}
    >
      {/* video content */}
    </video>
  );
}

// ============================================
// CONTOH 9: Track User Journey Steps
// ============================================
export function UserJourneyWithTracking() {
  useEffect(() => {
    // Track step dalam user journey
    trackFeatureUsage('User Journey', 'step_completed', 'Opened Phonetic Portal');
  }, []);

  const handleNextStep = () => {
    trackFeatureUsage('User Journey', 'step_completed', 'Selected First Symbol');
    // ... next step logic
  };

  return <button onClick={handleNextStep}>Next Step</button>;
}

// ============================================
// CARA IMPLEMENTASI KE KOMPONEN YANG ADA
// ============================================

/*
LANGKAH-LANGKAH:

1. Import fungsi tracking di bagian atas komponen:
   import { trackFeatureUsage, trackButtonClick, trackPronunciation } from '@/lib/analytics';

2. Tambahkan tracking di useEffect untuk page view:
   useEffect(() => {
     trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Portal');
   }, []);

3. Tambahkan tracking di event handlers yang sudah ada:
   
   SEBELUM:
   const handleClick = () => {
     // logic
   };
   
   SESUDAH:
   const handleClick = () => {
     trackButtonClick('Button Name', 'Location');
     // logic
   };

4. Untuk audio playback, tambahkan di fungsi speakSymbol:
   
   SEBELUM:
   const speakSymbol = async (symbol: string) => {
     // play audio logic
   };
   
   SESUDAH:
   const speakSymbol = async (symbol: string) => {
     trackPronunciation('play_audio', symbol);
     // play audio logic
   };

5. Untuk navigation, tambahkan sebelum router.push:
   
   SEBELUM:
   router.push(path);
   
   SESUDAH:
   trackNavigation('Current Page', 'Target Page');
   router.push(path);
*/

// ============================================
// CONTOH LENGKAP: Phonetic Portal dengan Tracking
// ============================================
export function CompletePhoneticPortalExample() {
  useEffect(() => {
    // Track page view
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Portal');
  }, []);

  const togglePortal = (portalId: string) => {
    // Track portal toggle
    trackFeatureUsage('Pronunciation', 'portal_toggled', portalId);
    trackButtonClick(`${portalId} Portal Card`, 'Phonetic Portal');
    
    // ... existing toggle logic
  };

  const openSymbolTable = () => {
    // Track symbol table open
    trackFeatureUsage('Pronunciation', 'symbol_table_opened');
    trackButtonClick('Phonetic Symbol Chart', 'Phonetic Portal');
    
    // ... existing open logic
  };

  const speakSymbol = async (symbol: string) => {
    // Track audio playback
    trackPronunciation('play_audio', symbol);
    trackAudio('play', `phonetic_${symbol}`);
    
    // ... existing speak logic
  };

  const playAllSymbols = async () => {
    // Track play all
    trackPronunciation('play_all_symbols');
    trackButtonClick('Play All Symbols', 'Symbol Table');
    
    // ... existing play all logic
  };

  const handleSymbolClick = (symbol: string) => {
    // Track symbol detail navigation
    trackPronunciation('symbol_detail_opened', symbol);
    trackNavigation('Phonetic Portal', `Symbol Detail - ${symbol}`);
    
    // ... existing navigation logic
  };

  return (
    <div>
      {/* Portal Cards */}
      <div onClick={() => togglePortal('vowel')}>VOWELS</div>
      <div onClick={() => togglePortal('consonant')}>CONSONANTS</div>
      <div onClick={() => togglePortal('diphthong')}>DIPHTHONGS</div>
      
      {/* Symbol Table Button */}
      <button onClick={openSymbolTable}>
        PHONETIC SYMBOL CHART
      </button>
      
      {/* Symbol with Audio */}
      <button onClick={() => speakSymbol('æ')}>Play /æ/</button>
      
      {/* Play All Button */}
      <button onClick={playAllSymbols}>Play All</button>
      
      {/* Symbol Detail Link */}
      <button onClick={() => handleSymbolClick('æ')}>
        View Details
      </button>
    </div>
  );
}
