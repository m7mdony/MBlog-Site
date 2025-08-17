import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNumber } from "@/lib/utils";
import { getCategories, type Category } from "@/lib/categories-storage";
import { useState, useEffect } from "react";

interface InfographicCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  views: number;
  likes: number;
  downloads: number;
  slug: string;
}

export function InfographicCard({
  id,
  title,
  description,
  thumbnailUrl,
  category,
  views,
  likes,
  downloads,
  slug
}: InfographicCardProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = () => {
      const allCategories = getCategories();
      // ترتيب الفلاتر حسب الترتيب المحفوظ
      const sortedCategories = [...allCategories].sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    loadCategories();

    const handleInfographicsUpdate = () => {
      // إعادة تحميل البيانات عند تحديث الإنفوجرافيك
      loadCategories();
    };

    const handleCategoriesUpdate = () => loadCategories();
    
    window.addEventListener('infographicsUpdated', handleInfographicsUpdate);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('infographicsUpdated', handleInfographicsUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  const categoryData = categories.find(cat => cat.name === category);
  const categoryColor = categoryData?.color || "#6B7280";

  return (
    <Card className="group overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header Buttons */}
      <div className="flex items-center justify-between p-4">
        <Badge 
          variant="outline" 
          className="text-xs px-3 py-1"
          style={{
            backgroundColor: categoryColor + '20',
            color: categoryColor,
            borderColor: categoryColor + '40'
          }}
        >
          {category}
        </Badge>
        <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-3 py-1">
          إنفوجرافيك
        </Badge>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-4">
        {/* Main Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
          {title}
        </h1>
        
        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Thumbnail Image */}
        <div className="mb-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {formatNumber(likes)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(downloads)}
            </span>
          </div>
          
          {/* View Full Button - مكان التصنيف */}
          <Link to={`/infographics/${slug}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-3 py-1 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              عرض كامل
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}