// Storage utility for managing infographics data
export interface Infographic {
  id: number;
  title: string;
  description: string;
  imageUrl: string;        // الملف الكامل للتحميل
  thumbnailUrl: string;    // الصورة المصغرة للعرض والمعاينة
  category: string;
  tags: string[];
  views: number;
  likes: number;
  downloads: number;
  createdAt: string;
  slug: string;
  order: number;           // ترتيب الإنفوجرافيك
}

const STORAGE_KEY = 'mariam_bassitman_infographics';
const BACKUP_KEY = 'mariam_bassitman_infographics_backup';
const TIMESTAMP_KEY = 'mariam_bassitman_infographics_timestamp';
const STORAGE_VERSION = '1.0';

// Default infographics data
const defaultInfographics: Infographic[] = [
  {
    id: 1,
    title: "نقلة نوعية في عالم الأمان",
    description: "إنفوجرافيك حول أتمتة الأعمال والأمان الرقمي",
    imageUrl: "/lovable-uploads/4a49607d-217b-4911-bd6c-0618cf532c74.png",
    thumbnailUrl: "/lovable-uploads/4a49607d-217b-4911-bd6c-0618cf532c74.png",
    category: "الأتمتة",
    tags: ["أتمتة", "تقنية", "أعمال", "أمان"],
    views: 1250,
    likes: 89,
    downloads: 45,
    createdAt: "2024-01-15",
    slug: "security-qualitative-leap",
    order: 1
  },
  {
    id: 2,
    title: "أدوات التسويق الرقمي",
    description: "دليل شامل لأفضل أدوات التسويق الرقمي",
    imageUrl: "/placeholder.svg?height=600&width=480",
    thumbnailUrl: "/placeholder.svg?height=300&width=240",
    category: "التسويق",
    tags: ["تسويق", "رقمي", "أدوات"],
    views: 980,
    likes: 67,
    downloads: 32,
    createdAt: "2024-01-10",
    slug: "digital-marketing-tools",
    order: 2
  },
  {
    id: 3,
    title: "خريطة طريق ريادة الأعمال",
    description: "الخطوات الأساسية لبناء مشروع ناجح",
    imageUrl: "/placeholder.svg?height=600&width=480",
    thumbnailUrl: "/placeholder.svg?height=300&width=240",
    category: "ريادة الأعمال",
    tags: ["ريادة", "أعمال", "خريطة"],
    views: 1450,
    likes: 125,
    downloads: 78,
    createdAt: "2024-01-08",
    slug: "entrepreneurship-roadmap",
    order: 3
  }
];

// Check available storage space
function getAvailableStorage(): number {
  try {
    const testKey = '__storage_test__';
    const testValue = '1';
    let available = 0;
    
    // Test with increasing data size
    for (let i = 0; i < 1000; i++) {
      try {
        localStorage.setItem(testKey, testValue.repeat(i * 1000));
        available = i * 1000;
      } catch (e) {
        break;
      }
    }
    
    // Clean up test data
    localStorage.removeItem(testKey);
    return available;
  } catch (error) {
    console.warn('⚠️ Could not determine available storage:', error);
    return 5000000; // Default 5MB
  }
}

// Compress data before storage
function compressData(data: any): string {
  try {
    // Remove unnecessary whitespace and compress JSON
    const compressed = JSON.stringify(data, null, 0);
    return compressed;
  } catch (error) {
    console.warn('⚠️ Could not compress data, using original:', error);
    return JSON.stringify(data);
  }
}

// Clean up old data to free space
function cleanupStorage(): boolean {
  try {
    const keys = Object.keys(localStorage);
    const infographicKeys = keys.filter(key => 
      key.startsWith('mariam_bassitman_infographics') ||
      key.startsWith('infographic_liked_')
    );
    
    // Remove old backup files first
    const backupKeys = infographicKeys.filter(key => 
      key.includes('_backup') && key !== BACKUP_KEY
    );
    
    backupKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed old backup: ${key}`);
      } catch (e) {
        console.warn(`⚠️ Could not remove old backup: ${key}`);
      }
    });
    
    // If still no space, remove some old liked flags
    if (getAvailableStorage() < 100000) { // Less than 100KB
      const likedKeys = infographicKeys.filter(key => key.startsWith('infographic_liked_'));
      const keysToRemove = likedKeys.slice(0, Math.floor(likedKeys.length / 2));
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed old like flag: ${key}`);
        } catch (e) {
          console.warn(`⚠️ Could not remove like flag: ${key}`);
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error cleaning up storage:', error);
    return false;
  }
}

