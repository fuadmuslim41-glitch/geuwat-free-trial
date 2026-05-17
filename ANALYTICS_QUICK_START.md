# Google Analytics - Quick Start Guide 🚀

## Setup dalam 5 Menit

### 1️⃣ Dapatkan Google Analytics ID

1. Buka https://analytics.google.com/
2. Buat account & property baru
3. Setup web stream
4. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2️⃣ Konfigurasi Environment Variable

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Ganti `G-XXXXXXXXXX` dengan ID Anda yang sebenarnya.

### 3️⃣ Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 4️⃣ Test

1. Buka aplikasi di browser
2. Buka Google Analytics > Reports > Realtime
3. Anda harus melihat 1 active user (Anda!)

✅ **Setup selesai!** Analytics sudah berjalan dan tracking page views otomatis.

---

## Implementasi Tracking di Komponen

### Import Fungsi Tracking

```typescript
import { 
  trackFeatureUsage, 
  trackButtonClick,
  trackPronunciation 
} from '@/lib/analytics';
```

### Track Page View

```typescript
'use client';

import { useEffect } from 'react';
import { trackFeatureUsage } from '@/lib/analytics';

export default function MyPage() {
  useEffect(() => {
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Symbols');
  }, []);

  return <div>Content</div>;
}
```

### Track Button Click

```typescript
const handleClick = () => {
  trackButtonClick('Start Learning', 'Dashboard');
  // ... your logic
};

return <button onClick={handleClick}>Start Learning</button>;
```

### Track Audio Playback

```typescript
const playAudio = (symbol: string) => {
  trackPronunciation('play_audio', symbol);
  // ... play audio logic
};
```

---

## Fungsi Tracking yang Tersedia

| Fungsi | Kegunaan | Contoh |
|--------|----------|--------|
| `trackFeatureUsage()` | Track penggunaan fitur | `trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Symbols')` |
| `trackButtonClick()` | Track klik button | `trackButtonClick('Play Audio', 'Symbol Detail')` |
| `trackPronunciation()` | Track interaksi pronunciation | `trackPronunciation('play_audio', 'æ')` |
| `trackGrammar()` | Track interaksi grammar | `trackGrammar('topic_opened', 'Present Tense')` |
| `trackVideo()` | Track video playback | `trackVideo('play', 'intro_video')` |
| `trackAudio()` | Track audio playback | `trackAudio('play', 'phonetic_æ')` |
| `trackNavigation()` | Track navigasi | `trackNavigation('Dashboard', 'Pronunciation')` |
| `trackSearch()` | Track pencarian | `trackSearch('present tense', 5)` |

---

## Melihat Data

### Real-time (Langsung)
1. Google Analytics > Reports > Realtime
2. Lihat active users dan events

### Historical (24-48 jam)
1. Google Analytics > Reports > Engagement > Events
2. Lihat semua events yang ter-track

### Custom Reports
1. Google Analytics > Explore
2. Buat custom report sesuai kebutuhan

---

## Contoh Implementasi Lengkap

```typescript
'use client';

import { useEffect } from 'react';
import { 
  trackFeatureUsage, 
  trackButtonClick,
  trackPronunciation,
  trackNavigation 
} from '@/lib/analytics';

export default function PhoneticSymbolsPage() {
  // Track page view saat halaman dibuka
  useEffect(() => {
    trackFeatureUsage('Pronunciation', 'page_view', 'Phonetic Symbols');
  }, []);

  // Track button click
  const handleOpenChart = () => {
    trackButtonClick('Open Symbol Chart', 'Phonetic Symbols Page');
    // ... open chart logic
  };

  // Track audio playback
  const playSymbolAudio = (symbol: string) => {
    trackPronunciation('play_audio', symbol);
    // ... play audio logic
  };

  // Track navigation
  const goToDetail = (symbol: string) => {
    trackNavigation('Phonetic Symbols', `Symbol Detail - ${symbol}`);
    trackPronunciation('symbol_detail_opened', symbol);
    // ... navigation logic
  };

  return (
    <div>
      <h1>Phonetic Symbols</h1>
      
      <button onClick={handleOpenChart}>
        Open Chart
      </button>
      
      <button onClick={() => playSymbolAudio('æ')}>
        Play /æ/
      </button>
      
      <button onClick={() => goToDetail('æ')}>
        View Details
      </button>
    </div>
  );
}
```

---

## Metrics yang Bisa Anda Track

✅ **User Behavior**
- Halaman mana yang paling sering dikunjungi
- Berapa lama user di setiap halaman
- User flow (urutan navigasi)

✅ **Feature Usage**
- Fitur mana yang paling populer
- Symbol phonetic mana yang paling sering dipelajari
- Berapa banyak user yang play audio/video

✅ **Engagement**
- Button mana yang paling sering diklik
- Modal mana yang paling sering dibuka
- Completion rate untuk exercises

✅ **Conversion**
- Berapa user yang klik "Daftar Sekarang"
- Dari fitur mana user tertarik upgrade
- User journey dari landing ke conversion

---

## Troubleshooting

### Data tidak muncul?
1. ✅ Cek Measurement ID di `.env.local` sudah benar
2. ✅ Restart development server
3. ✅ Disable ad blocker
4. ✅ Tunggu 1-2 menit untuk real-time data

### Events tidak ter-track?
1. ✅ Pastikan komponen adalah client component (`'use client'`)
2. ✅ Cek fungsi tracking dipanggil dengan benar
3. ✅ Lihat browser console untuk errors

---

## Files yang Sudah Dibuat

✅ `lib/analytics.ts` - Fungsi tracking
✅ `hooks/useAnalytics.ts` - Custom hook
✅ `app/components/AnalyticsProvider.tsx` - Provider component
✅ `app/layout.tsx` - Sudah dikonfigurasi
✅ `.env.local.example` - Template environment variable

---

## Dokumentasi Lengkap

📖 **Setup Detail**: Lihat `GOOGLE_ANALYTICS_SETUP.md`
📖 **Contoh Implementasi**: Lihat `ANALYTICS_IMPLEMENTATION_GUIDE.md`
📖 **Code Examples**: Lihat `ANALYTICS_EXAMPLE_IMPLEMENTATION.tsx`

---

## Next Steps

1. ✅ Setup Google Analytics (5 menit)
2. ✅ Test real-time tracking
3. 📝 Implementasi tracking di komponen utama
4. 📊 Monitor data dan analisis
5. 🚀 Optimize berdasarkan insights

---

**Selamat! Anda siap tracking user behavior! 🎉**

Untuk pertanyaan lebih lanjut, lihat dokumentasi lengkap di `GOOGLE_ANALYTICS_SETUP.md`
