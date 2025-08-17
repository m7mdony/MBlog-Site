import { useState, useEffect } from "react";
import { getPublishedArticles, type Article } from "@/lib/articles-storage";
import { getSectionSettings, type SectionSettings } from "@/lib/settings-storage";
import ProfileCard from "@/components/ProfileCard";
import ArticleCard from "@/components/ArticleCard";
import CategoriesFilter from "@/components/CategoriesFilter";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { LatestConcept } from "@/components/LatestConcept";
import { LatestToolTutorial } from "@/components/LatestToolTutorial";
import { NewFileResource } from "@/components/NewFileResource";
import { ExternalFavorite } from "@/components/ExternalFavorite";
import { CTASection } from "@/components/CTASection";
import { MobileCarousel } from "@/components/MobileCarousel";
import { SectionWithShowMore } from "@/components/SectionWithShowMore";
import { InfographicsSection } from "@/components/InfographicsSection";

// البيانات الافتراضية للمقالات (تُستخدم فقط إذا لم تكن هناك مقالات محفوظة)
const defaultArticles = [
  {
    title: "كيف تبني عادات نمو مستدامة في عملك",
    description: "استراتيجيات عملية لبناء عادات يومية تضمن النمو المستمر لمشروعك دون الوقوع في فخ الإرهاق.",
    content: "النمو المستدام في الأعمال يتطلب أكثر من مجرد استراتيجيات قصيرة المدى. إنه يتطلب بناء عادات يومية تدعم أهدافك طويلة المدى. في هذا المقال، سنستكشف كيفية تطوير عادات تعزز النمو المستمر دون التضحية بصحتك أو توازن حياتك. سنبدأ بفهم الفرق بين العادات الجيدة والسيئة، ثم نتعلم كيفية تطبيق مبادئ علم النفس السلوكي لبناء عادات تدوم طويلاً.",
    category: "نمو الأعمال",
    readTime: "5",
    engagement: { views: 1250, likes: 89, comments: 23 },
    hasVideo: true,
    isPopular: true
  },
  {
    title: "التشغيل الذكي: أتمتة المهام المتكررة",
    description: "دليل شامل لأتمتة العمليات المتكررة في عملك واستخدام الأدوات التقنية لتوفير الوقت والجهد.",
    content: "الأتمتة هي المفتاح لتحقيق الكفاءة في الأعمال الحديثة. في هذا الدليل الشامل، سنتعلم كيفية تحديد المهام المتكررة التي يمكن أتمتتها، والأدوات المناسبة لكل نوع من المهام. سنبدأ بتحليل عملياتك الحالية، ثم نضع خطة أتمتة تدريجية تضمن عدم تعطيل العمل الجاري. سنتعلم أيضاً كيفية قياس نجاح الأتمتة وتحديد النقاط التي تحتاج إلى تحسين.",
    category: "التشغيل",
    readTime: "8",
    engagement: { views: 980, likes: 67, comments: 15 }
  },
  {
    title: "عقلية رائد الأعمال: التعامل مع الفشل",
    description: "كيف تحول الفشل إلى فرصة للتعلم والنمو، ولماذا المرونة النفسية أهم من الخبرة التقنية.",
    content: "الفشل ليس نهاية الطريق، بل هو بداية التعلم الحقيقي. في هذا المقال، سنستكشف كيف يمكن تحويل الفشل إلى فرصة للنمو والتطور. سنتعلم كيفية تطوير عقلية مرنة تسمح لنا بالتعافي السريع من النكسات، وكيفية استخراج الدروس القيمة من كل تجربة فاشلة. سنرى أيضاً كيف أن المرونة النفسية غالباً ما تكون أكثر أهمية من الخبرة التقنية في رحلة ريادة الأعمال.",
    category: "العقلية",
    readTime: "6",
    engagement: { views: 1450, likes: 125, comments: 34 },
    hasVideo: true
  },
  {
    title: "اختيار التقنيات المناسبة لمشروعك",
    description: "معايير اختيار الأدوات والتقنيات المناسبة لحجم ونوع مشروعك دون الوقوع في فخ التعقيد الزائد.",
    content: "اختيار التقنيات المناسبة يمكن أن يكون الفرق بين النجاح والفشل في أي مشروع. في هذا الدليل، سنتعلم كيفية تقييم احتياجات مشروعك بدقة، وكيفية مقارنة الأدوات المتاحة بناءً على معايير موضوعية. سنركز على أهمية البساطة والكفاءة، وكيفية تجنب الوقوع في فخ التقنيات المعقدة التي لا تحتاجها. سنتعلم أيضاً كيفية بناء نظام تقني قابل للتوسع مع نمو مشروعك.",
    category: "التقنية",
    readTime: "7",
    engagement: { views: 750, likes: 52, comments: 12 }
  },
  {
    title: "بناء فريق عمل عن بُعد فعال",
    description: "استراتيجيات إدارة الفرق الموزعة وضمان الإنتاجية والتواصل الفعال في بيئة العمل عن بُعد.",
    content: "العمل عن بُعد أصبح واقعاً لا مفر منه في عالم الأعمال الحديث. في هذا المقال، سنستكشف الاستراتيجيات الفعالة لبناء وإدارة فرق العمل عن بُعد. سنتعلم كيفية إنشاء ثقافة عمل تعاونية رغم المسافات، وكيفية استخدام الأدوات التقنية لتعزيز التواصل والإنتاجية. سنركز على أهمية الثقة والمساءلة، وكيفية بناء علاقات عمل قوية في البيئة الافتراضية.",
    category: "التشغيل",
    readTime: "9",
    engagement: { views: 1100, likes: 78, comments: 19 },
    isPopular: true
  },
  {
    title: "من الفكرة إلى الإطلاق: خارطة طريق",
    description: "دليل مفصل لتحويل الفكرة إلى منتج قابل للتسويق مع تجنب الأخطاء الشائعة في رحلة ريادة الأعمال.",
    content: "رحلة تحويل الفكرة إلى منتج قابل للتسويق مليئة بالتحديات والمفاجآت. في هذا الدليل المفصل، سنرسم خارطة طريق واضحة لكل مرحلة من مراحل التطوير. سنبدأ بتطوير الفكرة وتحديد السوق المستهدف، ثم ننتقل إلى التصميم والتطوير والاختبار. سنتعلم كيفية تجنب الأخطاء الشائعة التي يقع فيها معظم رواد الأعمال، وكيفية بناء منتج يحل مشكلة حقيقية في السوق.",
    category: "نمو الأعمال",
    readTime: "12",
    engagement: { views: 2100, likes: 156, comments: 45 },
    hasVideo: true,
    isPopular: true
  }
];

