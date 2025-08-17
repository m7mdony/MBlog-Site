// نظام تخزين المقالات
export interface Article {
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
  videoFile?: string; // Base64 للفيديو المرفوع
  imageUrl?: string;
  readTime?: string;
}

const STORAGE_KEY = 'mariam_bassitman_articles';
const ALT_STORAGE_KEY = 'mb_articles_alt';
const SESSION_STORAGE_KEY = 'session_articles';

// Get all articles
export function getArticles(): Article[] {
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    
    // إذا فشل التخزين الرئيسي، جرب التخزين البديل
    if (!stored) {
      stored = getFromAlternativeStorage(STORAGE_KEY);
    }
    
    // إذا فشل التخزين البديل، جرب sessionStorage
    if (!stored) {
      stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    }
    
    if (stored) {
      const articles = JSON.parse(stored);
      return Array.isArray(articles) ? articles : [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting articles:', error);
    return [];
  }
}

// Get published articles only
export function getPublishedArticles(): Article[] {
  return getArticles().filter(article => article.status === "منشور");
}

// Get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return getArticles().filter(article => article.category === category);
}

// Get popular articles
export function getPopularArticles(): Article[] {
  return getArticles().filter(article => article.isPopular);
}

// Get articles with video
export function getVideoArticles(): Article[] {
  return getArticles().filter(article => article.hasVideo);
}

// Add new article
export function addArticle(articleData: Omit<Article, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Article {
  try {
    const articles = getArticles();
    const newId = Math.max(...articles.map(a => a.id), 0) + 1;
    
    const newArticle: Article = {
      ...articleData,
      id: newId,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedArticles = [newArticle, ...articles];
    setArticles(updatedArticles);
    
    // Force clear any cached data
    localStorage.removeItem(`article_${newId}`);
    sessionStorage.removeItem(`article_${newId}`);
    
    console.log('✅ Article added successfully:', newArticle);
    return newArticle;
  } catch (error) {
    console.error('❌ Error adding article:', error);
    throw error;
  }
}

// Update article
export function updateArticle(id: number, updates: Partial<Article>): void {
  try {
    const articles = getArticles();
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, ...updates } : article
    );
    setArticles(updatedArticles);
    
    // Force clear any cached data
    localStorage.removeItem(`article_${id}`);
    sessionStorage.removeItem(`article_${id}`);
    
    console.log('✅ Article updated successfully:', id);
  } catch (error) {
    console.error('❌ Error updating article:', error);
    throw error;
  }
}

// Delete article
export function deleteArticle(id: number): void {
  try {
    const articles = getArticles();
    const updatedArticles = articles.filter(article => article.id !== id);
    setArticles(updatedArticles);
    
    // Force clear any cached data
    localStorage.removeItem(`article_${id}`);
    sessionStorage.removeItem(`article_${id}`);
    
    console.log('✅ Article deleted successfully:', id);
  } catch (error) {
    console.error('❌ Error deleting article:', error);
    throw error;
  }
}

// Increment article views
export function incrementArticleViews(id: number): void {
  try {
    const articles = getArticles();
    const updatedArticles = articles.map(article => 
      article.id === id ? { ...article, views: article.views + 1 } : article
    );
    setArticles(updatedArticles);
    
    console.log('✅ Article views incremented:', id);
  } catch (error) {
    console.error('❌ Error incrementing article views:', error);
  }
}

// Toggle article like
export function toggleArticleLike(id: number): boolean {
  try {
    const likeKey = `article_liked_${id}`;
    const hasLiked = localStorage.getItem(likeKey) === 'true';
    
    const articles = getArticles();
    const updatedArticles = articles.map(article => 
      article.id === id ? { 
        ...article, 
        likes: hasLiked ? Math.max(0, article.likes - 1) : article.likes + 1 
      } : article
    );
    
    setArticles(updatedArticles);
    localStorage.setItem(likeKey, hasLiked ? 'false' : 'true');
    
    console.log('✅ Article like toggled:', id, !hasLiked);
    return !hasLiked;
  } catch (error) {
    console.error('❌ Error toggling article like:', error);
    return false;
  }
}

