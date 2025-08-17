// Simple storage utility for managing concepts data
export interface Concept {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  hasVideo: boolean;
  isPopular: boolean;
  videoUrl?: string;
  iconImage?: string; // For custom icon images
}

// تصفير جميع الإحصائيات
export const resetAllStats = () => {
  // تصفير إحصائيات المفاهيم (المقالات)
  const concepts = getConcepts();
  concepts.forEach(concept => {
    concept.views = 0;
    concept.likes = 0;
    concept.comments = 0;
  });
  setConcepts(concepts);

  // تصفير إحصائيات الإنفوجرافيك
  const infographics = getInfographics();
  infographics.forEach(infographic => {
    infographic.views = 0;
    infographic.likes = 0;
    infographic.downloads = 0;
    infographic.comments = 0;
  });
  localStorage.setItem('infographics', JSON.stringify(infographics));

  // تصفير إحصائيات الموارد
  const resources = getResources();
  resources.forEach(resource => {
    resource.views = 0;
    resource.likes = 0;
    resource.downloads = 0;
    resource.comments = 0;
  });
  localStorage.setItem('resources', JSON.stringify(resources));

  // تصفير إحصائيات الدروس
  const tutorials = getTutorials();
  tutorials.forEach(tutorial => {
    tutorial.views = 0;
    tutorial.likes = 0;
    tutorial.downloads = 0;
    tutorial.comments = 0;
  });
  localStorage.setItem('tutorials', JSON.stringify(tutorials));

  // تصفير إحصائيات المفضلة
  const favorites = getFavorites();
  favorites.forEach(favorite => {
    favorite.views = 0;
    favorite.likes = 0;
    favorite.downloads = 0;
    favorite.comments = 0;
  });
  localStorage.setItem('favorites', JSON.stringify(favorites));

  // تصفير الإحصائيات العامة
  const stats = {
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
    totalComments: 0,
    totalArticles: concepts.length, // استخدام المفاهيم كمقالات
    totalConcepts: concepts.length,
    totalInfographics: infographics.length,
    totalResources: resources.length,
    totalTutorials: tutorials.length,
    totalFavorites: favorites.length
  };
  localStorage.setItem('stats', JSON.stringify(stats));
};

// وظائف تتبع الإحصائيات الفعلية
export const incrementViews = (type: 'article' | 'concept' | 'infographic' | 'resource' | 'tutorial' | 'favorite', id: string) => {
  const storageKey = `${type}s`;
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const item = items.find((item: any) => item.id === id);
  
  if (item) {
    item.views = (item.views || 0) + 1;
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // إرسال حدث إلى GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'content_view',
        content_type: type,
        content_id: id,
        content_title: item.title || item.name
      });
    }
  }
};

export const incrementLikes = (type: 'article' | 'concept' | 'infographic' | 'resource' | 'tutorial' | 'favorite', id: string) => {
  const storageKey = `${type}s`;
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const item = items.find((item: any) => item.id === id);
  
  if (item) {
    item.likes = (item.likes || 0) + 1;
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // إرسال حدث إلى GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'content_like',
        content_type: type,
        content_id: id,
        content_title: item.title || item.name
      });
    }
  }
};

export const incrementDownloads = (type: 'article' | 'concept' | 'infographic' | 'resource' | 'tutorial' | 'favorite', id: string) => {
  const storageKey = `${type}s`;
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const item = items.find((item: any) => item.id === id);
  
  if (item) {
    item.downloads = (item.downloads || 0) + 1;
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // إرسال حدث إلى GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'content_download',
        content_type: type,
        content_id: id,
        content_title: item.title || item.name
      });
    }
  }
};

export const incrementComments = (type: 'article' | 'concept' | 'infographic' | 'resource' | 'tutorial' | 'favorite', id: string) => {
  const storageKey = `${type}s`;
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const item = items.find((item: any) => item.id === id);
  
  if (item) {
    item.comments = (item.comments || 0) + 1;
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // إرسال حدث إلى GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'content_comment',
        content_type: type,
        content_id: id,
        content_title: item.title || item.name
      });
    }
  }
};

const STORAGE_KEY = 'mariam_bassitman_concepts';