// Featured Content Data
const latestConcepts = [
  {
    id: "1",
    title: "بناء نظام إدارة المهام الشخصي",
    description: "نظرة عميقة على أساليب تنظيم المهام والمشاريع بطريقة فعالة ومستدامة",
    readTime: "5 دقائق"
  },
  {
    id: "2",
    title: "فن التفكير الاستراتيجي",
    description: "كيف تطور قدرتك على التفكير طويل المدى والتخطيط للمستقبل",
    readTime: "8 دقائق"
  },
  {
    id: "3",
    title: "إدارة الطاقة الشخصية",
    description: "استراتيجيات للحفاظ على الطاقة والتركيز في عالم مليء بالمشتتات",
    readTime: "6 دقائق"
  }
];

const toolTutorials = [
  {
    id: "1",
    title: "Notion - نظرة سريعة وشاملة",
    description: "كيف تستخدم Notion لتنظيم حياتك ومشاريعك بطريقة احترافية",
    thumbnail: "/placeholder.svg",
    duration: "12:30"
  },
  {
    id: "2",
    title: "Figma للمبتدئين",
    description: "أساسيات التصميم في Figma وكيفية إنشاء واجهات جميلة",
    thumbnail: "/placeholder.svg",
    duration: "15:45"
  },
  {
    id: "3",
    title: "Obsidian - إدارة المعرفة",
    description: "بناء قاعدة معرفة شخصية قوية باستخدام Obsidian",
    thumbnail: "/placeholder.svg",
    duration: "18:20"
  }
];

const fileResources = [
  {
    id: "1",
    fileName: "قالب تقييم أفكار المشاريع",
    fileType: "PDF",
    description: "قالب شامل لتقييم الأفكار وتحليل الجدوى قبل بدء أي مشروع",
    fileSize: "2.5 MB"
  },
  {
    id: "2",
    fileName: "خطة التسويق الرقمي",
    fileType: "Notion",
    description: "قالب جاهز لبناء استراتيجية التسويق الرقمي لمشروعك",
    fileSize: "—"
  },
  {
    id: "3",
    fileName: "تتبع الأهداف الشخصية",
    fileType: "Excel",
    description: "جدول بيانات لتتبع وقياس تقدمك في تحقيق أهدافك",
    fileSize: "1.2 MB"
  }
];

