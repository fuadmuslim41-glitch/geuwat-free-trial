# Google Analytics Implementation Checklist

## ✅ Setup Phase (5-10 menit)

### Google Analytics Account
- [ ] Buka https://analytics.google.com/
- [ ] Login dengan Google account
- [ ] Buat account baru (nama: "GEUWAT Learning English")
- [ ] Buat property (nama: "GEUWAT Free Trial")
- [ ] Setup web stream
- [ ] Copy Measurement ID (format: G-XXXXXXXXXX)
- [ ] Enable Enhanced Measurement

### Project Configuration
- [ ] Buat file `.env.local` di root project
- [ ] Tambahkan `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- [ ] Ganti `G-XXXXXXXXXX` dengan Measurement ID yang sebenarnya
- [ ] Verifikasi `.env.local` ada di `.gitignore`
- [ ] Restart development server (`npm run dev`)

### Testing Setup
- [ ] Buka aplikasi di browser
- [ ] Buka Google Analytics Dashboard
- [ ] Pergi ke Reports > Realtime
- [ ] Verifikasi melihat 1 active user (Anda)
- [ ] Klik beberapa halaman, verifikasi page views ter-track
- [ ] Install Google Analytics Debugger extension (Chrome)
- [ ] Enable debugger dan cek console untuk events

---

## 📝 Implementation Phase (1-2 jam)

### Priority 1: Core Pages

#### Dashboard Page
- [ ] Import `trackFeatureUsage` dari `@/lib/analytics`
- [ ] Tambahkan `useEffect` untuk track page view
- [ ] Track button "Start Learning" click
- [ ] Track navigation ke skill pages
- [ ] Test di browser dan verifikasi events

#### Pronunciation Page (Phonetic Portal)
- [ ] Import fungsi tracking yang diperlukan
- [ ] Track page view saat halaman dibuka
- [ ] Track portal card clicks (Vowel, Consonant, Diphthong)
- [ ] Track "Phonetic Symbol Chart" button click
- [ ] Track "Common Mistakes" button click
- [ ] Track "Tongue Twister" button click
- [ ] Track "Summary" button click
- [ ] Test semua tracking

#### Pronunciation - Symbol Detail Page
- [ ] Track page view dengan symbol parameter
- [ ] Track audio playback untuk symbol
- [ ] Track video play/pause/complete
- [ ] Track navigation ke related symbols
- [ ] Track "Back" button click
- [ ] Test semua tracking

#### Grammar Page
- [ ] Track page view
- [ ] Track topic selection
- [ ] Track exercise start/complete
- [ ] Track navigation
- [ ] Test semua tracking

### Priority 2: Feature Interactions

#### Audio Playback
- [ ] Identify semua komponen dengan audio playback
- [ ] Tambahkan `trackPronunciation('play_audio', symbol)` atau `trackAudio('play', audioType)`
- [ ] Track pause events jika applicable
- [ ] Track complete events jika applicable
- [ ] Test audio tracking

#### Video Playback
- [ ] Identify semua komponen dengan video
- [ ] Tambahkan `trackVideo('play', videoId)`
- [ ] Track pause events
- [ ] Track complete events
- [ ] Track seek events jika applicable
- [ ] Test video tracking

#### Navigation
- [ ] Identify navigation points utama
- [ ] Tambahkan `trackNavigation(from, to)` sebelum `router.push()`
- [ ] Track back button clicks
- [ ] Track sidebar navigation
- [ ] Track bottom nav clicks
- [ ] Test navigation tracking

#### Modal/Popup
- [ ] Identify semua modal/popup
- [ ] Track modal open events
- [ ] Track modal close events
- [ ] Track actions dalam modal
- [ ] Test modal tracking

### Priority 3: User Journey & Conversion

#### Premium Features
- [ ] Track "Daftar Sekarang" button clicks
- [ ] Track premium modal opens
- [ ] Track dari fitur mana user klik premium
- [ ] Add event labels untuk differentiate features
- [ ] Test premium tracking

#### User Journey
- [ ] Identify key steps dalam user journey
- [ ] Track onboarding steps jika ada
- [ ] Track first-time user actions
- [ ] Track completion milestones
- [ ] Test journey tracking

#### Search (jika ada)
- [ ] Track search queries
- [ ] Track search results count
- [ ] Track search result clicks
- [ ] Test search tracking

#### Errors
- [ ] Identify error handling points
- [ ] Tambahkan `trackError(errorType, errorMessage)`
- [ ] Track API errors
- [ ] Track user-facing errors
- [ ] Test error tracking

---

## 🧪 Testing Phase (30 menit)

### Manual Testing
- [ ] Test semua page views
- [ ] Test semua button clicks
- [ ] Test audio playback tracking
- [ ] Test video tracking
- [ ] Test navigation tracking
- [ ] Test modal tracking
- [ ] Test premium feature tracking
- [ ] Test error tracking

### GA Debugger Testing
- [ ] Enable GA Debugger extension
- [ ] Open browser console
- [ ] Perform actions dan verify events di console
- [ ] Check event parameters correct
- [ ] Check event names consistent
- [ ] Check no duplicate events

### Real-time Verification
- [ ] Open GA Dashboard > Realtime
- [ ] Perform actions di aplikasi
- [ ] Verify events muncul di real-time (1-2 menit delay)
- [ ] Check event counts correct
- [ ] Check event parameters visible

### Cross-browser Testing
- [ ] Test di Chrome
- [ ] Test di Firefox
- [ ] Test di Safari (jika Mac)
- [ ] Test di Edge
- [ ] Test di mobile browser

---

## 📊 Monitoring Phase (Ongoing)

### Daily Monitoring (Minggu Pertama)
- [ ] Cek real-time reports setiap hari
- [ ] Verify events ter-track dengan benar
- [ ] Check for any anomalies
- [ ] Monitor event counts
- [ ] Check for errors in tracking

### Weekly Analysis (Setelah 1 Minggu)
- [ ] Open Events report (Reports > Engagement > Events)
- [ ] Analyze top events
- [ ] Identify most used features
- [ ] Check user flow
- [ ] Identify drop-off points

### Custom Reports Setup
- [ ] Buat "Feature Usage" report
- [ ] Buat "Pronunciation Interaction" report
- [ ] Buat "User Journey" report
- [ ] Buat "Button Click" report
- [ ] Buat "Conversion Funnel" report

### Goals & Conversions Setup
- [ ] Define conversion goals
- [ ] Setup goals di GA
- [ ] Track conversion rate
- [ ] Analyze conversion funnel
- [ ] Optimize based on data

---

## 🔧 Optimization Phase (Setelah 2-4 Minggu)

### Data Analysis
- [ ] Identify most popular features
- [ ] Identify least used features
- [ ] Analyze user flow patterns
- [ ] Find bottlenecks
- [ ] Identify drop-off points

### Insights & Actions
- [ ] Document key insights
- [ ] Prioritize optimization opportunities
- [ ] Plan feature improvements
- [ ] Plan UX improvements
- [ ] Plan content improvements

### A/B Testing (Optional)
- [ ] Identify elements to test
- [ ] Setup A/B test tracking
- [ ] Run experiments
- [ ] Analyze results
- [ ] Implement winners

---

## 📚 Documentation

### Code Documentation
- [ ] Document all tracking events
- [ ] Maintain event naming convention
- [ ] Document event parameters
- [ ] Share with team
- [ ] Update as needed

### Analytics Documentation
- [ ] Document custom reports
- [ ] Document goals & conversions
- [ ] Document key metrics
- [ ] Document insights
- [ ] Share with stakeholders

---

## 🎯 Success Metrics

### Week 1
- [ ] All core pages tracked
- [ ] All button clicks tracked
- [ ] Real-time data visible
- [ ] No tracking errors

### Week 2
- [ ] All features tracked
- [ ] Events report showing data
- [ ] Custom reports created
- [ ] Team trained on GA

### Month 1
- [ ] Full data collection
- [ ] Key insights identified
- [ ] Optimization plan created
- [ ] First improvements implemented

### Month 3
- [ ] Data-driven decisions made
- [ ] Measurable improvements
- [ ] ROI demonstrated
- [ ] Continuous optimization

---

## 🆘 Troubleshooting Checklist

### Data tidak muncul
- [ ] Cek Measurement ID di `.env.local`
- [ ] Cek format ID benar (G-XXXXXXXXXX)
- [ ] Restart development server
- [ ] Clear browser cache
- [ ] Disable ad blocker
- [ ] Check browser console for errors
- [ ] Verify GA script loaded (Network tab)

### Events tidak ter-track
- [ ] Cek komponen adalah client component (`'use client'`)
- [ ] Cek fungsi tracking dipanggil
- [ ] Cek event parameters correct
- [ ] Check console for errors
- [ ] Use GA Debugger to debug
- [ ] Verify GA_MEASUREMENT_ID not empty

### Duplicate events
- [ ] Check for multiple tracking calls
- [ ] Check useEffect dependencies
- [ ] Check for multiple AnalyticsProvider
- [ ] Verify no double imports

### Real-time delay
- [ ] Wait 1-2 menit after event
- [ ] Refresh GA dashboard
- [ ] Check filters di real-time report
- [ ] Verify correct property selected

---

## 📋 Quick Reference

### Files Created
```
✅ lib/analytics.ts
✅ hooks/useAnalytics.ts
✅ app/components/AnalyticsProvider.tsx
✅ app/layout.tsx (updated)
✅ .env.local.example
```

### Documentation Files
```
✅ README_ANALYTICS.md (START HERE!)
✅ ANALYTICS_QUICK_START.md
✅ GOOGLE_ANALYTICS_SETUP.md
✅ ANALYTICS_IMPLEMENTATION_GUIDE.md
✅ ANALYTICS_EXAMPLE_IMPLEMENTATION.tsx
✅ ANALYTICS_SUMMARY.md
✅ ANALYTICS_CHECKLIST.md (this file)
```

### Key Functions
```typescript
trackFeatureUsage(featureName, action, details?)
trackButtonClick(buttonName, location)
trackPronunciation(action, symbol?)
trackGrammar(action, topic?)
trackVideo(action, videoId?)
trackAudio(action, audioType)
trackNavigation(from, to)
trackSearch(searchTerm, resultsCount?)
trackError(errorType, errorMessage)
```

---

## ✅ Final Checklist

- [ ] Setup completed
- [ ] All core pages tracked
- [ ] All features tracked
- [ ] Testing completed
- [ ] Real-time data verified
- [ ] Custom reports created
- [ ] Team trained
- [ ] Documentation complete
- [ ] Monitoring in place
- [ ] Optimization plan ready

---

**Congratulations! 🎉**

Anda sudah siap untuk tracking user behavior dan mengoptimalkan aplikasi berdasarkan data!

**Next:** Mulai dari `README_ANALYTICS.md` untuk overview lengkap.
