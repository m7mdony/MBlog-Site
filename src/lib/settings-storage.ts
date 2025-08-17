
// Settings storage for managing visible sections
export interface SectionSettings {
  showHero: boolean;
  showLatestConcept: boolean;
  showConcepts: boolean;
  showTutorials: boolean;
  showResources: boolean;
  showFavorites: boolean;
  showStats: boolean;
  showCTA: boolean;
  hideEngagementStats: boolean;
  showCertifications: boolean;
  showEngagementInArticles: boolean;
}

const SETTINGS_KEY = 'mariam_section_settings';

const defaultSettings: SectionSettings = {
  showHero: true,
  showLatestConcept: false,
  showConcepts: true,
  showTutorials: false,
  showResources: false,
  showFavorites: false,
  showStats: false,
  showCTA: false,
  hideEngagementStats: true,
  showCertifications: false,
  showEngagementInArticles: true, // Default to show interaction buttons
};

export function getSettings(): SectionSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
    setSettings(defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error loading section settings:', error);
    return defaultSettings;
  }
}

export function setSettings(settings: SectionSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('sectionSettingsUpdated', { detail: settings }));
  } catch (error) {
    console.error('Error saving section settings:', error);
  }
}

export function updateSectionSetting(key: keyof SectionSettings, value: boolean): void {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, [key]: value };
  setSettings(updatedSettings);
}

// Legacy exports for compatibility
export const getSectionSettings = getSettings;
export const setSectionSettings = setSettings;
