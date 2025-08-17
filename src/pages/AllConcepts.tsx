import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Search, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getConcepts, type Concept } from "@/lib/storage";
import { getCategories } from "@/lib/categories-storage";
import ConceptCardWithData from "@/components/ConceptCardWithData";

export default function AllConcepts() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const loadData = () => {
      setConcepts(getConcepts().filter(concept => concept.status === "منشور"));
    };

    // Load data initially
    loadData();

    // Listen for concepts updates
    const handleConceptsUpdate = (event: CustomEvent<Concept[]>) => {
      setConcepts(event.detail.filter(concept => concept.status === "منشور"));
    };

    // Listen for categories updates
    const handleCategoriesUpdate = () => {
      // إعادة تحميل البيانات عند تحديث الفلاتر
      loadData();
    };

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('conceptsUpdated', handleConceptsUpdate as EventListener);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('conceptsUpdated', handleConceptsUpdate as EventListener);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const categoriesData = getCategories();
  const categories = ["الكل", ...categoriesData.map(cat => cat.name)];

  const filteredAndSortedConcepts = concepts
    .filter(concept => {
      const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           concept.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "الكل" || concept.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "منشور":
        return "bg-green-100 text-green-800";
      case "مسودة":
        return "bg-yellow-100 text-yellow-800";
      case "مخفي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">جميع المقالات</h1>
          <p className="text-muted-foreground">تصفح واكتشف جميع المقالات المنشورة</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">
            العودة للرئيسية
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortOrder === "desc" ? "default" : "outline"}
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              >
                <ArrowUpDown className="w-4 h-4 ml-2" />
                {sortOrder === "desc" ? "الأحدث أولاً" : "الأقدم أولاً"}
              </Button>
              
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        عرض {filteredAndSortedConcepts.length} من أصل {concepts.length} مقال
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedConcepts.map((concept) => (
          <ConceptCardWithData key={concept.id} concept={concept} />
        ))}
      </div>

      {filteredAndSortedConcepts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد مقالات مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
}