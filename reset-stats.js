// سكريبت تصفير جميع الإحصائيات في MBlog
console.log('🚀 بدء تصفير جميع الإحصائيات...');

// تصفير إحصائيات المقالات
const articles = JSON.parse(localStorage.getItem('articles') || '[]');
articles.forEach(article => {
  article.views = 0;
  article.likes = 0;
  article.downloads = 0;
  article.comments = 0;
});
localStorage.setItem('articles', JSON.stringify(articles));
console.log(`✅ تم تصفير إحصائيات ${articles.length} مقال`);

// تصفير إحصائيات المفاهيم
const concepts = JSON.parse(localStorage.getItem('concepts') || '[]');
concepts.forEach(concept => {
  concept.views = 0;
  concept.likes = 0;
  concept.downloads = 0;
  concept.comments = 0;
});
localStorage.setItem('concepts', JSON.stringify(concepts));
console.log(`✅ تم تصفير إحصائيات ${concepts.length} مفهوم`);

// تصفير إحصائيات الإنفوجرافيك
const infographics = JSON.parse(localStorage.getItem('infographics') || '[]');
infographics.forEach(infographic => {
  infographic.views = 0;
  infographic.likes = 0;
  infographic.downloads = 0;
  infographic.comments = 0;
});
localStorage.setItem('infographics', JSON.stringify(infographics));
console.log(`✅ تم تصفير إحصائيات ${infographics.length} إنفوجرافيك`);

// تصفير إحصائيات الموارد
const resources = JSON.parse(localStorage.getItem('resources') || '[]');
resources.forEach(resource => {
  resource.views = 0;
  resource.likes = 0;
  resource.downloads = 0;
  resource.comments = 0;
});
localStorage.setItem('resources', JSON.stringify(resources));
console.log(`✅ تم تصفير إحصائيات ${resources.length} مورد`);

// تصفير إحصائيات الدروس
const tutorials = JSON.parse(localStorage.getItem('tutorials') || '[]');
tutorials.forEach(tutorial => {
  tutorial.views = 0;
  tutorial.likes = 0;
  tutorial.downloads = 0;
  tutorial.comments = 0;
});
localStorage.setItem('tutorials', JSON.stringify(tutorials));
console.log(`✅ تم تصفير إحصائيات ${tutorials.length} درس`);

// تصفير إحصائيات المفضلة
const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
favorites.forEach(favorite => {
  favorite.views = 0;
  favorite.likes = 0;
  favorite.downloads = 0;
  favorite.comments = 0;
});
localStorage.setItem('favorites', JSON.stringify(favorites));
console.log(`✅ تم تصفير إحصائيات ${favorites.length} مفضلة`);

// تصفير الإحصائيات العامة
const stats = {
  totalViews: 0,
  totalLikes: 0,
  totalDownloads: 0,
  totalComments: 0,
  totalArticles: articles.length,
  totalConcepts: concepts.length,
  totalInfographics: infographics.length,
  totalResources: resources.length,
  totalTutorials: tutorials.length,
  totalFavorites: favorites.length
};
localStorage.setItem('stats', JSON.stringify(stats));
console.log(`✅ تم تصفير الإحصائيات العامة`);

// تصفير علامات الإعجاب المحفوظة
const likedItems = JSON.parse(localStorage.getItem('likedItems') || '[]');
if (likedItems.length > 0) {
  localStorage.removeItem('likedItems');
  console.log(`✅ تم مسح ${likedItems.length} علامة إعجاب محفوظة`);
}

console.log('🎉 تم تصفير جميع الإحصائيات بنجاح!');
console.log('📊 الإحصائيات الجديدة:');
console.log(`   - المقالات: ${articles.length}`);
console.log(`   - المفاهيم: ${concepts.length}`);
console.log(`   - الإنفوجرافيك: ${infographics.length}`);
console.log(`   - الموارد: ${resources.length}`);
console.log(`   - الدروس: ${tutorials.length}`);
console.log(`   - المفضلة: ${favorites.length}`);

// تحديث الصفحة لعرض التغييرات
if (typeof window !== 'undefined') {
  // إرسال حدث تحديث للصفحة
  window.dispatchEvent(new CustomEvent('storage'));
  console.log('🔄 تم إرسال حدث تحديث للصفحة');
} 