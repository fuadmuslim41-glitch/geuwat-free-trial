/**
 * Page-Specific Guide Configuration
 * 
 * Each page has its own independent guide that can be started and completed
 * within that page without requiring navigation to other pages.
 */

import { GuideStep } from '@/types/guide';

/**
 * Dashboard - Start Journey Guide
 */
export const DASHBOARD_GUIDE: GuideStep[] = [
  {
    id: 'dashboard-mission-form',
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-mission-form"]',
    tooltipText: 'Selamat datang di GEUWAT! Mari kita mulai tur singkat untuk mengenal fitur-fitur aplikasi.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'dashboard-mission-enter',
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-mission-enter"]',
    tooltipText: 'Klik tombol "Bimbing saya" untuk melihat fase pelatihan Anda.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'dashboard-ready-phase-1',
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-ready-phase-1"]',
    tooltipText: 'Ini adalah fase 1 pelatihan Anda. Klik untuk mengaktifkan fase ini.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'dashboard-ready-phase-2',
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-ready-phase-2"]',
    tooltipText: 'Ini adalah fase 2 pelatihan Anda. Klik untuk mengaktifkan fase ini.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'dashboard-ready-phase-3',
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-ready-phase-3"]',
    tooltipText: 'Ini adalah fase 3 pelatihan Anda. Anda akan melalui 3 fase pembelajaran secara bertahap.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'dashboard-initiate-training',
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-initiate-training"]',
    tooltipText: 'Klik tombol "INITIATE TRAINING" untuk memulai pelatihan Anda. Panduan selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
];

/**
 * Skill Selection Guide
 */
export const SKILL_SELECTION_GUIDE: GuideStep[] = [
  {
    id: 'skill-status',
    route: '/skill',
    targetSelector: '[data-tour="skill-status"]',
    tooltipText: 'Status "ACTIVE" menunjukkan bahwa skill pronunciation siap digunakan.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'skill-execute',
    route: '/skill',
    targetSelector: '[data-tour="skill-execute-button"]',
    tooltipText: 'Klik tombol "EXECUTE" untuk membuka menu pronunciation. Panduan selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
];

/**
 * Pronunciation Menu Guide
 */
export const PRONUNCIATION_MENU_GUIDE: GuideStep[] = [
  {
    id: 'pronunciation-title',
    route: '/skill/pronunciation',
    targetSelector: '[data-tour="pronunciation-title"]',
    tooltipText: 'Selamat datang di menu Pronunciation! Di sini Anda bisa memilih berbagai topik pronunciation.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'pronunciation-carousel',
    route: '/skill/pronunciation',
    targetSelector: '[data-tour="pronunciation-carousel"]',
    tooltipText: 'Gunakan carousel ini untuk melihat berbagai topik pronunciation yang tersedia.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'pronunciation-phonetic',
    route: '/skill/pronunciation',
    targetSelector: '[data-tour="pronunciation-phonetic"]',
    tooltipText: 'Klik kartu "Phonetic Symbols" untuk belajar simbol-simbol fonetik.',
    tooltipPosition: 'right',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'pronunciation-alphabet',
    route: '/skill/pronunciation',
    targetSelector: '[data-tour="pronunciation-alphabet"]',
    tooltipText: 'Atau klik "Alphabet" untuk belajar pengucapan huruf-huruf.',
    tooltipPosition: 'right',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'pronunciation-execute-button',
    route: '/skill/pronunciation',
    targetSelector: '[data-tour="pronunciation-execute-button"]',
    tooltipText: 'Klik tombol CPU untuk membuka topik yang dipilih. Panduan selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
];

/**
 * Alphabet Page Guide
 */
export const ALPHABET_GUIDE: GuideStep[] = [
  {
    id: 'alphabet-play-all',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-play-all"]',
    tooltipText: 'Tombol "play all" akan memutar audio pengucapan semua huruf secara berurutan.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-cards',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-cards"]',
    tooltipText: 'Kartu huruf ini bisa diklik untuk mendengar pengucapannya.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-quick-spelling',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-quick-spelling"]',
    tooltipText: 'Bagian "Latihan Quick Spelling" membantu Anda meningkatkan kemampuan mengeja dengan cepat.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-notes',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-notes"]',
    tooltipText: 'Bagian "Catatan untuk Penutur Indonesia" memberikan tips khusus untuk penutur bahasa Indonesia.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-practice-button',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-practice"]',
    tooltipText: 'Tombol "Practice" ini untuk latihan pronunciation interaktif.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-prompt-input',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-prompt"]',
    tooltipText: 'Di sini Anda bisa masukkan kata atau kalimat untuk berlatih pronunciation dengan AI.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-recording-panel',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-recording"]',
    tooltipText: 'Panel recording ini akan muncul saat Anda berlatih. Gunakan untuk merekam suara Anda.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'alphabet-close-recording',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-close-recording"]',
    tooltipText: 'Tombol X ini untuk menutup panel recording.',
    tooltipPosition: 'left',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'none',
  },
  {
    id: 'alphabet-back-button',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-back"]',
    tooltipText: 'Selamat! Anda telah menyelesaikan panduan Alphabet. Klik tombol back untuk kembali.',
    tooltipPosition: 'right',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'none',
  },
];

/**
 * Phonetic Portal Guide
 */
export const PHONETIC_PORTAL_GUIDE: GuideStep[] = [
  {
    id: 'phonetic-portal-title',
    route: '/skill/pronunciation/phoneticSymbols',
    targetSelector: '.portal-title',
    tooltipText: 'Selamat datang di Phonetic Portal! Di sini Anda bisa belajar simbol-simbol fonetik.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-vowel-portal',
    route: '/skill/pronunciation/phoneticSymbols',
    targetSelector: '[data-tour="phonetic-portal-vowel"]',
    tooltipText: 'Klik portal "VOWELS" untuk melihat semua simbol vokal.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-symbol-i',
    route: '/skill/pronunciation/phoneticSymbols',
    targetSelector: '[data-tour="phonetic-symbol-i"]',
    tooltipText: 'Klik simbol "i" untuk melihat detail lengkap pengucapannya. Panduan selesai!',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
];

/**
 * Phonetic Detail Guide
 */
export const PHONETIC_DETAIL_GUIDE: GuideStep[] = [
  {
    id: 'phonetic-detail-play',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-play"]',
    tooltipText: 'Ikon play ini untuk mendengar pengucapan simbol fonetik.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-detail-examples',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-examples"]',
    tooltipText: 'Ini adalah contoh kata yang menggunakan simbol ini, seperti "see" dan "teacher".',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-detail-tips',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-tips"]',
    tooltipText: 'Bagian "PRONUNCIATION_TIPS" memberikan tips cara mengucapkan simbol ini dengan benar.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-detail-common-letters',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-common-letters"]',
    tooltipText: 'Klik ikon "common letters" untuk melihat huruf-huruf yang biasanya menghasilkan suara ini.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-detail-close-popup',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-close-popup"]',
    tooltipText: 'Klik tombol X untuk menutup popup common letters.',
    tooltipPosition: 'left',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'none',
  },
  {
    id: 'phonetic-detail-alternative-audio',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-alternative-audio"]',
    tooltipText: 'Bagian "ALTERNATIVE_AUDIO" menyediakan variasi pengucapan dari penutur yang berbeda.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-detail-practice',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-practice"]',
    tooltipText: 'Tombol "PRACTICE" ini untuk berlatih mengucapkan simbol dengan AI.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  {
    id: 'phonetic-detail-back',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-back"]',
    tooltipText: 'Selamat! Anda telah menyelesaikan panduan detail phonetic. Klik tombol back untuk kembali.',
    tooltipPosition: 'right',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'none',
  },
];

/**
 * Map of page routes to their guide configurations
 */
export const PAGE_GUIDES: Record<string, GuideStep[]> = {
  '/dashboard': DASHBOARD_GUIDE,
  '/skill': SKILL_SELECTION_GUIDE,
  '/skill/pronunciation': PRONUNCIATION_MENU_GUIDE,
  '/skill/pronunciation/alphabet': ALPHABET_GUIDE,
  '/skill/pronunciation/phoneticSymbols': PHONETIC_PORTAL_GUIDE,
  '/skill/pronunciation/phoneticSymbols/i': PHONETIC_DETAIL_GUIDE,
};

/**
 * Get guide for a specific page
 */
export function getGuideForPage(route: string): GuideStep[] | null {
  return PAGE_GUIDES[route] || null;
}

/**
 * Check if a page has a guide
 */
export function hasGuide(route: string): boolean {
  return route in PAGE_GUIDES;
}
