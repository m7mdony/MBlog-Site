
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, Calendar, Play, Clock, Heart, Share2, MessageCircle } from "lucide-react";
import { getConcepts, incrementViews, type Concept } from "@/lib/storage";
import { getSettings } from "@/lib/settings-storage";
import ArticleInteractionButtons from "@/components/ArticleInteractionButtons";

const ConceptView = () => {
  const { id } = useParams();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    if (id) {
      const concepts = getConcepts();
      const foundConcept = concepts.find(c => c.id === parseInt(id));
      if (foundConcept) {
        setConcept(foundConcept);
        // Increment view count
        incrementViews(parseInt(id));
      }
    }

    // Listen for settings changes
    const handleSettingsChange = () => {
      setSettings(getSettings());
    };

    window.addEventListener('sectionSettingsUpdated', handleSettingsChange);
    
    return () => {
      window.removeEventListener('sectionSettingsUpdated', handleSettingsChange);
    };
  }, [id]);

  if (!concept) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">المقال غير موجود</h2>
          <Button asChild>
            <Link to="/">العودة للصفحة الرئيسية</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "نمو الأعمال":
        return {
          bgClass: "bg-category-growth-bg",
          textClass: "text-category-growth",
          gradientClass: "bg-gradient-growth",
          headerBg: "bg-category-growth",
          headerText: "text-white",
          accentBorder: "border-category-growth/20"
        };
      case "التشغيل":
        return {
          bgClass: "bg-category-operations-bg",
          textClass: "text-category-operations",
          gradientClass: "bg-gradient-operations",
          headerBg: "bg-category-operations",
          headerText: "text-white",
          accentBorder: "border-category-operations/20"
        };
      case "العقلية":
        return {
          bgClass: "bg-category-mindset-bg",
          textClass: "text-category-mindset",
          gradientClass: "bg-gradient-mindset",
          headerBg: "bg-category-mindset",
          headerText: "text-white",
          accentBorder: "border-category-mindset/20"
        };
      case "التقنية":
        return {
          bgClass: "bg-category-tech-bg",
          textClass: "text-category-tech",
          gradientClass: "bg-gradient-tech",
          headerBg: "bg-category-tech",
          headerText: "text-white",
          accentBorder: "border-category-tech/20"
        };
      default:
        return {
          bgClass: "bg-category-default-bg",
          textClass: "text-category-default",
          gradientClass: "bg-gradient-default",
          headerBg: "bg-category-default",
          headerText: "text-white",
          accentBorder: "border-category-default/20"
        };
    }
  };

  const styles = getCategoryStyles(concept.category);

  // Calculate reading time (assuming 200 words per minute)
  const wordCount = concept.content ? concept.content.split(' ').length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto px-4">
        {/* Hero Header Section with Category Color */}
        <div className={`${styles.headerBg} rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 transform -translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative z-10">
            {/* Category and Tags Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {concept.hasVideo && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    يحتوي على فيديو
                  </Badge>
                )}
                <Badge variant="secondary" className={`${styles.bgClass} ${styles.textClass} border-0`}>
                  {concept.category}
                </Badge>
                {concept.isPopular && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    ⭐ مميز
                  </Badge>
                )}
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {concept.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              {concept.description}
            </p>

            {/* Meta Stats Row */}
            <div className="flex items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} دقائق</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(concept.views || 0).toLocaleString('ar')} مشاهدة</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{concept.likes} إعجاب</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>{Math.floor(concept.views * 0.1)} مشاركة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Video section if available */}
          {concept.hasVideo && concept.videoUrl && (
            <div className="mb-8">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted shadow-lg">
                <iframe
                  src={concept.videoUrl.replace('watch?v=', 'embed/')}
                  title="فيديو المقال"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground">
            {concept.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: concept.content.replace(/\n/g, '<br />'),
                }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  محتوى هذا المقال قيد التطوير
                </h3>
                <p className="text-muted-foreground">
                  سيتم إضافة المحتوى قريباً. شكراً لصبرك!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interaction Buttons */}
        <ArticleInteractionButtons 
          articleId={concept.id} 
          showEngagement={settings.showEngagementInArticles}
        />
      </article>
    </div>
  );
};

export default ConceptView;
