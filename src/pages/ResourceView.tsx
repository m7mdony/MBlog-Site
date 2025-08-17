import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Eye, Share2, ExternalLink, FileText } from "lucide-react";

const resourcesData = [
  {
    id: "1",
    fileName: "قالب تقييم أفكار المشاريع",
    fileType: "PDF",
    description: "قالب شامل لتقييم الأفكار وتحليل الجدوى قبل بدء أي مشروع",
    fileSize: "2.5 MB",
    downloadUrl: "#",
    content: `
# قالب تقييم أفكار المشاريع

هذا القالب مصمم لمساعدتك في تقييم أفكار المشاريع بطريقة منهجية وعلمية قبل استثمار الوقت والمال فيها.

## ما يحتويه القالب

### 1. تحليل الفكرة الأساسية
- وصف الفكرة بوضوح
- المشكلة التي تحلها
- الحل المقترح
- الفئة المستهدفة

### 2. دراسة السوق
- حجم السوق المحتمل
- تحليل المنافسين
- نقاط القوة والضعف
- الفرص والتهديدات (SWOT)

### 3. التحليل المالي
- التكاليف الأولية المطلوبة
- مصادر التمويل المحتملة
- توقعات الإيرادات
- نقطة التعادل

### 4. الجدولة الزمنية
- مراحل تطوير المشروع
- الأهداف قصيرة ومتوسطة المدى
- نقاط المراجعة والتقييم

### 5. تقييم المخاطر
- المخاطر التقنية
- المخاطر المالية
- المخاطر التسويقية
- خطط الطوارئ

## كيفية استخدام القالب

1. **املأ كل قسم بعناية**: لا تتسرع في الإجابات
2. **كن صادقاً مع نفسك**: الهدف هو التقييم الواقعي
3. **استشر الخبراء**: للحصول على آراء خارجية
4. **راجع دورياً**: الخطط تتغير والتقييم يجب أن يواكب

## نصائح للحصول على أفضل النتائج

- **اجمع البيانات من مصادر موثوقة**
- **استخدم الأرقام الواقعية وليس المتفائلة**
- **فكر في السيناريوهات المختلفة**
- **لا تتجاهل التحديات المحتملة**

## الدعم والمساعدة

إذا كنت تحتاج لمساعدة في استخدام هذا القالب أو تقييم فكرة مشروعك، لا تتردد في التواصل معي.
    `,
    views: 850,
    downloads: 234
  },
  {
    id: "2",
    fileName: "خطة التسويق الرقمي",
    fileType: "Notion",
    description: "قالب جاهز لبناء استراتيجية التسويق الرقمي لمشروعك",
    fileSize: "—",
    downloadUrl: "#",
    content: "المحتوى الكامل لخطة التسويق الرقمي...",
    views: 620,
    downloads: 189
  },
  {
    id: "3",
    fileName: "تتبع الأهداف الشخصية",
    fileType: "Excel",
    description: "جدول بيانات لتتبع وقياس تقدمك في تحقيق أهدافك",
    fileSize: "1.2 MB",
    downloadUrl: "#",
    content: "المحتوى الكامل لتتبع الأهداف الشخصية...",
    views: 420,
    downloads: 156
  }
];

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return '📄';
    case 'notion':
      return '📝';
    case 'excel':
    case 'xlsx':
      return '📊';
    default:
      return '📁';
  }
};

export default function ResourceView() {
  const { id } = useParams();
  const resource = resourcesData.find(r => r.id === id) || resourcesData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowRight className="w-4 h-4 ml-2 rotate-180" />
            العودة للرئيسية
          </Link>
        </div>

        {/* Resource Card */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/5 border-b">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit bg-accent/20">
                📁 ملف ومصدر
              </Badge>
              
              <div className="flex items-center gap-4">
                <div className="text-5xl">
                  {getFileIcon(resource.fileType)}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
                    {resource.fileName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {resource.fileType}
                    </Badge>
                    <span>{resource.fileSize}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{resource.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground">
                {resource.description}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {resource.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70">
            <Download className="w-4 h-4 ml-2" />
            تحميل الملف ({resource.downloads})
          </Button>
          
          <Button variant="outline" size="lg">
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>
          
          <Button variant="outline" size="lg">
            <ExternalLink className="w-4 h-4 ml-2" />
            معاينة
          </Button>
          
          <Button variant="outline" size="lg">
            <FileText className="w-4 h-4 ml-2" />
            ملفات مشابهة
          </Button>
        </div>
      </div>
    </div>
  );
}