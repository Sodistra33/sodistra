// Translation mappings for database content
// This maps French content to translation keys for dynamic content translation

export const serviceTranslations: Record<string, { titleKey: string; descKey: string }> = {
  'bâtiments': { titleKey: 'service.batiments', descKey: 'service.batiments_desc' },
  'batiments': { titleKey: 'service.batiments', descKey: 'service.batiments_desc' },
  'assainissement': { titleKey: 'service.assainissement', descKey: 'service.assainissement_desc' },
  'réhabilitation': { titleKey: 'service.assainissement', descKey: 'service.assainissement_desc' },
  'ponts': { titleKey: 'service.ponts', descKey: 'service.ponts_desc' },
  'voiries': { titleKey: 'service.ponts', descKey: 'service.ponts_desc' },
  'voirie': { titleKey: 'service.ponts', descKey: 'service.ponts_desc' },
  'hydro': { titleKey: 'service.hydro', descKey: 'service.hydro_desc' },
  'hydrauliques': { titleKey: 'service.hydro', descKey: 'service.hydro_desc' },
  'routes': { titleKey: 'service.routes', descKey: 'service.routes_desc' },
  'zones industrielles': { titleKey: 'service.zones', descKey: 'service.zones_desc' },
};

export const getServiceTranslationKey = (title: string): { titleKey: string; descKey: string } | null => {
  const lowerTitle = title.toLowerCase();
  
  for (const [keyword, keys] of Object.entries(serviceTranslations)) {
    if (lowerTitle.includes(keyword)) {
      return keys;
    }
  }
  
  return null;
};

// Project category translations
export const categoryTranslations: Record<string, string> = {
  'voirie': 'category.roads',
  'bitumage': 'category.paving',
  'construction': 'category.construction',
  'pont': 'category.bridge',
  'assainissement': 'category.sanitation',
  'hydrauliques': 'category.hydraulic',
  'hydro': 'category.hydro',
};

export const getCategoryTranslationKey = (category: string): string | null => {
  const lowerCategory = category.toLowerCase();
  
  for (const [keyword, key] of Object.entries(categoryTranslations)) {
    if (lowerCategory.includes(keyword)) {
      return key;
    }
  }
  
  return null;
};
