# Panduan Implementasi Google Analytics

## Setup Awal

### 1. Dapatkan Google Analytics Measurement ID
1. Buka [Google Analytics](https://analytics.google.com/)
2. Buat property baru atau gunakan yang sudah ada
3. Dapatkan Measurement ID (format: G-XXXXXXXXXX)

### 2. Konfigurasi Environment Variable
Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**PENTING:** Jangan commit file `.env.local` ke Git!

## Cara Menggunakan Analytics di Komponen

### 1. Import fungsi tracking
```typescript
import { 
  trackFeatureUsage, 
  trackButtonClick,
  trackPronunciation,
  trackGrammar,
  trackVideo,
  trackAudio,
  trackNavigation
} from '@/lib/analytics';
```

### 2. Contoh Implementasi

#### A. Track Button Click
```typescript
'use client';

import { trackButtonClick } from '@/lib/analytics';

export default function MyButton() {
  const handleClick = () => {
    trackButtonClick('Start Learning', 'Dashboard');
    // ... logic lainnya
  };

  return <button onClick={handleClick}>Start Learning</button>;
}
```

#### B. Track Feature Usage
```typescript
'use client';

import { trackFeatureUsage } from '@/lib/analytics';
import { useEffect } from 'react';

export default function PronunciationPage() {
  useEffect(() => {
    // Track saat user membuka fitur
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Symbols');
  }, []);

  return <div>Pronunciation Content</div>;
}
```

#### C. Track Pronunciation Interaction
```typescript
'use client';

import { trackPronunciation } from '@/lib/analytics';

export default function PhoneticSymbol({ symbol }: { symbol: string }) {
  const handlePlay = () => {
    trackPronunciation('play_audio', symbol);
    // ... play audio logic
  };

  const handleVideoClick = () => {
    trackPronunciation('watch_video', symbol);
    // ... video logic
  };

  return (
    <div>
      <button onClick={handlePlay}>Play {symbol}</button>
      <button onClick={handleVideoClick}>Watch Video</button>
    </div>
  );
}
```

#### D. Track Grammar Interaction
```typescript
'use client';

import { trackGrammar } from '@/lib/analytics';

export default function GrammarTopic({ topic }: { topic: string }) {
  const handleTopicClick = () => {
    trackGrammar('topic_opened', topic);
    // ... navigation logic
  };

  return <button onClick={handleTopicClick}>{topic}</button>;
}
```

#### E. Track Video Interaction
```typescript
'use client';

import { trackVideo } from '@/lib/analytics';

export default function VideoPlayer({ videoId }: { videoId: string }) {
  const handlePlay = () => {
    trackVideo('play', videoId);
  };

  const handlePause = () => {
    trackVideo('pause', videoId);
  };

  const handleComplete = () => {
    trackVideo('complete', videoId);
  };

  return (
    <video 
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleComplete}
    >
      {/* video content */}
    </video>
  );
}
```

#### F. Track Navigation
```typescript
'use client';

import { trackNavigation } from '@/lib/analytics';
import { useRouter } from 'next/navigation';

export default function NavigationButton() {
  const router = useRouter();

  const handleNavigate = () => {
    trackNavigation('Dashboard', 'Pronunciation');
    router.push('/skill/pronunciation');
  };

  return <button onClick={handleNavigate}>Go to Pronunciation</button>;
}
```

#### G. Track Audio Playback
```typescript
'use client';

import { trackAudio } from '@/lib/analytics';

export default function AudioPlayer() {
  const playPhoneticSound = (symbol: string) => {
    trackAudio('play', `phonetic_${symbol}`);
    // ... play audio logic
  };

  return <button onClick={() => playPhoneticSound('æ')}>Play /æ/</button>;
}
```

## Fungsi Tracking yang Tersedia

### 1. `trackFeatureUsage(featureName, action, details?)`
Untuk melacak penggunaan fitur utama
- **featureName**: Nama fitur (contoh: 'Pronunciation', 'Grammar', 'Dashboard')
- **action**: Aksi yang dilakukan (contoh: 'page_view', 'feature_opened', 'feature_completed')
- **details**: Detail tambahan (opsional)

### 2. `trackButtonClick(buttonName, location)`
Untuk melacak klik tombol
- **buttonName**: Nama tombol
- **location**: Lokasi tombol (halaman/komponen)

### 3. `trackPronunciation(action, symbol?)`
Untuk melacak interaksi pronunciation
- **action**: 'play_audio', 'watch_video', 'practice', 'complete'
- **symbol**: Simbol fonetik (opsional)

### 4. `trackGrammar(action, topic?)`
Untuk melacak interaksi grammar
- **action**: 'topic_opened', 'exercise_started', 'exercise_completed'
- **topic**: Topik grammar (opsional)

### 5. `trackVideo(action, videoId?)`
Untuk melacak interaksi video
- **action**: 'play', 'pause', 'complete', 'seek'
- **videoId**: ID video (opsional)

### 6. `trackAudio(action, audioType)`
Untuk melacak playback audio
- **action**: 'play', 'pause', 'complete'
- **audioType**: Tipe audio

### 7. `trackNavigation(from, to)`
Untuk melacak navigasi antar halaman
- **from**: Halaman asal
- **to**: Halaman tujuan

### 8. `trackUserJourney(step, action)`
Untuk melacak perjalanan user
- **step**: Langkah dalam journey
- **action**: Aksi yang dilakukan

### 9. `trackSearch(searchTerm, resultsCount?)`
Untuk melacak pencarian
- **searchTerm**: Kata kunci pencarian
- **resultsCount**: Jumlah hasil (opsional)

### 10. `trackError(errorType, errorMessage)`
Untuk melacak error
- **errorType**: Tipe error
- **errorMessage**: Pesan error

## Contoh Implementasi di Halaman Pronunciation

```typescript
'use client';

import { useEffect, useState } from 'react';
import { 
  trackFeatureUsage, 
  trackPronunciation,
  trackButtonClick 
} from '@/lib/analytics';

export default function PhoneticSymbolsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Track page view
  useEffect(() => {
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Symbols');
  }, []);

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    trackPronunciation('symbol_selected', symbol);
  };

  const handlePlayAudio = (symbol: string) => {
    trackPronunciation('play_audio', symbol);
    // ... play audio logic
  };

  const handleWatchVideo = (symbol: string) => {
    trackPronunciation('watch_video', symbol);
    // ... open video logic
  };

  const handleStartPractice = () => {
    trackButtonClick('Start Practice', 'Phonetic Symbols Page');
    trackPronunciation('practice_started');
    // ... start practice logic
  };

  return (
    <div>
      <h1>Phonetic Symbols</h1>
      {/* ... content */}
      <button onClick={handleStartPractice}>Start Practice</button>
    </div>
  );
}
```

## Melihat Data di Google Analytics

### 1. Real-time Reports
- Buka Google Analytics Dashboard
- Pilih "Reports" > "Realtime"
- Lihat user yang sedang aktif dan event yang terjadi

### 2. Events Report
- Pilih "Reports" > "Engagement" > "Events"
- Lihat semua event yang ter-track:
  - Feature Usage
  - Button Clicks
  - Pronunciation Interactions
  - Grammar Interactions
  - Video Interactions
  - Navigation
  - dll

### 3. Custom Reports
Anda bisa membuat custom report untuk:
- Fitur mana yang paling sering digunakan
- Simbol pronunciation mana yang paling sering dipelajari
- Topik grammar mana yang paling populer
- User journey dari landing sampai completion
- Conversion rate untuk setiap fitur

### 4. User Flow
- Pilih "Reports" > "User acquisition" > "User flow"
- Lihat bagaimana user bernavigasi di aplikasi Anda

## Tips Best Practices

1. **Jangan over-track**: Track hanya interaksi yang penting
2. **Gunakan naming convention yang konsisten**: 
   - Event names: lowercase dengan underscore (contoh: `play_audio`)
   - Categories: Title Case (contoh: `Feature Usage`)
3. **Tambahkan context**: Gunakan parameter `label` dan `value` untuk detail tambahan
4. **Test di development**: Gunakan Google Analytics Debug Mode untuk testing
5. **Privacy**: Jangan track data sensitif atau personal information

## Troubleshooting

### Analytics tidak muncul di dashboard?
1. Pastikan `NEXT_PUBLIC_GA_MEASUREMENT_ID` sudah diset di `.env.local`
2. Pastikan format Measurement ID benar (G-XXXXXXXXXX)
3. Tunggu 24-48 jam untuk data pertama muncul di reports (real-time langsung muncul)
4. Cek browser console untuk error

### Event tidak ter-track?
1. Pastikan komponen adalah client component (`'use client'`)
2. Cek apakah fungsi tracking dipanggil dengan benar
3. Gunakan Google Analytics Debugger extension untuk Chrome

### Data tidak akurat?
1. Pastikan tidak ada ad blocker yang aktif saat testing
2. Cek apakah ada duplicate tracking calls
3. Verifikasi event parameters sudah benar

## Next Steps

Setelah setup selesai, Anda bisa:
1. Implementasikan tracking di komponen-komponen utama
2. Monitor real-time data untuk verifikasi
3. Buat custom dashboard di Google Analytics
4. Setup goals dan conversions
5. Analisis data untuk improve user experience
