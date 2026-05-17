// Google Analytics tracking functions
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, action: string, details?: string) => {
  event({
    action: action,
    category: 'Feature Usage',
    label: `${featureName}${details ? ` - ${details}` : ''}`,
  });
};

// Track skill interactions
export const trackSkillInteraction = (skillType: string, action: string, details?: string) => {
  event({
    action: action,
    category: 'Skill Interaction',
    label: `${skillType}${details ? ` - ${details}` : ''}`,
  });
};

// Track pronunciation feature
export const trackPronunciation = (action: string, symbol?: string) => {
  event({
    action: action,
    category: 'Pronunciation',
    label: symbol || 'general',
  });
};

// Track grammar feature
export const trackGrammar = (action: string, topic?: string) => {
  event({
    action: action,
    category: 'Grammar',
    label: topic || 'general',
  });
};

// Track user journey
export const trackUserJourney = (step: string, action: string) => {
  event({
    action: action,
    category: 'User Journey',
    label: step,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'click',
    category: 'Button',
    label: `${buttonName} - ${location}`,
  });
};

// Track navigation
export const trackNavigation = (from: string, to: string) => {
  event({
    action: 'navigate',
    category: 'Navigation',
    label: `${from} -> ${to}`,
  });
};

// Track video interactions
export const trackVideo = (action: string, videoId?: string) => {
  event({
    action: action,
    category: 'Video',
    label: videoId || 'unknown',
  });
};

// Track audio playback
export const trackAudio = (action: string, audioType: string) => {
  event({
    action: action,
    category: 'Audio',
    label: audioType,
  });
};

// Track search
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    value: resultsCount,
  });
};

// Track errors
export const trackError = (errorType: string, errorMessage: string) => {
  event({
    action: 'error',
    category: 'Error',
    label: `${errorType}: ${errorMessage}`,
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
