// YouTube Video IDs for Phonetic Symbols
// Organized by category with IPA symbols and corresponding YouTube video IDs

export interface VideoMapping {
  videoId: string;
  symbol: string;
}

export interface VideoCategory {
  [symbol: string]: string;
}

// Video IDs for vowel lax symbols
export const vowelLaxVideos: VideoCategory = {
 
};

// Video IDs for vowel tense symbols
export const vowelTenseVideos: VideoCategory = {
 
  'i': '9XcUY0nunfw',
 

};

// Video IDs for consonant voiced symbols
export const consonantVoicedVideos: VideoCategory = {
};

// Video IDs for consonant voiceless symbols
export const consonantVoicelessVideos: VideoCategory = {
};

// Video IDs for diphthong symbols
export const diphthongVideos: VideoCategory = {
};


// Combined all video IDs by category
export const allVideoIds: { [category: string]: VideoCategory } = {
  vowel_lax: vowelLaxVideos,
  vowel_tense: vowelTenseVideos,
  consonant_voiced: consonantVoicedVideos,
  consonant_voiceless: consonantVoicelessVideos,
  diphthong: diphthongVideos
};

// Helper function to get video ID by symbol
export function getVideoIdBySymbol(symbol: string): string | undefined {
  for (const category of Object.values(allVideoIds)) {
    if (category[symbol]) {
      return category[symbol];
    }
  }
  return undefined;
}

// Helper function to get video ID by category and symbol
export function getVideoIdByCategoryAndSymbol(category: string, symbol: string): string | undefined {
  return allVideoIds[category]?.[symbol];
}

// Helper function to get all video mappings for a category
export function getVideoMappingsByCategory(category: string): VideoMapping[] {
  const categoryVideos = allVideoIds[category];
  if (!categoryVideos) return [];
  
  return Object.entries(categoryVideos).map(([symbol, videoId]) => ({
    videoId,
    symbol
  }));
}

// Helper function to get all video mappings
export function getAllVideoMappings(): VideoMapping[] {
  const mappings: VideoMapping[] = [];
  
  for (const videos of Object.values(allVideoIds)) {
    for (const [symbol, videoId] of Object.entries(videos)) {
      mappings.push({
        videoId,
        symbol
      });
    }
  }
  
  return mappings;
}


