import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getCategories } from "@/lib/categories-storage";
import { getConcepts } from "@/lib/storage";

interface CategoriesFilterProps {
  onFilterChange?: (category: string) => void;
  activeCategory?: string;
}

const getCategoryStyles = (color: string, active: boolean) => {
  const baseClasses = "relative group transition-all duration-300 hover:scale-105";
  
  if (active) {
    switch (color) {
      case "growth":
        return `${baseClasses} bg-gradient-growth text-white shadow-elegant`;
      case "operations":
        return `${baseClasses} bg-gradient-operations text-white shadow-elegant`;
      case "mindset":
        return `${baseClasses} bg-gradient-mindset text-white shadow-elegant`;
      case "tech":
        return `${baseClasses} bg-gradient-tech text-white shadow-elegant`;
      default:
        return `${baseClasses} bg-gradient-primary text-white shadow-elegant`;
    }
  } else {
    switch (color) {
      case "growth":
        return `${baseClasses} bg-category-growth-bg text-category-growth border border-category-growth/20 hover:bg-category-growth hover:text-white`;
      case "operations":
        return `${baseClasses} bg-category-operations-bg text-category-operations border border-category-operations/20 hover:bg-category-operations hover:text-white`;
      case "mindset":
        return `${baseClasses} bg-category-mindset-bg text-category-mindset border border-category-mindset/20 hover:bg-category-mindset hover:text-white`;
      case "tech":
        return `${baseClasses} bg-category-tech-bg text-category-tech border border-category-tech/20 hover:bg-category-tech hover:text-white`;
      default:
        return `${baseClasses} bg-background text-foreground border border-border hover:bg-accent-soft hover:border-primary/20`;
    }
  }
};

const CategoriesFilter = ({ 
  onFilterChange, 
  activeCategory = "الكل" 
}: CategoriesFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [categories, setCategories] = useState<{ name: string; count: number; color: string }[]>([]);

  // دالة لتحديث الفلاتر
  const updateCategories = () => {
    const categoryList = getCategories();
    const concepts = getConcepts();
    
    const categoriesWithCount = [
      { name: "الكل", count: concepts.length, color: "default" },
      ...categoryList.map(cat => ({
        name: cat.name,
        count: concepts.filter(c => c.category === cat.name).length,
        color: cat.color || "default"
      }))
    ];
    
    setCategories(categoriesWithCount);
  };

  useEffect(() => {
    // تحديث الفلاتر عند التحميل الأول
    updateCategories();

    // الاستماع لتحديثات الفلاتر
    const handleCategoriesUpdate = () => {
      updateCategories();
    };

    // الاستماع لتحديثات المفاهيم
    const handleConceptsUpdate = () => {
      updateCategories();
    };

    // الاستماع لتغييرات التخزين
    const handleStorageChange = () => {
      updateCategories();
    };

    // إضافة مستمعي الأحداث
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('conceptsUpdated', handleConceptsUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    // تنظيف المستمعين عند إلغاء التحميل
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('conceptsUpdated', handleConceptsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // تحديث الفلاتر عند تغيير activeCategory
  useEffect(() => {
    setSelectedCategory(activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    onFilterChange?.(categoryName);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {categories.map((category, index) => (
        <Button
          key={index}
          variant="ghost"
          size="lg"
          onClick={() => handleCategoryClick(category.name)}
          className={getCategoryStyles(
            category.color, 
            selectedCategory === category.name
          )}
        >
          <span className="font-medium">{category.name}</span>
          <Badge 
            variant="secondary" 
            className="mr-2 bg-white/20 text-current border-0 group-hover:bg-white/30 transition-all duration-300"
          >
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default CategoriesFilter;