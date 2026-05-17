# Setup Google Analytics - Panduan Lengkap

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Setup Google Analytics](#setup-google-analytics)
3. [Konfigurasi Project](#konfigurasi-project)
4. [Testing](#testing)
5. [Implementasi Tracking](#implementasi-tracking)
6. [Melihat Data](#melihat-data)

---

## 🚀 Persiapan

### Yang Sudah Diinstall
✅ Package `@next/third-parties` sudah ada di `package.json`
✅ File tracking sudah dibuat di `lib/analytics.ts`
✅ Layout sudah dikonfigurasi untuk Google Analytics
✅ Custom hooks sudah dibuat

### Yang Perlu Anda Lakukan
1. Buat Google Analytics account
2. Dapatkan Measurement ID
3. Konfigurasi environment variable
4. Implementasi tracking di komponen

---

## 📊 Setup Google Analytics

### Langkah 1: Buat Google Analytics Account

1. **Buka Google Analytics**
   - Kunjungi: https://analytics.google.com/
   - Login dengan Google account Anda

2. **Buat Account Baru**
   - Klik "Start measuring"
   - Isi nama account (contoh: "GEUWAT Learning English")
   - Pilih data sharing settings sesuai kebutuhan
   - Klik "Next"

3. **Buat Property**
   - Property name: "GEUWAT Free Trial"
   - Reporting time zone: "Indonesia" (GMT+7)
   - Currency: "Indonesian Rupiah (IDR)"
   - Klik "Next"

4. **Business Information**
   - Industry category: "Education"
   - Business size: Pilih sesuai
   - Klik "Next"

5. **Business Objectives**
   - Pilih: "Examine user behavior"
   - Klik "Create"

6. **Accept Terms of Service**
   - Baca dan accept terms
   - Klik "I Accept"

### Langkah 2: Setup Data Stream

1. **Pilih Platform**
   - Pilih "Web"

2. **Setup Web Stream**
   - Website URL: `https://your-domain.com` (atau localhost untuk testing)
   - Stream name: "GEUWAT Free Trial Web"
   - Klik "Create stream"

3. **Dapatkan Measurement ID**
   - Setelah stream dibuat, Anda akan melihat **Measurement ID**
   - Format: `G-XXXXXXXXXX`
   - **COPY ID INI** - Anda akan membutuhkannya!

### Langkah 3: Enhanced Measurement (Opsional tapi Recommended)

Di halaman Web stream details:
- Scroll ke "Enhanced measurement"
- Pastikan toggle ON untuk:
  - ✅ Page views
  - ✅ Scrolls
  - ✅ Outbound clicks
  - ✅ Site search
  - ✅ Video engagement
  - ✅ File downloads

---

## ⚙️ Konfigurasi Project

### Langkah 1: Buat File .env.local

Di root project, buat file `.env.local`:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**PENTING:**
- Ganti `G-XXXXXXXXXX` dengan Measurement ID Anda yang sebenarnya
- File `.env.local` sudah ada di `.gitignore`, jadi aman
- Jangan commit file ini ke Git!

### Langkah 2: Restart Development Server

```bash
# Stop server yang sedang berjalan (Ctrl+C)
# Kemudian jalankan lagi:
npm run dev
```

Server harus di-restart agar environment variable terbaca.

---

## 🧪 Testing

### Test 1: Verifikasi Setup

1. **Buka Browser**
   - Buka aplikasi Anda di browser
   - Buka Developer Tools (F12)
   - Pergi ke tab "Console"

2. **Cek Google Analytics Script**
   - Buka tab "Network"
   - Filter: "gtag" atau "analytics"
   - Refresh halaman
   - Anda harus melihat request ke Google Analytics

3. **Cek di Google Analytics Real-time**
   - Buka Google Analytics Dashboard
   - Pilih "Reports" > "Realtime"
   - Anda harus melihat 1 active user (Anda!)

### Test 2: Test Event Tracking

1. **Install Google Analytics Debugger** (Chrome Extension)
   - https://chrome.google.com/webstore/detail/google-analytics-debugger/

2. **Enable Debugger**
   - Klik icon extension
   - Buka Console di Developer Tools
   - Anda akan melihat detailed GA events

3. **Test Events**
   - Klik berbagai button di aplikasi
   - Lihat events di Console
   - Verifikasi events muncul di GA Real-time

### Test 3: Disable Ad Blocker

Jika tidak melihat data:
- Disable ad blocker untuk localhost
- Disable privacy extensions sementara
- Coba di Incognito mode

---

## 📝 Implementasi Tracking

### File-file yang Sudah Dibuat

1. **`lib/analytics.ts`**
   - Fungsi-fungsi tracking
   - Event definitions
   - TypeScript types

2. **`hooks/useAnalytics.ts`**
   - Custom hook untuk page tracking
   - Automatic page view tracking

3. **`app/components/AnalyticsProvider.tsx`**
   - Provider component
   - Sudah diintegrasikan di layout

4. **`app/layout.tsx`**
   - Google Analytics script
   - Analytics Provider wrapper

### Cara Implementasi di Komponen Anda

#### 1. Import Fungsi Tracking

```typescript
import { 
  trackFeatureUsage, 
  trackButtonClick,
  trackPronunciation 
} from '@/lib/analytics';
```

#### 2. Track Page View

```typescript
'use client';

import { useEffect } from 'react';
import { trackFeatureUsage } from '@/lib/analytics';

export default function MyPage() {
  useEffect(() => {
    trackFeatureUsage('Feature Name', 'page_view', 'Page Name');
  }, []);

  return <div>Content</div>;
}
```

#### 3. Track Button Click

```typescript
const handleClick = () => {
  trackButtonClick('Button Name', 'Location');
  // ... your logic
};

return <button onClick={handleClick}>Click Me</button>;
```

#### 4. Track Audio Playback

```typescript
const playAudio = (symbol: string) => {
  trackPronunciation('play_audio', symbol);
  // ... play audio logic
};
```

### Contoh Lengkap

Lihat file `ANALYTICS_EXAMPLE_IMPLEMENTATION.tsx` untuk contoh lengkap implementasi di berbagai komponen.

---

## 📈 Melihat Data di Google Analytics

### Real-time Reports

**Untuk melihat data langsung:**

1. Buka Google Analytics Dashboard
2. Pilih "Reports" > "Realtime"
3. Lihat:
   - Active users saat ini
   - Page views
   - Events yang terjadi
   - User locations
   - Traffic sources

### Events Report

**Untuk melihat semua events:**

1. Pilih "Reports" > "Engagement" > "Events"
2. Anda akan melihat:
   - Event count
   - Event names
   - Event parameters
   - User engagement

### Custom Reports

**Membuat custom report:**

1. Pilih "Explore" di sidebar
2. Klik "Blank" untuk membuat report baru
3. Drag and drop dimensions dan metrics:
   - **Dimensions**: Event name, Page path, User type
   - **Metrics**: Event count, Users, Sessions

### Contoh Reports yang Berguna

#### 1. Feature Usage Report
- **Dimension**: Event label
- **Metric**: Event count
- **Filter**: Event category = "Feature Usage"
- **Insight**: Fitur mana yang paling sering digunakan

#### 2. Pronunciation Interaction Report
- **Dimension**: Event label (symbol)
- **Metric**: Event count
- **Filter**: Event category = "Pronunciation"
- **Insight**: Symbol mana yang paling sering dipelajari

#### 3. User Journey Report
- **Dimension**: Page path
- **Metric**: Users, Sessions, Engagement time
- **Insight**: Bagaimana user bernavigasi di aplikasi

#### 4. Button Click Report
- **Dimension**: Event label (button name)
- **Metric**: Event count
- **Filter**: Event category = "Button"
- **Insight**: Button mana yang paling sering diklik

#### 5. Video Engagement Report
- **Dimension**: Event label (video ID)
- **Metric**: Event count
- **Filter**: Event category = "Video"
- **Insight**: Video mana yang paling banyak ditonton

---

## 🎯 Metrics yang Bisa Anda Track

### User Behavior
- ✅ Halaman mana yang paling sering dikunjungi
- ✅ Berapa lama user di setiap halaman
- ✅ Urutan navigasi user (user flow)
- ✅ Bounce rate per halaman

### Feature Usage
- ✅ Fitur pronunciation vs grammar vs vocabulary
- ✅ Symbol phonetic mana yang paling populer
- ✅ Berapa banyak user yang play audio
- ✅ Berapa banyak user yang watch video

### Engagement
- ✅ Button mana yang paling sering diklik
- ✅ Modal mana yang paling sering dibuka
- ✅ Berapa lama user engage dengan fitur
- ✅ Completion rate untuk exercises

### Conversion
- ✅ Berapa user yang klik "Daftar Sekarang"
- ✅ Dari fitur mana user paling tertarik upgrade
- ✅ User journey dari landing ke conversion

### Technical
- ✅ Error yang terjadi
- ✅ Performance issues
- ✅ Browser dan device yang digunakan
- ✅ Geographic location users

---

## 🔍 Troubleshooting

### Problem: Data tidak muncul di Google Analytics

**Solusi:**
1. Cek Measurement ID sudah benar di `.env.local`
2. Restart development server
3. Tunggu 24-48 jam untuk historical data (real-time langsung)
4. Cek browser console untuk errors
5. Disable ad blocker

### Problem: Events tidak ter-track

**Solusi:**
1. Pastikan komponen adalah client component (`'use client'`)
2. Cek fungsi tracking dipanggil dengan benar
3. Lihat console untuk errors
4. Install GA Debugger extension untuk debugging

### Problem: Duplicate events

**Solusi:**
1. Cek tidak ada double tracking calls
2. Pastikan useEffect dependencies benar
3. Cek tidak ada multiple AnalyticsProvider

### Problem: Real-time data tidak muncul

**Solusi:**
1. Tunggu 1-2 menit setelah event
2. Refresh GA dashboard
3. Cek filter di real-time report
4. Verifikasi Measurement ID

---

## 📚 Resources

### Documentation
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [@next/third-parties](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)

### Tools
- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)

### Learning
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)
- [GA4 for Beginners](https://skillshop.exceedlms.com/student/path/508845-google-analytics-4)

---

## ✅ Checklist Setup

- [ ] Buat Google Analytics account
- [ ] Buat property dan data stream
- [ ] Dapatkan Measurement ID
- [ ] Buat file `.env.local` dengan Measurement ID
- [ ] Restart development server
- [ ] Test di browser - lihat real-time data
- [ ] Implementasi tracking di komponen utama
- [ ] Test events dengan GA Debugger
- [ ] Buat custom reports di GA dashboard
- [ ] Monitor data selama beberapa hari
- [ ] Analisis dan optimize berdasarkan data

---

## 🎉 Next Steps

Setelah setup selesai:

1. **Implementasi Tracking**
   - Tambahkan tracking ke semua komponen penting
   - Lihat `ANALYTICS_EXAMPLE_IMPLEMENTATION.tsx` untuk contoh

2. **Monitor Data**
   - Cek real-time reports setiap hari
   - Lihat trends dalam events report

3. **Analisis**
   - Identifikasi fitur yang paling populer
   - Temukan bottlenecks dalam user journey
   - Optimize berdasarkan data

4. **Iterate**
   - Tambahkan tracking untuk fitur baru
   - Refine event parameters
   - Buat custom reports lebih detail

---

## 💡 Tips

1. **Naming Convention**
   - Gunakan lowercase dengan underscore untuk event actions
   - Gunakan Title Case untuk categories
   - Konsisten di semua tracking calls

2. **Don't Over-track**
   - Track hanya yang penting
   - Terlalu banyak events = data noise

3. **Privacy**
   - Jangan track PII (Personal Identifiable Information)
   - Jangan track passwords atau sensitive data
   - Follow GDPR guidelines jika applicable

4. **Testing**
   - Selalu test di development dulu
   - Gunakan GA Debugger untuk verify
   - Check real-time reports

5. **Documentation**
   - Document semua events yang di-track
   - Maintain list of event names dan meanings
   - Share dengan team

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek troubleshooting section di atas
2. Lihat Google Analytics documentation
3. Check browser console untuk errors
4. Test dengan GA Debugger extension

---

**Selamat! Setup Google Analytics Anda sudah siap! 🎉**

Sekarang Anda bisa mulai tracking user behavior dan mengoptimalkan aplikasi berdasarkan data real.