// Default concepts data with zero stats
const defaultConcepts: Concept[] = [
  {
    id: 1,
    title: "كيف تبني عادات نمو مستدامة في عملك",
    description: "استراتيجيات فعالة لبناء عادات تسهم في نمو أعمالك بشكل مستدام",
    content: "محتوى المفهوم...",
    category: "نمو الأعمال",
    status: "منشور",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-15",
    hasVideo: true,
    isPopular: true
  },
  {
    id: 2,
    title: "التشغيل الذكي: أتمتة المهام المتكررة",
    description: "كيف تستخدم الأتمتة لزيادة كفاءة عملياتك التشغيلية",
    content: "محتوى المفهوم...",
    category: "التشغيل",
    status: "منشور",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-10",
    hasVideo: false,
    isPopular: false
  },
  {
    id: 3,
    title: "العقلية التنافسية في الأعمال",
    description: "تطوير العقلية الصحيحة للنجاح في بيئة الأعمال التنافسية",
    content: "محتوى المفهوم...",
    category: "العقلية",
    status: "مسودة",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-08",
    hasVideo: true,
    isPopular: false
  },
  {
    id: 4,
    title: "أدوات التقنية الأساسية لكل رائد أعمال",
    description: "مجموعة من الأدوات التقنية التي يحتاجها كل رائد أعمال",
    content: "محتوى المفهوم...",
    category: "التقنية",
    status: "منشور",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-05",
    hasVideo: false,
    isPopular: false
  },
  {
    id: 5,
    title: "استراتيجيات النمو السريع للشركات الناشئة",
    description: "طرق مجربة لتحقيق نمو سريع ومستدام للشركات الناشئة",
    content: "محتوى المفهوم...",
    category: "نمو الأعمال",
    status: "منشور",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-03",
    hasVideo: true,
    isPopular: true
  },
  {
    id: 6,
    title: "إدارة الوقت للمديرين التنفيذيين",
    description: "تقنيات متقدمة لإدارة الوقت وزيادة الإنتاجية للمديرين",
    content: "محتوى المفهوم...",
    category: "التشغيل",
    status: "مخفي",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-01",
    hasVideo: false,
    isPopular: false
  }
];

// Get all concepts
export function getConcepts(): Concept[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const concepts = JSON.parse(stored);
      
      // Check if data is fresh (less than 1 hour old)
      const timestamp = localStorage.getItem(`${STORAGE_KEY}_timestamp`);
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age > 3600000) { // 1 hour in milliseconds
          // Data is old, clear cache
          console.log('Data is old, clearing cache');
          // Don't call clearCacheAndReload here to avoid infinite loop
          localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
        }
      }
      
      console.log(`📖 Loaded ${concepts.length} concepts from localStorage`);
      return concepts;
    }
    
    // Try to load from backup if main data is missing
    const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
    if (backup) {
      try {
        const backupConcepts = JSON.parse(backup);
        console.log('🔄 Restoring data from backup...');
        setConcepts(backupConcepts);
        return backupConcepts;
      } catch (backupError) {
        console.error('❌ Failed to restore from backup:', backupError);
      }
    }
    
    // Initialize with default data if nothing stored
    console.log('🆕 Initializing with default concepts...');
    setConcepts(defaultConcepts);
    return defaultConcepts;
  } catch (error) {
    console.error('❌ Error loading concepts:', error);
    
    // Try to load from backup in case of error
    try {
      const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
      if (backup) {
        const backupConcepts = JSON.parse(backup);
        console.log('🔄 Restoring data from backup after error...');
        return backupConcepts;
      }
    } catch (backupError) {
      console.error('❌ Failed to restore from backup after error:', backupError);
    }
    
    return defaultConcepts;
  }
}

// Save all concepts
export function setConcepts(concepts: Concept[]): void {
  try {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concepts));
    
    // Update timestamp for cache management
    localStorage.setItem(`${STORAGE_KEY}_timestamp`, Date.now().toString());
    
    // Clear any potential cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Dispatch event to update UI immediately
    window.dispatchEvent(new CustomEvent('conceptsUpdated', { detail: concepts }));
    
    // Force browser to reload data
    window.dispatchEvent(new Event('storage'));
    
    // Log successful save for debugging
    console.log(`✅ Successfully saved ${concepts.length} concepts to localStorage`);
    console.log('📊 Data saved at:', new Date().toLocaleString());
    
    // Note: Removed automatic page reload to prevent data loss
    // The UI will update automatically through the CustomEvent
  } catch (error) {
    console.error('❌ Error saving concepts:', error);
    // Try to save a backup copy
    try {
      localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(concepts));
      console.log('💾 Backup saved successfully');
    } catch (backupError) {
      console.error('❌ Failed to save backup:', backupError);
    }
  }
}

