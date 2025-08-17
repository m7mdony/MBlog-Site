import { v4 as uuidv4 } from 'uuid';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface ProfileData {
  name: string;
  title: string;
  description: string;
  profileImage: string;
  socialLinks: SocialLink[];
  categories: Category[];
}

const PROFILE_STORAGE_KEY = 'mariam_bassitman_profile';

// Create default profile (separate function)
function createDefaultProfile(): ProfileData {
  console.log('🏗️ Creating default profile...');
  const defaultProfile = {
    name: "مريم باعثمان",
    title: "ريادة الأعمال والتقنية والتسويق",
    description: "تمكين المنظمات من تطوير عمليات النمو عبر الاستراتيجيات والتسويق والتقنية وأتمتة العمليات",
    profileImage: "/src/assets/mariam-logo.svg", // الشعار الجديد فقط
    socialLinks: [
      { id: uuidv4(), platform: "Twitter", url: "https://x.com/MBaathman", icon: "Twitter" },
      { id: uuidv4(), platform: "LinkedIn", url: "https://www.linkedin.com/company/lubb", icon: "Linkedin" },
      { id: uuidv4(), platform: "Email", url: "mailto:example@email.com", icon: "Mail" },
      { id: uuidv4(), platform: "Website", url: "#", icon: "ExternalLink" },
    ],
    categories: [
      { id: uuidv4(), name: "ريادة الأعمال", count: 0, color: "blue" },
      { id: uuidv4(), name: "نمو الأعمال", count: 0, color: "orange" },
      { id: uuidv4(), name: "تقنيات الأعمال", count: 0, color: "purple" },
    ],
  };
  console.log('📝 Default profile created:', defaultProfile);
  return defaultProfile;
}

// Get profile data
export function getProfile(): ProfileData | null {
  try {
    console.log('🔍 Attempting to load profile from localStorage...');
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✅ Profile data found and parsed:', parsed);
      // Validate that the data has the correct structure
      if (parsed && typeof parsed === 'object' && parsed.name && parsed.title && parsed.profileImage) {
        return parsed;
      } else {
        console.warn('Stored profile data is invalid or incomplete, removing corrupted data');
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        return null;
      }
    }
    console.log('❌ No profile data found in localStorage.');
    return null;
  } catch (error) {
    console.error('❌ Error loading profile:', error);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return null;
  }
}

// Save profile data
export function setProfile(profile: ProfileData): void {
  try {
    console.log('💾 Saving profile:', profile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    console.log('✅ Profile saved successfully');
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));
    console.log('📡 Profile update event dispatched');
  } catch (error) {
    console.error('❌ Error saving profile:', error);
  }
}

// Get profile data with fallback to default (only when explicitly needed)
export function getProfileWithFallback(): ProfileData {
  console.log('🔄 getProfileWithFallback called');
  const profile = getProfile();
  if (profile) {
    console.log('✅ Using existing profile');
    return profile;
  }
  console.log('🆕 Creating default profile...');
  const defaultProfile = createDefaultProfile();
  console.log('📝 Default profile created:', defaultProfile);
  setProfile(defaultProfile);
  console.log('✅ Default profile saved and returned');
  return defaultProfile;
}

// Update profile data
export function updateProfile(updates: Partial<ProfileData>): void {
  const profile = getProfileWithFallback();
  const updatedProfile = { ...profile, ...updates };
  setProfile(updatedProfile);
}

// Update social link
export function updateSocialLink(id: string, updates: Partial<SocialLink>): void {
  const profile = getProfileWithFallback();
  profile.socialLinks = profile.socialLinks.map(link => 
    link.id === id ? { ...link, ...updates } : link
  );
  setProfile(profile);
}

// Add social link
export function addSocialLink(link: SocialLink): void {
  const profile = getProfileWithFallback();
  profile.socialLinks.push(link);
  setProfile(profile);
}

// Add category
export function addCategory(category: Category): void {
  const profile = getProfileWithFallback();
  profile.categories.push(category);
  setProfile(profile);
}

// Remove category
export function removeCategory(id: string): void {
  const profile = getProfileWithFallback();
  profile.categories = profile.categories.filter(cat => cat.id !== id);
  setProfile(profile);
}

// Delete social link
export function deleteSocialLink(id: string): void {
  const profile = getProfileWithFallback();
  profile.socialLinks = profile.socialLinks.filter(link => link.id !== id);
  setProfile(profile);
}

// Remove social link (alias for deleteSocialLink)
export function removeSocialLink(id: string): void {
  deleteSocialLink(id);
}

// Update category
export function updateCategory(id: string, updates: Partial<Category>): void {
  const profile = getProfileWithFallback();
  profile.categories = profile.categories.map(cat => 
    cat.id === id ? { ...cat, ...updates } : cat
  );
  setProfile(profile);
}

// Create new profile with updated information
export function createNewProfile(): ProfileData {
  const newProfile: ProfileData = {
    name: "مريم باعثمان",
    title: "ريادة الأعمال والتقنية والتسويق",
    description: "تمكين المنظمات من تطوير عمليات النمو عبر الاستراتيجيات والتسويق والتقنية وأتمتة العمليات",
    profileImage: "/src/assets/mariam-logo.svg", // الشعار الجديد فقط
    socialLinks: [
      { id: uuidv4(), platform: "Twitter", url: "https://x.com/MBaathman", icon: "Twitter" },
      { id: uuidv4(), platform: "LinkedIn", url: "https://www.linkedin.com/company/lubb", icon: "Linkedin" },
      { id: uuidv4(), platform: "Email", url: "mailto:example@email.com", icon: "Mail" },
      { id: uuidv4(), platform: "Website", url: "#", icon: "ExternalLink" },
    ],
    categories: [
      { id: uuidv4(), name: "ريادة الأعمال", count: 0, color: "blue" },
      { id: uuidv4(), name: "نمو الأعمال", count: 0, color: "orange" },
      { id: uuidv4(), name: "تقنيات الأعمال", count: 0, color: "purple" },
    ],
  };
  setProfile(newProfile);
  return newProfile;
}

// Function to force refresh profile data
export function forceRefreshProfile(): void {
  const profile = getProfile();
  if (profile) {
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));
  }
}

// Force update profile image to new logo
export function forceUpdateProfileImage(): void {
  const profile = getProfileWithFallback();
  profile.profileImage = "/src/assets/mariam-logo.svg";
  setProfile(profile);
  console.log('🖼️ Profile image updated to new logo');
}

// Check if profile image is correct (new logo)
export function isProfileImageCorrect(): boolean {
  const profile = getProfile();
  return profile?.profileImage === "/src/assets/mariam-logo.svg";
}