// Create backup of current data
function createBackup(infographics: Infographic[]): void {
  try {
    // Check available space first
    const available = getAvailableStorage();
    const dataSize = JSON.stringify(infographics).length;
    
    if (dataSize > available * 0.8) { // If data is more than 80% of available space
      console.warn('⚠️ Low storage space, cleaning up before backup...');
      cleanupStorage();
    }
    
    const compressedData = compressData(infographics);
    localStorage.setItem(BACKUP_KEY, compressedData);
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    console.log('💾 Backup created successfully for infographics');
  } catch (error) {
    console.error('❌ Failed to create backup:', error);
    
    // Try emergency cleanup and backup
    try {
      cleanupStorage();
      const compressedData = compressData(infographics);
      localStorage.setItem(BACKUP_KEY, compressedData);
      console.log('💾 Emergency backup created after cleanup');
    } catch (emergencyError) {
      console.error('❌ Emergency backup also failed:', emergencyError);
    }
  }
}

// Validate infographic data structure
function validateInfographic(infographic: any): infographic is Infographic {
  return (
    infographic &&
    typeof infographic.id === 'number' &&
    typeof infographic.title === 'string' &&
    typeof infographic.description === 'string' &&
    typeof infographic.imageUrl === 'string' &&
    typeof infographic.thumbnailUrl === 'string' &&
    typeof infographic.category === 'string' &&
    Array.isArray(infographic.tags) &&
    typeof infographic.views === 'number' &&
    typeof infographic.likes === 'number' &&
    typeof infographic.downloads === 'number' &&
    typeof infographic.createdAt === 'string' &&
    typeof infographic.slug === 'string' &&
    typeof infographic.order === 'number'
  );
}

// Validate infographics array
function validateInfographicsArray(infographics: any[]): boolean {
  if (!Array.isArray(infographics)) return false;
  return infographics.every(validateInfographic);
}

// Get all infographics (ordered by order field)
export function getInfographics(): Infographic[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const infographics = JSON.parse(stored);
      
      // التحقق من صحة البيانات
      if (!validateInfographicsArray(infographics)) {
        console.warn('⚠️ Stored infographics data is corrupted, attempting to restore from backup...');
        
        // محاولة استعادة من النسخة الاحتياطية
        const backup = localStorage.getItem(BACKUP_KEY);
        if (backup) {
          try {
            const backupInfographics = JSON.parse(backup);
            if (validateInfographicsArray(backupInfographics)) {
              console.log('🔄 Restoring infographics from backup...');
              setInfographics(backupInfographics);
              return backupInfographics;
            }
          } catch (backupError) {
            console.error('❌ Failed to restore from backup:', backupError);
          }
        }
        
        // إذا فشلت الاستعادة، استخدم البيانات الافتراضية
        console.log('🆕 Initializing with default infographics due to data corruption...');
        setInfographics(defaultInfographics);
        return defaultInfographics;
      }
      
      // تحديث البيانات القديمة لتتضمن حقل order إذا لم يكن موجوداً
      const updatedInfographics = infographics.map((infographic: Infographic, index: number) => {
        if (typeof infographic.order === 'undefined') {
          return { ...infographic, order: index + 1 };
        }
        return infographic;
      });
      
      // حفظ البيانات المحدثة إذا تم تحديثها
      if (JSON.stringify(updatedInfographics) !== JSON.stringify(infographics)) {
        setInfographics(updatedInfographics);
      }
      
      // ترتيب الإنفوجرافيك حسب حقل order
      return updatedInfographics.sort((a: Infographic, b: Infographic) => a.order - b.order);
    }
    
    // لا توجد بيانات مخزنة، استخدم البيانات الافتراضية
    console.log('🆕 No stored infographics found, initializing with defaults...');
    setInfographics(defaultInfographics);
    return defaultInfographics;
  } catch (error) {
    console.error('❌ Error loading infographics:', error);
    
    // محاولة استعادة من النسخة الاحتياطية في حالة الخطأ
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        const backupInfographics = JSON.parse(backup);
        if (validateInfographicsArray(backupInfographics)) {
          console.log('🔄 Restoring infographics from backup after error...');
          return backupInfographics;
        }
      }
    } catch (backupError) {
      console.error('❌ Failed to restore from backup after error:', backupError);
    }
    
    return defaultInfographics;
  }
}