// Add a new concept
export function addConcept(conceptData: Omit<Concept, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Concept {
  const concepts = getConcepts();
  const newId = Math.max(...concepts.map(c => c.id), 0) + 1;
  
  const newConcept: Concept = {
    ...conceptData,
    id: newId,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const updatedConcepts = [newConcept, ...concepts];
  setConcepts(updatedConcepts);
  
  // Force clear any cached data
  localStorage.removeItem(`concept_${newId}`);
  sessionStorage.removeItem(`concept_${newId}`);
  
  return newConcept;
}

// Update a concept
export function updateConcept(id: number, updates: Partial<Concept>): void {
  const concepts = getConcepts();
  const updatedConcepts = concepts.map(concept => 
    concept.id === id ? { ...concept, ...updates } : concept
  );
  setConcepts(updatedConcepts);
  
  // Force clear any cached data
  localStorage.removeItem(`concept_${id}`);
  sessionStorage.removeItem(`concept_${id}`);
}

// Delete a concept
export function deleteConcept(id: number): void {
  const concepts = getConcepts();
  const updatedConcepts = concepts.filter(concept => concept.id !== id);
  setConcepts(updatedConcepts);
  
  // Force clear any cached data
  localStorage.removeItem(`concept_${id}`);
  sessionStorage.removeItem(`concept_${id}`);
}

// Increment view count for concepts
export function incrementConceptViews(id: number): void {
  const concepts = getConcepts();
  const updatedConcepts = concepts.map(concept => 
    concept.id === id ? { ...concept, views: concept.views + 1 } : concept
  );
  setConcepts(updatedConcepts);
  
  // Force clear any cached data
  localStorage.removeItem(`concept_${id}`);
  sessionStorage.removeItem(`concept_${id}`);
}

// Like/Unlike functionality
export function toggleLike(id: number): boolean {
  const likeKey = `liked_${id}`;
  const hasLiked = localStorage.getItem(likeKey) === 'true';
  
  const concepts = getConcepts();
  const updatedConcepts = concepts.map(concept => 
    concept.id === id ? { 
      ...concept, 
      likes: hasLiked ? Math.max(0, concept.likes - 1) : concept.likes + 1 
    } : concept
  );
  
  setConcepts(updatedConcepts);
  localStorage.setItem(likeKey, hasLiked ? 'false' : 'true');
  
  // Force clear any cached data
  localStorage.removeItem(`concept_${id}`);
  sessionStorage.removeItem(`concept_${id}`);
  
  return !hasLiked;
}

// Check if user has liked an article
export function hasLiked(id: number): boolean {
  return localStorage.getItem(`liked_${id}`) === 'true';
}

// Force refresh all data
export function forceRefreshData(): void {
  try {
    // Clear all timestamps
    localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
    
    // Clear any potential cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Force reload data
    const concepts = getConcepts();
    window.dispatchEvent(new CustomEvent('conceptsUpdated', { detail: concepts }));
    
    // Force browser to reload data
    window.dispatchEvent(new Event('storage'));
    
    console.log('Data force refreshed');
  } catch (error) {
    console.error('Error force refreshing data:', error);
  }
}

// Clear cache and reload data
export function clearCacheAndReload(): void {
  try {
    // Clear localStorage timestamp
    localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
    
    // Clear any potential cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Force reload data
    const concepts = getConcepts();
    window.dispatchEvent(new CustomEvent('conceptsUpdated', { detail: concepts }));
    
    // Force browser to reload data
    window.dispatchEvent(new Event('storage'));
    
    // Note: Removed automatic page reload to prevent data loss
    // The UI will update automatically through the CustomEvent
    
    // Clear any cached concept data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('concept_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Cache cleared and data reloaded');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
}

// Check storage health and data integrity
export function checkStorageHealth(): {
  isHealthy: boolean;
  totalConcepts: number;
  lastSaveTime: string | null;
  hasBackup: boolean;
  storageSize: number;
  issues: string[];
} {
  const issues: string[] = [];
  let isHealthy = true;
  
  try {
    // Check main data
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      issues.push('No main data found');
      isHealthy = false;
    } else {
      const concepts = JSON.parse(stored);
      if (!Array.isArray(concepts)) {
        issues.push('Main data is not an array');
        isHealthy = false;
      }
    }
    
    // Check timestamp
    const timestamp = localStorage.getItem(`${STORAGE_KEY}_timestamp`);
    const lastSaveTime = timestamp ? new Date(parseInt(timestamp)).toLocaleString() : null;
    
    // Check backup
    const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
    const hasBackup = !!backup;
    
    // Check storage size
    const storageSize = stored ? new Blob([stored]).size : 0;
    
    // Check for data corruption
    if (stored) {
      try {
        const concepts = JSON.parse(stored);
        if (concepts.length > 0) {
          const firstConcept = concepts[0];
          if (!firstConcept.id || !firstConcept.title) {
            issues.push('Data structure appears corrupted');
            isHealthy = false;
          }
        }
      } catch (parseError) {
        issues.push('Failed to parse stored data');
        isHealthy = false;
      }
    }
    
    const totalConcepts = stored ? JSON.parse(stored).length : 0;
    
    console.log('🔍 Storage Health Check:', {
      isHealthy,
      totalConcepts,
      lastSaveTime,
      hasBackup,
      storageSize: `${(storageSize / 1024).toFixed(2)} KB`,
      issues
    });
    
    return {
      isHealthy,
      totalConcepts,
      lastSaveTime,
      hasBackup,
      storageSize,
      issues
    };
  } catch (error) {
    console.error('❌ Error checking storage health:', error);
    return {
      isHealthy: false,
      totalConcepts: 0,
      lastSaveTime: null,
      hasBackup: false,
      storageSize: 0,
      issues: ['Error during health check']
    };
  }
}

// Restore data from backup
export function restoreFromBackup(): boolean {
  try {
    const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
    if (!backup) {
      console.log('❌ No backup found to restore from');
      return false;
    }
    
    const backupConcepts = JSON.parse(backup);
    if (!Array.isArray(backupConcepts)) {
      console.log('❌ Backup data is corrupted');
      return false;
    }
    
    // Save backup as main data
    setConcepts(backupConcepts);
    
    // Create a new backup of the restored data
    localStorage.setItem(`${STORAGE_KEY}_backup_restored`, backup);
    
    console.log('✅ Data restored from backup successfully');
    console.log(`📊 Restored ${backupConcepts.length} concepts`);
    
    return true;
  } catch (error) {
    console.error('❌ Error restoring from backup:', error);
    return false;
  }
}

// Create a manual backup
export function createManualBackup(): boolean {
  try {
    const concepts = getConcepts();
    const backupData = {
      concepts,
      timestamp: Date.now(),
      version: '1.0',
      description: 'Manual backup created by user'
    };
    
    localStorage.setItem(`${STORAGE_KEY}_manual_backup`, JSON.stringify(backupData));
    
    console.log('✅ Manual backup created successfully');
    console.log(`📊 Backed up ${concepts.length} concepts`);
    
    return true;
  } catch (error) {
    console.error('❌ Error creating manual backup:', error);
    return false;
  }
}

// Enhanced backup management functions
export function getBackupInfo(): {
  mainBackup: { exists: boolean; size: number; timestamp: string | null };
  manualBackup: { exists: boolean; size: number; timestamp: string | null; description: string | null };
  restoredBackup: { exists: boolean; size: number; timestamp: string | null };
} {
  try {
    const mainBackup = localStorage.getItem(`${STORAGE_KEY}_backup`);
    const manualBackup = localStorage.getItem(`${STORAGE_KEY}_manual_backup`);
    const restoredBackup = localStorage.getItem(`${STORAGE_KEY}_backup_restored`);

    return {
      mainBackup: {
        exists: !!mainBackup,
        size: mainBackup ? new Blob([mainBackup]).size : 0,
        timestamp: mainBackup ? new Date(JSON.parse(mainBackup).timestamp || Date.now()).toLocaleString() : null
      },
      manualBackup: {
        exists: !!manualBackup,
        size: manualBackup ? new Blob([manualBackup]).size : 0,
        timestamp: manualBackup ? new Date(JSON.parse(manualBackup).timestamp || Date.now()).toLocaleString() : null,
        description: manualBackup ? JSON.parse(manualBackup).description || null : null
      },
      restoredBackup: {
        exists: !!restoredBackup,
        size: restoredBackup ? new Blob([restoredBackup]).size : 0,
        timestamp: restoredBackup ? new Date(JSON.parse(restoredBackup).timestamp || Date.now()).toLocaleString() : null
      }
    };
  } catch (error) {
    console.error('❌ Error getting backup info:', error);
    return {
      mainBackup: { exists: false, size: 0, timestamp: null },
      manualBackup: { exists: false, size: 0, timestamp: null, description: null },
      restoredBackup: { exists: false, size: 0, timestamp: null }
    };
  }
}

// Export data to JSON file
export function exportDataToFile(): void {
  try {
    const concepts = getConcepts();
    const exportData = {
      concepts,
      exportDate: new Date().toISOString(),
      version: '1.0',
      description: 'MBlog data export'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `mblog-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
    console.log('✅ Data exported successfully');
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  }
}

// Import data from JSON file
export function importDataFromFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        if (importData.concepts && Array.isArray(importData.concepts)) {
          // Create backup before import
          createManualBackup();
          
          // Import the data
          setConcepts(importData.concepts);
          
          console.log('✅ Data imported successfully');
          console.log(`📊 Imported ${importData.concepts.length} concepts`);
          
          resolve(true);
        } else {
          console.error('❌ Invalid import file format');
          resolve(false);
        }
      } catch (error) {
        console.error('❌ Error importing data:', error);
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      console.error('❌ Error reading file');
      resolve(false);
    };
    
    reader.readAsText(file);
  });
}

// Clean up old backups
export function cleanupOldBackups(): void {
  try {
    const keys = Object.keys(localStorage);
    const backupKeys = keys.filter(key => 
      key.includes('_backup') && 
      !key.includes('_manual_backup') && 
      !key.includes('_backup_restored')
    );
    
    // Keep only the 3 most recent backups
    if (backupKeys.length > 3) {
      const sortedKeys = backupKeys.sort((a, b) => {
        const timestampA = localStorage.getItem(`${a}_timestamp`) || '0';
        const timestampB = localStorage.getItem(`${b}_timestamp`) || '0';
        return parseInt(timestampB) - parseInt(timestampA);
      });
      
      // Remove old backups
      sortedKeys.slice(3).forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed old backup: ${key}`);
      });
    }
    
    console.log('🧹 Old backups cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up old backups:', error);
  }
}

