import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Share2, Heart, MessageCircle, Play, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getSettings } from "@/lib/settings-storage";

interface ConceptCardWithDataProps {
  concept: {
    id: number;
    title: string;
    description: string;
    content: string;
    category: string;
    views: number;
    likes: number;
    comments: number;
    hasVideo?: boolean;
    isPopular?: boolean;
  };
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "نمو الأعمال":
      return {
        bgClass: "bg-category-growth-bg",
        textClass: "text-category-growth",
        gradientClass: "bg-gradient-growth",
        accentClass: "border-r-category-growth"
      };
    case "التشغيل":
      return {
        bgClass: "bg-category-operations-bg", 
        textClass: "text-category-operations",
        gradientClass: "bg-gradient-operations",
        accentClass: "border-r-category-operations"
      };
    case "العقلية":
      return {
        bgClass: "bg-category-mindset-bg",
        textClass: "text-category-mindset", 
        gradientClass: "bg-gradient-mindset",
        accentClass: "border-r-category-mindset"
      };
    case "التقنية":
      return {
        bgClass: "bg-category-tech-bg",
        textClass: "text-category-tech",
        gradientClass: "bg-gradient-tech", 
        accentClass: "border-r-category-tech"
      };
    default:
      return {
        bgClass: "bg-category-default-bg",
        textClass: "text-category-default",
        gradientClass: "bg-gradient-default",
        accentClass: "border-r-category-default"
      };
  }
};

const getIconForCategory = (category: string) => {
  switch (category) {
    case "نمو الأعمال":
      return "📈";
    case "التشغيل":
      return "⚙️";
    case "العقلية":
      return "🧠";
    case "التقنية":
      return "💻";
    default:
      return "📝";
  }
};

const ConceptCardWithData = ({ concept }: ConceptCardWithDataProps) => {
  const styles = getCategoryStyles(concept.category);
  const categoryIcon = getIconForCategory(concept.category);
  const settings = getSettings();
  
  // Extract first sentence from content as preview
  const contentPreview = concept.content ? 
    concept.content.split('.').slice(0, 2).join('.') + '...' : 
    concept.description;
  
  return (
    <Card className={`group relative overflow-hidden bg-background border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-glow hover:scale-[1.02] ${styles.accentClass} border-r-4`}>
      {concept.isPopular && (
        <div className={`absolute top-0 left-0 ${styles.gradientClass} text-white px-4 py-2 rounded-br-xl text-sm font-medium shadow-lg`}>
          ⭐ مميز
        </div>
      )}
      
      <div className="p-8">
        {/* Header with icon and category */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${styles.bgClass} flex items-center justify-center text-2xl`}>
              {categoryIcon}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`${styles.bgClass} ${styles.textClass} border-0 font-medium`}>
                  {concept.category}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary text-xs border-primary/20">
                  مقال
                </Badge>
              </div>
              {concept.hasVideo && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Play className="w-3 h-3" />
                  يحتوي على فيديو
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            5 دقائق
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
          {concept.title}
        </h3>
        
        {/* Small Description Box */}
        <div className={`p-3 rounded-lg ${styles.bgClass} border-r-4 ${styles.accentClass} mb-4`}>
          <p className="text-foreground font-medium leading-relaxed text-sm">
            {concept.description}
          </p>
        </div>
        
        {/* Content Preview */}
        <p className="text-muted-foreground leading-relaxed mb-6 text-base line-clamp-3">
          {contentPreview}
        </p>
        
        {/* Engagement stats with interaction - controlled by settings */}
        {!settings.hideEngagementStats && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 hover:text-red-500 transition-colors p-1 h-auto"
            >
              <Heart className="w-4 h-4" />
              {concept.likes}
            </Button>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {(concept.views || 0).toLocaleString('ar')}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {concept.comments}
            </div>
          </div>
        )}
        
        {/* Additional Engagement Stats - Always visible below the card */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
          <div className="flex items-center justify-center text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{(concept.views || 0).toLocaleString('ar')}</span>
                <span className="text-xs">مشاهدة</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="font-medium">{concept.likes}</span>
                <span className="text-xs">إعجاب</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">تعليق</span>
                <span className="font-medium">{concept.comments}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <Button 
            asChild
            className={`flex-1 group/btn relative overflow-hidden ${styles.gradientClass} text-white border-0 shadow-elegant hover:shadow-glow hover:scale-105 transition-all duration-300`}
            size="lg"
          >
            <Link to={`/concept/${concept.id}`}>
              <span className="flex items-center gap-2">
                ابدأ القراءة
                <ArrowLeft className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="hover:bg-accent-soft hover:border-primary/20 hover:text-primary transition-all duration-300"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
};

export default ConceptCardWithData;