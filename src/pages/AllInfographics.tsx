import { useState, useEffect } from "react";
import { getInfographics, type Infographic } from "@/lib/infographics-storage";
import { getCategories, type Category } from "@/lib/categories-storage";
import { InfographicCard } from "@/components/InfographicCard";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc } from "lucide-react";

export default function AllInfographics() {
  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [filteredInfographics, setFilteredInfographics] = useState<Infographic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadInfographics = () => {
      const allInfographics = getInfographics();
      setInfographics(allInfographics);
    };

    const loadCategories = () => {
      const allCategories = getCategories();
      // ترتيب الفلاتر حسب الترتيب المحفوظ
      const sortedCategories = [...allCategories].sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    loadInfographics();
    loadCategories();

    const handleInfographicsUpdate = () => loadInfographics();
    const handleInfographicsReordered = () => loadInfographics();
    const handleCategoriesUpdate = () => loadCategories();
    
    window.addEventListener('infographicsUpdated', handleInfographicsUpdate);
    window.addEventListener('infographicsReordered', handleInfographicsReordered);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('infographicsUpdated', handleInfographicsUpdate);
      window.removeEventListener('infographicsReordered', handleInfographicsReordered);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  useEffect(() => {
    let filtered = [...infographics];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(infographic =>
        infographic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        infographic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        infographic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(infographic => infographic.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "most-viewed":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "most-liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "most-downloaded":
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
    }

    setFilteredInfographics(filtered);
    setCurrentPage(1);
  }, [infographics, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredInfographics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInfographics = filteredInfographics.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">الإنفوجرافيكات</h1>
          <p className="text-muted-foreground">
            تصفح مجموعة شاملة من الإنفوجرافيكات التوضيحية والمفيدة
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الإنفوجرافيكات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SortAsc className="h-4 w-4 ml-2" />
              <SelectValue placeholder="ترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
              <SelectItem value="most-viewed">الأكثر مشاهدة</SelectItem>
              <SelectItem value="most-liked">الأكثر إعجاباً</SelectItem>
              <SelectItem value="most-downloaded">الأكثر تحميلاً</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredInfographics.length} إنفوجرافيك
          </p>
          
          {/* Active filters */}
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                البحث: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find(cat => cat.name === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="ml-1 text-xs">×</button>
              </Badge>
            )}
          </div>
        </div>

        {/* Grid */}
        {currentInfographics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentInfographics.map((infographic) => (
              <InfographicCard
                key={`${infographic.id}-${infographic.thumbnailUrl}`}
                id={infographic.id}
                title={infographic.title}
                description={infographic.description}
                thumbnailUrl={infographic.thumbnailUrl}
                category={infographic.category}
                views={infographic.views}
                likes={infographic.likes}
                downloads={infographic.downloads}
                slug={infographic.slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">لا توجد إنفوجرافيكات تطابق معايير البحث</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              مسح الفلاتر
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              السابق
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}