import { useState, useEffect } from "react";
import { getPublishedArticles, type Article } from "@/lib/articles-storage";
import ConceptCard from "@/components/ConceptCard";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AllArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  useEffect(() => {
    const loadArticles = () => {
      const publishedArticles = getPublishedArticles();
      console.log('AllArticles: Loading articles:', publishedArticles.length);
      setArticles(publishedArticles);
    };

    loadArticles();

    // Listen for articles updates
    const handleArticlesUpdate = () => {
      console.log('AllArticles: articlesUpdated event received');
      loadArticles();
    };

    window.addEventListener('articlesUpdated', handleArticlesUpdate);
    
    return () => {
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, []);

  // Filter articles based on category and search
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === "الكل" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ["الكل", ...Array.from(new Set(articles.map(article => article.category)))];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Navigation />
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            جميع المقالات
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة شاملة من المقالات والمفاهيم في مجالات ريادة الأعمال والتقنية والتسويق
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في جميع المقالات..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ConceptCard 
                key={article.id} 
                title={article.title}
                description={article.description}
                category={article.category}
                readTime={article.readTime || "5"}
                engagement={{
                  views: article.views || 0,
                  likes: article.likes || 0,
                  comments: article.comments || 0
                }}
                hasVideo={article.hasVideo}
                isPopular={article.isPopular}
                id={article.id}
                content={article.content}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لم نجد نتائج
            </h3>
            <p className="text-muted-foreground mb-6">
              جرب تغيير الفلتر أو كلمات البحث
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("الكل");
              }}
              variant="outline"
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 