// Save all infographics with smart storage management
export function setInfographics(infographics: Infographic[]): void {
  try {
    // التحقق من صحة البيانات قبل الحفظ
    if (!validateInfographicsArray(infographics)) {
      throw new Error('Invalid infographics data structure');
    }
    
    // Check available storage space
    const available = getAvailableStorage();
    const dataSize = JSON.stringify(infographics).length;
    
    if (dataSize > available * 0.9) { // If data is more than 90% of available space
      console.warn('⚠️ Low storage space detected, cleaning up...');
      cleanupStorage();
      
      // Check again after cleanup
      const newAvailable = getAvailableStorage();
      if (dataSize > newAvailable * 0.9) {
        throw new Error(`Insufficient storage space. Required: ${dataSize} bytes, Available: ${newAvailable} bytes`);
      }
    }
    
    // إنشاء نسخة احتياطية قبل الحفظ
    createBackup(infographics);
    
    // حفظ البيانات الجديدة مع ضغط
    const compressedData = compressData(infographics);
    localStorage.setItem(STORAGE_KEY, compressedData);
    
    // إرسال حدث التحديث
    console.log('✅ Successfully saved infographics to localStorage');
    console.log(`📊 Saved ${infographics.length} infographics at:`, new Date().toLocaleString());
    console.log(`💾 Data size: ${(dataSize / 1024).toFixed(2)} KB`);
    
    window.dispatchEvent(new CustomEvent('infographicsUpdated', { detail: infographics }));
    
    // إرسال حدث إضافي للتأكد من التحديث
    window.dispatchEvent(new Event('storage'));
    
  } catch (error) {
    console.error('❌ Error saving infographics:', error);
    
    // محاولة حفظ نسخة احتياطية في حالة الخطأ
    try {
      createBackup(infographics);
      console.log('💾 Emergency backup created');
    } catch (backupError) {
      console.error('❌ Failed to create emergency backup:', backupError);
    }
    
    // إعادة رمي الخطأ للمعالجة في المستوى الأعلى
    throw error;
  }
}

// Add a new infographic
export function addInfographic(infographicData: Omit<Infographic, 'id' | 'views' | 'likes' | 'downloads' | 'createdAt' | 'slug' | 'order'>): Infographic {
  console.log('➕ Adding new infographic:', infographicData);
  
  try {
    const infographics = getInfographics();
    const newId = Math.max(...infographics.map(i => i.id), 0) + 1;
    const newOrder = Math.max(...infographics.map(i => i.order), 0) + 1;
    
    const newInfographic: Infographic = {
      ...infographicData,
      id: newId,
      views: 0,
      likes: 0,
      downloads: 0,
      createdAt: new Date().toISOString().split('T')[0],
      slug: generateSlug(infographicData.title),
      order: newOrder
    };
    
    console.log('✅ New infographic created:', newInfographic);
    const updatedInfographics = [newInfographic, ...infographics];
    setInfographics(updatedInfographics);
    return newInfographic;
    
  } catch (error) {
    console.error('❌ Error adding infographic:', error);
    throw error;
  }
}

// Update an infographic
export function updateInfographic(id: number, updates: Partial<Infographic>): void {
  console.log('✏️ Updating infographic', id, 'with updates:', updates);
  
  try {
    const infographics = getInfographics();
    const updatedInfographics = infographics.map(infographic => 
      infographic.id === id ? { ...infographic, ...updates } : infographic
    );
    
    console.log('✅ Updated infographics:', updatedInfographics);
    setInfographics(updatedInfographics);
    
  } catch (error) {
    console.error('❌ Error updating infographic:', error);
    throw error;
  }
}

// Delete an infographic
export function deleteInfographic(id: number): void {
  console.log('🗑️ Deleting infographic:', id);
  
  try {
    const infographics = getInfographics();
    const updatedInfographics = infographics.filter(infographic => infographic.id !== id);
    setInfographics(updatedInfographics);
    
    console.log('✅ Infographic deleted successfully');
    
  } catch (error) {
    console.error('❌ Error deleting infographic:', error);
    throw error;
  }
}