const externalFavorites = [
  {
    id: "1",
    siteName: "Linear - أداة إدارة المشاريع",
    description: "أداة رائعة لإدارة المهام والمشاريع التقنية",
    reason: "واجهة نظيفة وسرعة استثنائية في الأداء",
    category: "أدوات"
  },
  {
    id: "2",
    siteName: "Raycast - مشغل التطبيقات",
    description: "أداة إنتاجية قوية لنظام macOS",
    reason: "توفر الوقت وتسرع من سير العمل بشكل مذهل",
    category: "إنتاجية"
  },
  {
    id: "3",
    siteName: "Excalidraw - الرسم التفاعلي",
    description: "أداة رسم بسيطة وقوية للتوضيحات والمخططات",
    reason: "سهولة الاستخدام مع إمكانيات تعاون رائعة",
    category: "تصميم"
  }
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [storedArticles, setStoredArticles] = useState<Article[]>([]);
  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    showHero: true,
    showLatestConcept: true,
    showConcepts: true,
    showTutorials: false,
    showResources: false,
    showFavorites: false,
    showStats: false,
    showCTA: true,
    hideEngagementStats: true,
    showCertifications: true,
    showEngagementInArticles: false,
  });

  useEffect(() => {
    const loadData = () => {
      console.log('Index: loadData called');
      setStoredArticles(getPublishedArticles());
      setSectionSettings(getSectionSettings());
    };

    // Load data initially
    loadData();

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent<SectionSettings>) => {
      setSectionSettings(event.detail);
    };

    // Listen for articles updates
    const handleArticlesUpdate = (event: CustomEvent<Article[]>) => {
      setStoredArticles(event.detail.filter(article => article.status === "منشور"));
    };

    // Listen for infographics updates
    const handleInfographicsUpdate = () => {
      console.log('Index: infographicsUpdated event received');
      // إعادة تحميل البيانات عند تحديث الإنفوجرافيك
      loadData();
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

    window.addEventListener('sectionSettingsUpdated', handleSettingsUpdate as EventListener);
    window.addEventListener('articlesUpdated', handleArticlesUpdate as EventListener);
    window.addEventListener('infographicsUpdated', handleInfographicsUpdate);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('sectionSettingsUpdated', handleSettingsUpdate as EventListener);
      window.removeEventListener('articlesUpdated', handleArticlesUpdate as EventListener);
      window.removeEventListener('infographicsUpdated', handleInfographicsUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Apply engagement stats visibility
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .engagement-stats {
        display: ${!sectionSettings.hideEngagementStats ? 'block' : 'none'} !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [sectionSettings.hideEngagementStats]);

  // Use only stored articles (no more static concepts)
  const allConcepts = storedArticles.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    content: a.content, // إضافة محتوى المقال
    category: a.category,
    readTime: a.readTime || "5",
    engagement: { views: a.views, likes: a.likes, comments: a.comments },
    hasVideo: a.hasVideo,
    isPopular: a.isPopular
  }));

  // Filter concepts based on category and search
  const filteredConcepts = allConcepts.filter(concept => {
    const matchesCategory = activeCategory === "الكل" || concept.category === activeCategory;
    const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         concept.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Navigation />
        </div>
      </div>

      {/* Hero Section */}
      {sectionSettings.showHero && (
        <div 
          className="relative bg-cover bg-center py-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-background/80"></div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="animate-fade-in text-center">
              <ProfileCard />
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filters at the top */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في جميع المحتوى..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <CategoriesFilter 
            onFilterChange={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>

        {/* Featured Content Section - Mobile Optimized */}
        {(sectionSettings.showLatestConcept || sectionSettings.showTutorials || sectionSettings.showResources || sectionSettings.showFavorites) && (
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              أحدث المحتوى المميز
            </h2>
            
            {/* Latest Concepts Section with Mobile Carousel */}
            {sectionSettings.showLatestConcept && (
              <SectionWithShowMore
                title="🔥 أحدث المفاهيم"
                initialCount={3}
                viewAllLink="/all-concepts"
                children={storedArticles.slice(0, 3).map((article, index) => (
                  <LatestConcept 
                    key={article.id} 
                    id={article.id.toString()}
                    title={article.title}
                    description={article.description}
                    readTime={article.readTime || "5 دقائق"}
                  />
                ))}
              />
            )}

            {/* Tool Tutorials Section with Show More */}
            {sectionSettings.showTutorials && (
              <SectionWithShowMore
                title="📹 شروحات الأدوات"
                initialCount={3}
                viewAllLink="/tutorials"
                children={toolTutorials.map((tutorial, index) => (
                  <LatestToolTutorial key={index} {...tutorial} />
                ))}
              />
            )}

            {/* File Resources Section with Show More */}
            {sectionSettings.showResources && (
              <SectionWithShowMore
                title="📁 ملفات ومصادر جديدة"
                initialCount={3}
                viewAllLink="/resources"
                children={fileResources.map((resource, index) => (
                  <NewFileResource key={index} {...resource} />
                ))}
              />
            )}

            {/* External Favorites Section with Show More */}
            {sectionSettings.showFavorites && (
              <SectionWithShowMore
                title="⭐ روابط تقنية مميزة"
                initialCount={3}
                viewAllLink="/favorites"
                children={externalFavorites.map((favorite, index) => (
                  <ExternalFavorite key={index} {...favorite} />
                ))}
              />
            )}
          </div>
        )}

        {/* Infographics Section */}
        <InfographicsSection />

        {/* Articles Section with Mobile Carousel */}
        {sectionSettings.showConcepts && (
          <SectionWithShowMore
            title="📝 مقالات"
            initialCount={3}
            viewAllLink="/all-articles"
            children={allConcepts.map((concept, index) => (
                              <ArticleCard key={index} article={concept} />
            ))}
          />
        )}

        {/* CTA Section - Last Section */}
        {sectionSettings.showCTA && (
          <div className="w-full max-w-none px-4 mb-8">
            <CTASection />
          </div>
        )}

        {filteredConcepts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لم نجد نتائج
            </h3>
            <p className="text-muted-foreground">
              جرب تغيير الفلتر أو كلمات البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;