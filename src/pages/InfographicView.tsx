import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInfographicBySlug, incrementInfographicViews, incrementInfographicDownloads, toggleInfographicLike, hasLikedInfographic, type Infographic } from "@/lib/infographics-storage";
import { getCategories, type Category } from "@/lib/categories-storage";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Download, Share2, Eye, ArrowLeft, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/utils";

export default function InfographicView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [infographic, setInfographic] = useState<Infographic | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      navigate('/infographics');
      return;
    }

    const loadInfographic = () => {
      const foundInfographic = getInfographicBySlug(slug);
      if (!foundInfographic) {
        navigate('/infographics');
        return;
      }
      
      setInfographic(foundInfographic);
      setIsLiked(hasLikedInfographic(foundInfographic.id));
      
      // Increment views
      incrementInfographicViews(foundInfographic.id);
      setIsLoading(false);
    };

    const loadCategories = () => {
      const allCategories = getCategories();
      // ترتيب الفلاتر حسب الترتيب المحفوظ
      const sortedCategories = [...allCategories].sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    loadInfographic();
    loadCategories();

    // Listen for infographics updates
    const handleInfographicsUpdate = () => {
      loadInfographic();
    };

    const handleCategoriesUpdate = () => loadCategories();
    
    window.addEventListener('infographicsUpdated', handleInfographicsUpdate);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('infographicsUpdated', handleInfographicsUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, [slug, navigate]);

  const handleLike = () => {
    if (!infographic) return;
    
    const newLikeStatus = toggleInfographicLike(infographic.id);
    setIsLiked(newLikeStatus);
    
    toast({
      title: newLikeStatus ? "تم الإعجاب" : "تم إلغاء الإعجاب",
      description: newLikeStatus ? "تمت إضافة إعجابك" : "تم إلغاء إعجابك",
    });
  };

  const handleDownload = () => {
    if (!infographic) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = infographic.imageUrl;
    link.download = `${infographic.title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Increment download count
    incrementInfographicDownloads(infographic.id);
    
    toast({
      title: "تم بدء التحميل",
      description: "سيتم تحميل الإنفوجرافيك قريباً",
    });
  };

  const handleShare = async () => {
    if (!infographic) return;
    
    const shareData = {
      title: infographic.title,
      text: infographic.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط الإنفوجرافيك إلى الحافظة",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!infographic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/infographics')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للإنفوجرافيكات
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={infographic.thumbnailUrl}
                  alt={infographic.title}
                  className="w-full h-auto object-contain"
                />
                {/* أيقونة إنفوجرافيك محذوفة من الجزء العلوي */}
              </div>
            </Card>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              {/* العنوان مقسم إلى جزئين */}
              <div className="space-y-2 mb-4">
                <h1 className="text-3xl font-bold text-foreground leading-tight">
                  {infographic.title}
                </h1>
                <h2 
                  className="text-3xl font-bold leading-tight"
                  style={{
                    color: (() => {
                      const categoryData = categories.find(cat => cat.name === infographic.category);
                      return categoryData?.color || "#6B7280";
                    })()
                  }}
                >
                  {infographic.category}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {infographic.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(() => {
                const categoryData = categories.find(cat => cat.name === infographic.category);
                const categoryColor = categoryData?.color || "#6B7280";
                return (
                  <Badge 
                    variant="outline"
                    style={{
                      backgroundColor: categoryColor + '20',
                      color: categoryColor,
                      borderColor: categoryColor + '40'
                    }}
                  >
                    {infographic.category}
                  </Badge>
                );
              })()}
            </div>

            <div className="flex flex-wrap gap-2">
              {infographic.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(infographic.views)} مشاهدة
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {formatNumber(infographic.likes)} إعجاب
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {formatNumber(infographic.downloads)} تحميل
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownload} 
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                تحميل الإنفوجرافيك
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`flex-1 flex items-center gap-2 ${isLiked ? 'text-red-500 border-red-200' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  إعجاب
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => window.open(infographic.thumbnailUrl, '_blank')}
                className="w-full flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                فتح بحجم كامل
              </Button>
            </div>

            {/* Meta Info */}
            <div className="pt-4 border-t border-border text-xs text-muted-foreground">
              <p>تاريخ النشر: {new Date(infographic.createdAt).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}