// Validate data integrity
export function validateDataIntegrity(): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let isValid = true;
  
  try {
    const concepts = getConcepts();
    
    // Check if concepts array is valid
    if (!Array.isArray(concepts)) {
      issues.push('Data is not an array');
      isValid = false;
      suggestions.push('Restore from backup or reinitialize data');
      return { isValid, issues, suggestions };
    }
    
    // Check each concept for required fields
    concepts.forEach((concept, index) => {
      if (!concept.id || typeof concept.id !== 'number') {
        issues.push(`Concept ${index}: Missing or invalid ID`);
        isValid = false;
      }
      
      if (!concept.title || typeof concept.title !== 'string') {
        issues.push(`Concept ${index}: Missing or invalid title`);
        isValid = false;
      }
      
      if (!concept.description || typeof concept.description !== 'string') {
        issues.push(`Concept ${index}: Missing or invalid description`);
        isValid = false;
      }
      
      if (!concept.category || typeof concept.category !== 'string') {
        issues.push(`Concept ${index}: Missing or invalid category`);
        isValid = false;
      }
      
      if (typeof concept.views !== 'number' || concept.views < 0) {
        issues.push(`Concept ${index}: Invalid views count`);
        isValid = false;
      }
      
      if (typeof concept.likes !== 'number' || concept.likes < 0) {
        issues.push(`Concept ${index}: Invalid likes count`);
        isValid = false;
      }
      
      if (typeof concept.comments !== 'number' || concept.comments < 0) {
        issues.push(`Concept ${index}: Invalid comments count`);
        isValid = false;
      }
    });
    
    // Check for duplicate IDs
    const ids = concepts.map(c => c.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      issues.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
      isValid = false;
      suggestions.push('Fix duplicate IDs by reassigning unique IDs');
    }
    
    // Check for missing categories
    const categories = concepts.map(c => c.category);
    const uniqueCategories = [...new Set(categories)];
    if (uniqueCategories.length === 0) {
      issues.push('No categories found');
      isValid = false;
      suggestions.push('Add categories to concepts');
    }
    
    // Suggestions for improvement
    if (concepts.length === 0) {
      suggestions.push('Add some concepts to get started');
    }
    
    if (concepts.length > 0 && concepts.every(c => c.views === 0)) {
      suggestions.push('Consider adding some initial content to attract visitors');
    }
    
    console.log('🔍 Data integrity validation completed');
    
  } catch (error) {
    console.error('❌ Error validating data integrity:', error);
    issues.push('Error during validation');
    isValid = false;
    suggestions.push('Check console for detailed error information');
  }
  
  return { isValid, issues, suggestions };
}