// Reorder infographics
export function reorderInfographics(startIndex: number, endIndex: number): void {
  console.log('🔄 Reordering infographics from', startIndex, 'to', endIndex);
  
  try {
    const infographics = getInfographics();
    
    // التأكد من صحة المؤشرات
    if (startIndex < 0 || endIndex < 0 || startIndex >= infographics.length || endIndex >= infographics.length) {
      throw new Error(`Invalid indices for reordering: startIndex=${startIndex}, endIndex=${endIndex}, length=${infographics.length}`);
    }
    
    // إذا كان نفس المكان، لا حاجة للتغيير
    if (startIndex === endIndex) return;
    
    const [removed] = infographics.splice(startIndex, 1);
    infographics.splice(endIndex, 0, removed);
    
    // تحديث ترتيب جميع الإنفوجرافيك
    const updatedInfographics = infographics.map((infographic, index) => ({
      ...infographic,
      order: index + 1
    }));
    
    setInfographics(updatedInfographics);
    
    // إرسال حدث مخصص لإعادة الترتيب
    window.dispatchEvent(new CustomEvent('infographicsReordered', { 
      detail: { startIndex, endIndex, newOrder: updatedInfographics } 
    }));
    
    console.log('✅ Infographics reordered successfully');
    
  } catch (error) {
    console.error('❌ Error reordering infographics:', error);
    throw error;
  }
}

// Increment view count
export function incrementInfographicViews(id: number): void {
  try {
    const infographics = getInfographics();
    const updatedInfographics = infographics.map(infographic => 
      infographic.id === id ? { ...infographic, views: infographic.views + 1 } : infographic
    );
    setInfographics(updatedInfographics);
  } catch (error) {
    console.error('❌ Error incrementing views:', error);
  }
}

// Increment download count
export function incrementInfographicDownloads(id: number): void {
  try {
    const infographics = getInfographics();
    const updatedInfographics = infographics.map(infographic => 
      infographic.id === id ? { ...infographic, downloads: infographic.downloads + 1 } : infographic
    );
    setInfographics(updatedInfographics);
  } catch (error) {
    console.error('❌ Error incrementing downloads:', error);
  }
}

// Like/Unlike functionality
export function toggleInfographicLike(id: number): boolean {
  try {
    const likeKey = `infographic_liked_${id}`;
    const hasLiked = localStorage.getItem(likeKey) === 'true';
    
    const infographics = getInfographics();
    const updatedInfographics = infographics.map(infographic => 
      infographic.id === id ? { 
        ...infographic, 
        likes: hasLiked ? Math.max(0, infographic.likes - 1) : infographic.likes + 1 
      } : infographic
    );
    
    setInfographics(updatedInfographics);
    localStorage.setItem(likeKey, hasLiked ? 'false' : 'true');
    
    return !hasLiked;
    
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    return false;
  }
}

// Check if user has liked an infographic
export function hasLikedInfographic(id: number): boolean {
  return localStorage.getItem(`infographic_liked_${id}`) === 'true';
}

// Reset all infographics statistics
export function resetInfographicsStats(): void {
  console.log('🔄 Resetting all infographics statistics...');
  
  try {
    const infographics = getInfographics();
    const updatedInfographics = infographics.map(infographic => ({
      ...infographic,
      views: 0,
      likes: 0,
      downloads: 0
    }));
    
    setInfographics(updatedInfographics);
    
    // مسح جميع علامات الإعجاب
    infographics.forEach(infographic => {
      localStorage.removeItem(`infographic_liked_${infographic.id}`);
    });
    
    console.log('✅ All infographics statistics reset successfully');
    
  } catch (error) {
    console.error('❌ Error resetting statistics:', error);
    throw error;
  }
}

