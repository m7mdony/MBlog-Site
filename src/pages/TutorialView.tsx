import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Clock, Eye, Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";

const tutorialsData = [
  {
    id: "1",
    title: "Notion - نظرة سريعة وشاملة",
    description: "كيف تستخدم Notion لتنظيم حياتك ومشاريعك بطريقة احترافية",
    duration: "12:30",
    thumbnail: "/placeholder.svg",
    content: `
# Notion - نظرة سريعة وشاملة

في هذا الشرح، سنستكشف معاً كيفية استخدام Notion لتنظيم حياتك ومشاريعك بطريقة احترافية.

## ما ستتعلمه في هذا الفيديو

### الأساسيات (0:00 - 3:00)
- ما هو Notion وما يميزه عن الأدوات الأخرى
- إنشاء حساب والتعرف على الواجهة
- فهم نظام البلوكات (Blocks)

### بناء قاعدة البيانات (3:00 - 7:00)
- إنشاء قواعد بيانات للمهام والمشاريع
- استخدام الخصائص المختلفة (Properties)
- الفلاتر والترتيب الذكي

### القوالب والأتمتة (7:00 - 10:30)
- استخدام القوالب الجاهزة
- إنشاء قوالب مخصصة
- ربط قواعد البيانات ببعضها

### نصائح الإنتاجية (10:30 - 12:30)
- اختصارات لوحة المفاتيح المهمة
- تنظيم المساحة الجانبية
- النسخ الاحتياطي والمزامنة

## الموارد المرفقة

- رابط القوالب المستخدمة في الفيديو
- قائمة بأفضل قوالب Notion المجانية
- دليل الاختصارات كاملاً

## للمتقدمين

إذا كنت تريد التعمق أكثر في Notion، تابع الفيديوهات التالية في السلسلة:
- Notion للفرق: إدارة المشاريع الجماعية
- أتمتة Notion مع Zapier
- بناء CRM بسيط في Notion
    `,
    views: 2400,
    likes: 156,
    comments: 34
  },
  {
    id: "2",
    title: "Figma للمبتدئين",
    description: "أساسيات التصميم في Figma وكيفية إنشاء واجهات جميلة",
    duration: "15:45",
    thumbnail: "/placeholder.svg",
    content: "المحتوى الكامل لشرح Figma...",
    views: 1800,
    likes: 89,
    comments: 23
  },
  {
    id: "3",
    title: "Obsidian - إدارة المعرفة",
    description: "بناء قاعدة معرفة شخصية قوية باستخدام Obsidian",
    duration: "18:20", 
    thumbnail: "/placeholder.svg",
    content: "المحتوى الكامل لشرح Obsidian...",
    views: 1200,
    likes: 67,
    comments: 19
  }
];

export default function TutorialView() {
  const { id } = useParams();
  const tutorial = tutorialsData.find(t => t.id === id) || tutorialsData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowRight className="w-4 h-4 ml-2 rotate-180" />
            العودة للرئيسية
          </Link>
        </div>

        {/* Video Card */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10 border-b">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit bg-secondary/20">
                📹 شرح أداة
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {tutorial.title}
              </h1>
              
              <p className="text-lg text-muted-foreground">
                {tutorial.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{(tutorial.views || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{tutorial.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{tutorial.comments}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          {/* Video Player */}
          <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="text-center space-y-4 z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="text-white/80 font-medium">اضغط لتشغيل الفيديو</p>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded">
              {tutorial.duration}
            </div>
          </div>
          
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {tutorial.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70">
            <Play className="w-4 h-4 ml-2" />
            شاهد على YouTube
          </Button>
          
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Heart className="w-4 h-4 ml-2" />
            أعجبني ({tutorial.likes})
          </Button>
          
          <Button variant="outline" size="lg">
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>
          
          <Button variant="outline" size="lg">
            <ExternalLink className="w-4 h-4 ml-2" />
            الموارد المرفقة
          </Button>
        </div>
      </div>
    </div>
  );
}