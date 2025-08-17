import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Star, Eye, Share2, Bookmark } from "lucide-react";

const favoritesData = [
  {
    id: "1",
    siteName: "Linear - أداة إدارة المشاريع",
    description: "أداة رائعة لإدارة المهام والمشاريع التقنية",
    reason: "واجهة نظيفة وسرعة استثنائية في الأداء",
    category: "أدوات",
    url: "https://linear.app",
    content: `
# Linear - أداة إدارة المشاريع

## لماذا أنصح بـ Linear؟

Linear ليست مجرد أداة أخرى لإدارة المشاريع، بل تجربة مختلفة تماماً في التعامل مع المهام والمشاريع التقنية.

## ما يميز Linear

### 1. السرعة الاستثنائية
- تحميل فوري للصفحات
- استجابة سريعة لكل إجراء
- لا توجد فترات انتظار مزعجة

### 2. التصميم النظيف
- واجهة بسيطة وأنيقة
- تركيز على المحتوى وليس التشتيت
- تجربة مستخدم سلسة ومريحة

### 3. قوة في البساطة
- ميزات قوية بدون تعقيد
- تدفق عمل منطقي وواضح
- سهولة في التعلم والاستخدام

## الميزات الرئيسية

### إدارة المهام المتقدمة
- تتبع دقيق للمهام والأخطاء
- نظام أولويات ذكي
- ربط المهام بالملفات والمشاريع

### التعاون الفعال
- تعليقات وتحديثات فورية
- إشعارات ذكية وغير مزعجة
- مشاركة سهلة مع الفريق

### التكامل القوي
- يتكامل مع GitHub و GitLab
- دعم للأدوات المطورة الشائعة
- API قوي للتخصيصات

## من يستفيد من Linear؟

- **الفرق التقنية**: مطوري البرمجيات ومديري المنتجات
- **الشركات الناشئة**: التي تحتاج أداة سريعة ومرنة
- **المشاريع التقنية**: التي تتطلب تتبع دقيق للتقدم

## التسعير

- **خطة مجانية**: للفرق الصغيرة (حتى 10 أشخاص)
- **خطة مدفوعة**: تبدأ من $8/شهر للشخص الواحد
- **خطة المؤسسات**: للشركات الكبيرة

## تجربتي الشخصية

استخدمت Linear في عدة مشاريع، وما أعجبني فيها:
- **اللحظة الأولى**: شعرت بالفرق في السرعة فوراً
- **سهولة التنظيم**: ترتيب المهام أصبح أسهل وأكثر وضوحاً
- **التركيز**: الواجهة لا تشتت الانتباه عن العمل الفعلي

## بدائل أخرى للمقارنة

- **Jira**: أكثر تعقيداً لكن أكثر تفصيلاً
- **Asana**: أفضل للمشاريع غير التقنية
- **Notion**: أكثر مرونة لكن أبطأ في الأداء

## الخلاصة

إذا كنت تعمل في مجال التقنية وتبحث عن أداة سريعة وأنيقة لإدارة مشاريعك، Linear خيار ممتاز يستحق التجربة.
    `,
    views: 680,
    clicks: 89
  },
  {
    id: "2",
    siteName: "Raycast - مشغل التطبيقات",
    description: "أداة إنتاجية قوية لنظام macOS",
    reason: "توفر الوقت وتسرع من سير العمل بشكل مذهل",
    category: "إنتاجية",
    url: "https://raycast.com",
    content: "المحتوى الكامل لشرح Raycast...",
    views: 520,
    clicks: 67
  },
  {
    id: "3",
    siteName: "Excalidraw - الرسم التفاعلي",
    description: "أداة رسم بسيطة وقوية للتوضيحات والمخططات",
    reason: "سهولة الاستخدام مع إمكانيات تعاون رائعة",
    category: "تصميم",
    url: "https://excalidraw.com",
    content: "المحتوى الكامل لشرح Excalidraw...",
    views: 390,
    clicks: 45
  }
];

export default function FavoriteView() {
  const { id } = useParams();
  const favorite = favoritesData.find(f => f.id === id) || favoritesData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowRight className="w-4 h-4 ml-2 rotate-180" />
            العودة للرئيسية
          </Link>
        </div>

        {/* Favorite Card */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-muted/10 to-secondary/5 border-b">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit bg-muted/20">
                ⭐ رابط مميز
              </Badge>
              
              <div className="flex items-center gap-4">
                <div className="text-5xl">🌐</div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
                    {favorite.siteName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {favorite.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{favorite.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      <span>{favorite.clicks} زيارة</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground">
                {favorite.description}
              </p>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">ليه أنصح بهذه الأداة:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {favorite.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {favorite.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <ExternalLink className="w-4 h-4 ml-2" />
            زيارة الموقع
          </Button>
          
          <Button variant="outline" size="lg">
            <Bookmark className="w-4 h-4 ml-2" />
            حفظ في المفضلة
          </Button>
          
          <Button variant="outline" size="lg">
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>
          
          <Button variant="outline" size="lg">
            <Star className="w-4 h-4 ml-2" />
            أدوات مشابهة
          </Button>
        </div>
      </div>
    </div>
  );
}