// Get infographic by slug
export function getInfographicBySlug(slug: string): Infographic | undefined {
  try {
    const infographics = getInfographics();
    return infographics.find(infographic => infographic.slug === slug);
  } catch (error) {
    console.error('❌ Error getting infographic by slug:', error);
    return undefined;
  }
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Check storage health and data integrity
export function checkInfographicsStorageHealth(): {
  isHealthy: boolean;
  totalInfographics: number;
  lastSaveTime: string | null;
  hasBackup: boolean;
  storageSize: number;
  availableSpace: number;
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
      const infographics = JSON.parse(stored);
      if (!validateInfographicsArray(infographics)) {
        issues.push('Main data is corrupted');
        isHealthy = false;
      }
    }
    
    // Check timestamp
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    const lastSaveTime = timestamp ? new Date(parseInt(timestamp)).toLocaleString() : null;
    
    // Check backup
    const backup = localStorage.getItem(BACKUP_KEY);
    const hasBackup = !!backup;
    
    // Check storage size and available space
    const storageSize = stored ? new Blob([stored]).size : 0;
    const availableSpace = getAvailableStorage();
    
    // Check if storage is getting full
    if (storageSize > availableSpace * 0.8) {
      issues.push('Storage space is getting low');
      isHealthy = false;
    }
    
    const totalInfographics = stored ? JSON.parse(stored).length : 0;
    
    console.log('🔍 Infographics Storage Health Check:', {
      isHealthy,
      totalInfographics,
      lastSaveTime,
      hasBackup,
      storageSize: `${(storageSize / 1024).toFixed(2)} KB`,
      availableSpace: `${(availableSpace / 1024).toFixed(2)} KB`,
      issues
    });
    
    return {
      isHealthy,
      totalInfographics,
      lastSaveTime,
      hasBackup,
      storageSize,
      availableSpace,
      issues
    };
    
  } catch (error) {
    console.error('❌ Error checking storage health:', error);
    return {
      isHealthy: false,
      totalInfographics: 0,
      lastSaveTime: null,
      hasBackup: false,
      storageSize: 0,
      availableSpace: 0,
      issues: ['Error checking storage health']
    };
  }
}

// Restore data from backup
export function restoreInfographicsFromBackup(): boolean {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) {
      console.log('❌ No backup found to restore from');
      return false;
    }
    
    const backupInfographics = JSON.parse(backup);
    if (!validateInfographicsArray(backupInfographics)) {
      console.log('❌ Backup data is corrupted');
      return false;
    }
    
    // حفظ النسخة الاحتياطية كبيانات رئيسية
    setInfographics(backupInfographics);
    
    // إنشاء نسخة احتياطية جديدة من البيانات المستعادة
    localStorage.setItem(`${BACKUP_KEY}_restored`, backup);
    
    console.log('✅ Infographics data restored from backup successfully');
    console.log(`📊 Restored ${backupInfographics.length} infographics`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error restoring from backup:', error);
    return false;
  }
}

// Create manual backup
export function createManualBackup(): boolean {
  try {
    const infographics = getInfographics();
    createBackup(infographics);
    console.log('✅ Manual backup created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating manual backup:', error);
    return false;
  }
}

// Export infographics data to JSON
export function exportInfographicsData(): string {
  try {
    const infographics = getInfographics();
    const exportData = {
      infographics,
      exportedAt: new Date().toISOString(),
      version: STORAGE_VERSION
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    console.log('✅ Infographics data exported successfully');
    
    return jsonString;
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
}

// Import infographics data from JSON file
export function importInfographicsDataFromFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        if (importData.infographics && validateInfographicsArray(importData.infographics)) {
          // إنشاء نسخة احتياطية قبل الاستيراد
          createManualBackup();
          
          // استيراد البيانات
          setInfographics(importData.infographics);
          
          console.log('✅ Infographics data imported successfully');
          console.log(`📊 Imported ${importData.infographics.length} infographics`);
          
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

// Force cleanup of storage
export function forceStorageCleanup(): boolean {
  try {
    console.log('🧹 Starting forced storage cleanup...');
    
    // Remove all old backup files
    const keys = Object.keys(localStorage);
    const backupKeys = keys.filter(key => 
      key.startsWith('mariam_bassitman_infographics') && 
      key !== STORAGE_KEY && 
      key !== BACKUP_KEY && 
      key !== TIMESTAMP_KEY
    );
    
    backupKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
      } catch (e) {
        console.warn(`⚠️ Could not remove: ${key}`);
      }
    });
    
    // Remove old like flags
    const likedKeys = keys.filter(key => key.startsWith('infographic_liked_'));
    likedKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed like flag: ${key}`);
      } catch (e) {
        console.warn(`⚠️ Could not remove like flag: ${key}`);
      }
    });
    
    console.log('✅ Forced storage cleanup completed');
    return true;
    
  } catch (error) {
    console.error('❌ Error during forced cleanup:', error);
    return false;
  }
}