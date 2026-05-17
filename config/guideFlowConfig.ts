/**
 * Guide Flow Configuration
 * 
 * This file contains independent page guides (no cross-page navigation):
 * - Dashboard (6 steps) - Complete on dashboard
 * - Skill Selection (2 steps) - Complete on skill page
 * - Pronunciation Menu (5 steps) - Complete on pronunciation menu
 * - Phonetic Portal (3 steps) - Complete on phonetic portal
 * - Phonetic Detail Page (10 steps) - Complete on phonetic detail
 * - Alphabet Page (10 steps) - Complete on alphabet page
 * - Vocabulary List Page (5 steps) - Complete on vocabulary list
 * - Vocabulary Detail Page (8 steps) - Complete on vocabulary detail
 * 
 * Each guide is independent and completes within its own page.
 */

import { GuideStep } from '@/types/guide';

/**
 * Complete guide flow configuration
 * Total: 49 steps across 8 independent page guides
 */
export const GUIDE_FLOW: GuideStep[] = [
  // ============================================================================
  // DASHBOARD STEPS (6 steps)
  // ============================================================================
  
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
    tooltipText: 'Klik tombol "INITIATE TRAINING" untuk memulai pelatihan Anda. Panduan dashboard selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  // ============================================================================
  // SKILL SELECTION STEPS (2 steps)
  // ============================================================================
  
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
    tooltipText: 'Klik tombol "EXECUTE" untuk membuka menu pronunciation. Panduan skill selection selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  // ============================================================================
  // PRONUNCIATION MENU STEPS (5 steps)
  // ============================================================================
  
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
    scrollBehavior: 'none',
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
    scrollBehavior: 'none',
  },
  
  {
    id: 'pronunciation-execute-button',
    route: '/skill/pronunciation',
    targetSelector: '[data-tour="pronunciation-execute-button"]',
    tooltipText: 'Klik tombol CPU untuk membuka topik yang dipilih. Panduan pronunciation menu selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  // ============================================================================
  // PHONETIC PORTAL STEPS (3 steps)
  // ============================================================================
  
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
    tooltipText: 'Klik simbol "i" untuk melihat detail lengkap pengucapannya. Panduan phonetic portal selesai!',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  // ============================================================================
  // PHONETIC DETAIL PAGE STEPS (10 steps)
  // ============================================================================
  
  {
    id: 'phonetic-detail-play',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-play"]',
    tooltipText: 'Klik ikon play untuk mendengar pengucapan simbol fonetik.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'phonetic-detail-word-see',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="symbol-word-see"]',
    tooltipText: 'Klik kartu kata "see" untuk mendengar pengucapannya.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'phonetic-detail-word-teacher',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="symbol-word-teacher"]',
    tooltipText: 'Klik kartu kata "teacher" untuk mendengar pengucapannya.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'phonetic-detail-tips',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-tips"]',
    tooltipText: 'Klik bagian "PRONUNCIATION_TIPS" untuk melihat tips cara mengucapkan simbol ini.',
    tooltipPosition: 'top',
    mode: 'interactive',
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
    tooltipText: 'Klik bagian "ALTERNATIVE_AUDIO" untuk mendengar variasi pengucapan dari penutur yang berbeda.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'phonetic-detail-practice',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="phonetic-practice"]',
    tooltipText: 'Klik bagian "PRACTICE" untuk melihat latihan pronunciation.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'phonetic-detail-prompt',
    route: '/skill/pronunciation/phoneticSymbols/i',
    targetSelector: '[data-tour="symbol-prompt-section-toggle"]',
    tooltipText: 'Selamat! Klik bagian "PROMPT" untuk menyelesaikan panduan phonetic detail.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  // ============================================================================
  // ALPHABET PAGE STEPS (10 steps)
  // ============================================================================
  
  {
    id: 'alphabet-play-all',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-play-all"]',
    tooltipText: 'Klik tombol "play all" untuk memutar audio pengucapan semua huruf secara berurutan.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-card-a',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-letter-a"]',
    tooltipText: 'Klik kartu huruf A untuk mendengar pengucapannya.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-card-z',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-letter-z"]',
    tooltipText: 'Klik kartu huruf Z untuk mendengar pengucapannya.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-quick-spelling',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-quick-spelling"]',
    tooltipText: 'Klik bagian "Latihan Quick Spelling" untuk membuka latihan mengeja dengan cepat.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-notes',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-notes"]',
    tooltipText: 'Klik bagian "Catatan untuk Penutur Indonesia" untuk melihat tips khusus.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-practice-button',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-practice"]',
    tooltipText: 'Klik bagian "Practice" untuk membuka latihan pronunciation interaktif.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-prompt-input',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-prompt"]',
    tooltipText: 'Klik bagian "Prompt" untuk melihat prompt penilaian alphabet.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-recording-panel',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-recording"]',
    tooltipText: 'Klik panel recording untuk membuka fitur perekaman suara.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'alphabet-close-recording',
    route: '/skill/pronunciation/alphabet',
    targetSelector: '[data-tour="alphabet-close-recording"]',
    tooltipText: 'Klik tombol X untuk menutup panel recording.',
    tooltipPosition: 'left',
    mode: 'interactive',
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
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'none',
  },
  
  // ============================================================================
  // VOCABULARY LIST PAGE STEPS (5 steps)
  // ============================================================================
  
  {
    id: 'vocab-title',
    route: '/skill/vocabulary',
    targetSelector: '.vocab-title',
    tooltipText: 'Selamat datang di halaman Vocabulary! Di sini Anda bisa belajar kosakata bahasa Inggris berdasarkan topik.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-search',
    route: '/skill/vocabulary',
    targetSelector: '[data-tour="vocab-search"]',
    tooltipText: 'Gunakan search untuk mencari topik vocabulary yang Anda inginkan.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-topic-grid',
    route: '/skill/vocabulary',
    targetSelector: '[data-tour="vocab-topic-grid"]',
    tooltipText: 'Ini adalah daftar topik vocabulary. Klik salah satu topik untuk melihat daftar kata.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-topic-personal-info',
    route: '/skill/vocabulary',
    targetSelector: '.vocab-topic-card:first-child',
    tooltipText: 'Klik topik "Personal Information" untuk membuka daftar kata dalam topik ini.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-pagination',
    route: '/skill/vocabulary',
    targetSelector: '[data-tour="vocab-pagination"]',
    tooltipText: 'Gunakan pagination untuk melihat topik vocabulary lainnya. Panduan vocabulary list selesai!',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  // ============================================================================
  // VOCABULARY DETAIL PAGE STEPS (8 steps)
  // ============================================================================
  
  {
    id: 'vocab-detail-title',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '.vocab-title',
    tooltipText: 'Ini adalah halaman detail topik vocabulary. Di sini Anda bisa melihat semua kata dalam topik ini.',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-saved-progress',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '.vocab-control-saved-progress',
    tooltipText: 'Klik tombol ini untuk menyimpan progress Anda di topik ini.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-toggle-translation',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '[data-tour="vocab-toggle-translation"]',
    tooltipText: 'Klik untuk menyembunyikan atau menampilkan terjemahan bahasa Indonesia.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-toggle-ipa',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '[data-tour="vocab-toggle-ipa"]',
    tooltipText: 'Klik untuk menyembunyikan atau menampilkan IPA (International Phonetic Alphabet).',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-practice',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '[data-tour="vocab-practice-button"]',
    tooltipText: 'Klik tombol "Practice" untuk melihat contoh latihan vocabulary.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-play-all',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '[data-tour="vocab-play-all-button"]',
    tooltipText: 'Klik "Play All Words" untuk mendengar pengucapan semua kata secara berurutan.',
    tooltipPosition: 'bottom',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-word-card',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '.vocab-card:first-child',
    tooltipText: 'Ini adalah kartu kata vocabulary. Anda bisa klik "Play Word" atau "Play Example" untuk mendengar pengucapannya.',
    tooltipPosition: 'top',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
  
  {
    id: 'vocab-detail-prompt',
    route: '/skill/vocabulary/topic/pages/personal-information',
    targetSelector: '.vocab-prompt-toggle',
    tooltipText: 'Selamat! Klik bagian "Prompt" untuk menyelesaikan panduan vocabulary.',
    tooltipPosition: 'top',
    mode: 'interactive',
    requiresNavigation: false,
    waitForElement: true,
    scrollBehavior: 'smooth',
  },
];

/**
 * Total number of steps in the guide flow
 */
export const TOTAL_GUIDE_STEPS = GUIDE_FLOW.length;

/**
 * Get guide steps for a specific page/route
 * @param route - The Next.js route path
 * @returns Array of guide steps for that route
 */
export function getGuideForPage(route: string): GuideStep[] {
  return GUIDE_FLOW.filter(step => step.route === route);
}

/**
 * Check if a page has guide steps
 * @param route - The Next.js route path
 * @returns true if the page has guide steps
 */
export function hasGuideForPage(route: string): boolean {
  return GUIDE_FLOW.some(step => step.route === route);
}

/**
 * Get the starting index of guide steps for a specific page
 * @param route - The Next.js route path
 * @returns The index of the first step for that route, or -1 if not found
 */
export function getPageGuideStartIndex(route: string): number {
  return GUIDE_FLOW.findIndex(step => step.route === route);
}

/**
 * Get a guide step by its ID
 * @param stepId - The unique identifier of the step
 * @returns The guide step object, or undefined if not found
 */
export function getStepById(stepId: string): GuideStep | undefined {
  return GUIDE_FLOW.find(step => step.id === stepId);
}

/**
 * Get the index of a guide step by its ID
 * @param stepId - The unique identifier of the step
 * @returns The index of the step, or -1 if not found
 */
export function getStepIndexById(stepId: string): number {
  return GUIDE_FLOW.findIndex(step => step.id === stepId);
}

/**
 * Get all steps for a specific route
 * @param route - The Next.js route path
 * @returns Array of guide steps for that route
 */
export function getStepsByRoute(route: string): GuideStep[] {
  return GUIDE_FLOW.filter(step => step.route === route);
}

/**
 * Validate that all steps have required fields
 * @returns true if all steps are valid, false otherwise
 */
export function validateGuideFlow(): boolean {
  return GUIDE_FLOW.every(step => {
    return (
      typeof step.id === 'string' &&
      step.id.length > 0 &&
      typeof step.route === 'string' &&
      step.route.length > 0 &&
      typeof step.targetSelector === 'string' &&
      step.targetSelector.length > 0 &&
      typeof step.tooltipText === 'string' &&
      step.tooltipText.length > 0 &&
      ['top', 'bottom', 'left', 'right', 'auto'].includes(step.tooltipPosition) &&
      ['interactive', 'auto'].includes(step.mode) &&
      typeof step.requiresNavigation === 'boolean' &&
      typeof step.waitForElement === 'boolean' &&
      ['smooth', 'instant', 'none'].includes(step.scrollBehavior)
    );
  });
}