// Check if user has liked an article
export function hasLikedArticle(id: number): boolean {
  return localStorage.getItem(`article_liked_${id}`) === 'true';
}

// Set articles (internal function)
function setArticles(articles: Article[]): void {
  try {
    // Try main storage first
    if (tryMainStorage(STORAGE_KEY, JSON.stringify(articles))) {
      console.log('✅ Articles saved to main storage');
    } else if (tryAlternativeStorage(STORAGE_KEY, JSON.stringify(articles))) {
      console.log('✅ Articles saved to alternative storage');
    } else if (trySessionStorage(SESSION_STORAGE_KEY, JSON.stringify(articles))) {
      console.log('✅ Articles saved to session storage');
    } else {
      console.error('❌ Failed to save articles to any storage');
      throw new Error('Storage failed');
    }
    
    // Update timestamp
    try {
      localStorage.setItem(`${STORAGE_KEY}_timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('⚠️ Could not update timestamp');
    }
    
    // Dispatch event to update UI immediately
    window.dispatchEvent(new CustomEvent('articlesUpdated', { detail: articles }));
    
    console.log(`✅ Successfully saved ${articles.length} articles`);
    console.log('📊 Data saved at:', new Date().toLocaleString());
    
  } catch (error) {
    console.error('❌ Error saving articles:', error);
    // Try to save a backup copy
    try {
      localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(articles));
      console.log('💾 Backup saved successfully');
    } catch (backupError) {
      console.error('❌ Failed to save backup:', backupError);
    }
    throw error;
  }
}

// Try main storage
function tryMainStorage(key: string, data: string): boolean {
  try {
    localStorage.setItem(key, data);
    return true;
  } catch (error) {
    console.warn('⚠️ Main storage failed, trying alternative...');
    return false;
  }
}

// Try alternative storage
function tryAlternativeStorage(key: string, data: string): boolean {
  try {
    localStorage.setItem(ALT_STORAGE_KEY, data);
    return true;
  } catch (error) {
    console.warn('⚠️ Alternative storage failed, trying session...');
    return false;
  }
}

// Try session storage
function trySessionStorage(key: string, data: string): boolean {
  try {
    sessionStorage.setItem(key, data);
    return true;
  } catch (error) {
    console.warn('⚠️ Session storage failed');
    return false;
  }
}

// Get from alternative storage
function getFromAlternativeStorage(key: string): string | null {
  try {
    return localStorage.getItem(ALT_STORAGE_KEY);
  } catch (error) {
    console.warn('⚠️ Failed to get from alternative storage');
    return null;
  }
}

// Compress data
function compressData(articles: Article[]): string {
  try {
    // Remove unnecessary fields for compression
    const compressedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.category,
      status: article.status,
      views: article.views,
      likes: article.likes,
      comments: article.comments,
      createdAt: article.createdAt,
      hasVideo: article.hasVideo,
      isPopular: article.isPopular,
      videoUrl: article.videoUrl,
      videoFile: article.videoFile,
      imageUrl: article.imageUrl,
      readTime: article.readTime
    }));
    
    return JSON.stringify(compressedArticles);
  } catch (error) {
    console.error('❌ Error compressing data:', error);
    return JSON.stringify(articles);
  }
}

// Check storage health
export function checkArticlesStorageHealth(): {
  isHealthy: boolean;
  totalArticles: number;
  lastSaveTime: string | null;
  hasBackup: boolean;
  storageSize: number;
  issues: string[];
} {
  try {
    const articles = getArticles();
    const timestamp = localStorage.getItem(`${STORAGE_KEY}_timestamp`);
    const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
    
    const issues: string[] = [];
    
    if (!articles || articles.length === 0) {
      issues.push('لا توجد مقالات محفوظة');
    }
    
    if (!timestamp) {
      issues.push('لا يوجد timestamp للحفظ');
    }
    
    const storageSize = new Blob([JSON.stringify(articles)]).size;
    
    return {
      isHealthy: issues.length === 0,
      totalArticles: articles.length,
      lastSaveTime: timestamp ? new Date(parseInt(timestamp)).toLocaleString('ar-SA') : null,
      hasBackup: !!backup,
      storageSize,
      issues
    };
  } catch (error) {
    console.error('❌ Error checking storage health:', error);
    return {
      isHealthy: false,
      totalArticles: 0,
      lastSaveTime: null,
      hasBackup: false,
      storageSize: 0,
      issues: ['خطأ في فحص صحة التخزين']
    };
  }
}

// Create backup
export function createArticlesBackup(): boolean {
  try {
    const articles = getArticles();
    const backupData = {
      articles,
      timestamp: new Date().toISOString(),
      description: 'نسخة احتياطية يدوية للمقالات'
    };
    
    localStorage.setItem(`${STORAGE_KEY}_manual_backup`, JSON.stringify(backupData));
    console.log('✅ Manual backup created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating manual backup:', error);
    return false;
  }
}

// Restore from backup
export function restoreArticlesFromBackup(): boolean {
  try {
    const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
    if (!backup) {
      console.warn('⚠️ No backup found');
      return false;
    }
    
    const articles = JSON.parse(backup);
    setArticles(articles);
    
    // Mark as restored
    localStorage.setItem(`${STORAGE_KEY}_backup_restored`, backup);
    console.log('✅ Articles restored from backup successfully');
    return true;
  } catch (error) {
    console.error('❌ Error restoring from backup:', error);
    return false;
  }
}

// Export articles data
export function exportArticlesData(): void {
  try {
    const articles = getArticles();
    const dataStr = JSON.stringify(articles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `articles_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Articles data exported successfully');
  } catch (error) {
    console.error('❌ Error exporting articles data:', error);
  }
}

// Import articles data
export function importArticlesDataFromFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const articles = JSON.parse(e.target?.result as string);
          if (Array.isArray(articles)) {
            setArticles(articles);
            console.log('✅ Articles data imported successfully');
            resolve(true);
          } else {
            console.error('❌ Invalid articles data format');
            resolve(false);
          }
        } catch (error) {
          console.error('❌ Error parsing imported data:', error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('❌ Error reading file:', error);
      resolve(false);
    }
  });
}

