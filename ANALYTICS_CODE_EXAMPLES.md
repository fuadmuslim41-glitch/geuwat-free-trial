# Google Analytics - Code Examples

File ini berisi contoh-contoh code untuk implementasi tracking. Copy code yang relevan ke komponen Anda.

## CONTOH 1: Track Page View di Pronunciation

```typescript
'use client';

import { useEffect } from 'react';
import { trackFeatureUsage } from '@/lib/analytics';

export default function PhoneticPortalWithTracking() {
  // Track saat halaman dibuka
  useEffect(() => {
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Portal');
  }, []);

  return <div>Phonetic Portal Content</div>;
}
```

## CONTOH 2: Track Button Clicks

```typescript
'use client';

import { trackButtonClick } from '@/lib/analytics';

export default function ButtonWithTracking() {
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
```

## CONTOH 3: Track Portal Card Clicks

```typescript
'use client';

import { trackFeatureUsage, trackButtonClick } from '@/lib/analytics';

export default function PortalCardWithTracking() {
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
```

## CONTOH 4: Track Symbol Audio Playback

```typescript
'use client';

import { trackPronunciation, trackAudio } from '@/lib/analytics';

export default function SymbolAudioWithTracking() {
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
```

## CONTOH 5: Track Symbol Detail Navigation

```typescript
'use client';

import { trackPronunciation, trackNavigation } from '@/lib/analytics';

export default function SymbolNavigationWithTracking() {
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
```

## CONTOH 6: Track Premium Feature Clicks

```typescript
'use client';

import { trackFeatureUsage, trackButtonClick } from '@/lib/analytics';

interface PremiumFeatureProps {
  featureName: string;
}

export default function PremiumFeatureWithTracking({ featureName }: PremiumFeatureProps) {
  const handlePremiumClick = (feature: string) => {
    // Track premium feature yang diklik
    trackFeatureUsage('Premium', 'premium_feature_clicked', feature);
    trackButtonClick('Daftar Sekarang', `Premium Modal - ${feature}`);
    
    // ... logic untuk redirect ke registration
  };

  return (
    <div className="premium-modal">
      <h3>Unlock {featureName}</h3>
      <button onClick={() => handlePremiumClick(featureName)}>
        Daftar Sekarang
      </button>
    </div>
  );
}
```

## CONTOH 7: Track Modal Open/Close

```typescript
'use client';

import { trackFeatureUsage } from '@/lib/analytics';

export default function ModalWithTracking() {
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
```

## CONTOH 8: Track Video Interactions

```typescript
'use client';

import { trackPronunciation } from '@/lib/analytics';

export default function VideoWithTracking() {
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
```

## CONTOH 9: Track User Journey Steps

```typescript
'use client';

import { useEffect } from 'react';
import { trackFeatureUsage } from '@/lib/analytics';

export default function UserJourneyWithTracking() {
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
```

## CARA IMPLEMENTASI KE KOMPONEN YANG ADA

### Langkah-langkah:

#### 1. Import fungsi tracking di bagian atas komponen:
```typescript
import { trackFeatureUsage, trackButtonClick, trackPronunciation } from '@/lib/analytics';
```

#### 2. Tambahkan tracking di useEffect untuk page view:
```typescript
useEffect(() => {
  trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Portal');
}, []);
```

#### 3. Tambahkan tracking di event handlers yang sudah ada:

**SEBELUM:**
```typescript
const handleClick = () => {
  // logic
};
```

**SESUDAH:**
```typescript
const handleClick = () => {
  trackButtonClick('Button Name', 'Location');
  // logic
};
```

#### 4. Untuk audio playback, tambahkan di fungsi speakSymbol:

**SEBELUM:**
```typescript
const speakSymbol = async (symbol: string) => {
  // play audio logic
};
```

**SESUDAH:**
```typescript
const speakSymbol = async (symbol: string) => {
  trackPronunciation('play_audio', symbol);
  // play audio logic
};
```

#### 5. Untuk navigation, tambahkan sebelum router.push:

**SEBELUM:**
```typescript
router.push(path);
```

**SESUDAH:**
```typescript
trackNavigation('Current Page', 'Target Page');
router.push(path);
```

## CONTOH LENGKAP: Phonetic Portal dengan Tracking

```typescript
'use client';

import { useEffect } from 'react';
import { 
  trackFeatureUsage, 
  trackButtonClick,
  trackPronunciation,
  trackNavigation,
  trackAudio 
} from '@/lib/analytics';

export default function CompletePhoneticPortalExample() {
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
```

## Tips

1. **Selalu gunakan 'use client'** di komponen yang menggunakan tracking
2. **Import hanya fungsi yang dibutuhkan** untuk mengurangi bundle size
3. **Track di awal fungsi** sebelum logic lainnya
4. **Gunakan nama yang konsisten** untuk event categories dan actions
5. **Tambahkan context** di event labels untuk insights lebih baik