// Force refresh data
export function forceRefreshArticlesData(): void {
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
    
    // Dispatch refresh event
    window.dispatchEvent(new CustomEvent('articlesRefreshed'));
    
    console.log('✅ Articles data refreshed successfully');
  } catch (error) {
    console.error('❌ Error refreshing articles data:', error);
  }
}

// Clear cache and reload
export function clearArticlesCacheAndReload(): void {
  try {
    // Clear all storage keys related to articles
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('article')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Dispatch reload event
    window.dispatchEvent(new CustomEvent('articlesReloaded'));
    
    console.log('✅ Articles cache cleared and reloaded successfully');
  } catch (error) {
    console.error('❌ Error clearing articles cache:', error);
  }
}

// Test storage function
export function testStorage(): boolean {
  try {
    const testData = { test: true, timestamp: Date.now() };
    const testKey = 'test_storage_key';
    
    // Test localStorage
    try {
      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved && JSON.parse(retrieved).test) {
        console.log('✅ localStorage is working');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ localStorage failed:', error);
    }
    
    // Test sessionStorage
    try {
      sessionStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      
      if (retrieved && JSON.parse(retrieved).test) {
        console.log('✅ sessionStorage is working');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ sessionStorage failed:', error);
    }
    
    console.error('❌ No storage method is working');
    return false;
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return false;
  }
} 