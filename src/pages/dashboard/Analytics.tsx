import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Download,
  ExternalLink,
  RefreshCw,
  FileText,
  Lightbulb,
  Image,
  BookOpen
} from "lucide-react";
import { resetAllStats } from "@/lib/storage";
import { toast } from "sonner";

// دالة للحصول على الإحصائيات من localStorage
const getStatsFromStorage = () => {
  try {
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    return {
      totalViews: stats.totalViews || 0,
      totalLikes: stats.totalLikes || 0,
      totalComments: stats.totalComments || 0,
      totalDownloads: stats.totalDownloads || 0,
      totalArticles: stats.totalArticles || 0,
      totalConcepts: stats.totalConcepts || 0,
      totalInfographics: stats.totalInfographics || 0,
      totalResources: stats.totalResources || 0,
      totalTutorials: stats.totalTutorials || 0,
      totalFavorites: stats.totalFavorites || 0
    };
  } catch (error) {
    return {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalDownloads: 0,
      totalArticles: 0,
      totalConcepts: 0,
      totalInfographics: 0,
      totalResources: 0,
      totalTutorials: 0,
      totalFavorites: 0
    };
  }
};

// دالة للحصول على المحتوى الأكثر مشاهدة
const getTopContent = () => {
  try {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const concepts = JSON.parse(localStorage.getItem('concepts') || '[]');
    const infographics = JSON.parse(localStorage.getItem('infographics') || '[]');
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const tutorials = JSON.parse(localStorage.getItem('tutorials') || '[]');
    
    const allContent = [
      ...articles.map((item: any) => ({ ...item, type: 'مقال' })),
      ...concepts.map((item: any) => ({ ...item, type: 'مفهوم' })),
      ...infographics.map((item: any) => ({ ...item, type: 'إنفوجرافيك' })),
      ...resources.map((item: any) => ({ ...item, type: 'ملف' })),
      ...tutorials.map((item: any) => ({ ...item, type: 'شرح' }))
    ];
    
    return allContent
      .filter((item: any) => (item.views || 0) > 0)
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  } catch (error) {
    return [];
  }
};

export default function Analytics() {
  const [stats, setStats] = useState(getStatsFromStorage());
  const [topContent, setTopContent] = useState(getTopContent());
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    // تحديث الإحصائيات عند تحميل المكون
    setStats(getStatsFromStorage());
    setTopContent(getTopContent());
  }, []);

  const handleResetStats = () => {
    try {
      resetAllStats();
      setStats(getStatsFromStorage());
      setTopContent(getTopContent());
      setIsReset(true);
      toast.success("تم تصفير جميع الإحصائيات بنجاح - بدء الرصد من الآن");
      
      // إعادة تعيين حالة التصفير بعد 3 ثوان
      setTimeout(() => setIsReset(false), 3000);
    } catch (error) {
      toast.error("حدث خطأ أثناء تصفير الإحصائيات");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الإحصائيات والتحليلات</h1>
          <p className="text-muted-foreground">تتبع أداء المحتوى وتفاعل الزوار</p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isReset}>
              <RefreshCw className="w-4 h-4 ml-2" />
              {isReset ? "تم التصفير" : "تصفير الإحصائيات"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد تصفير الإحصائيات</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من تصفير جميع الإحصائيات؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetStats}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                تصفير
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalViews || 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              بدء الرصد من {isReset ? 'الآن' : 'قبل التصفير'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإعجابات</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalLikes || 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              بدء الرصد من {isReset ? 'الآن' : 'قبل التصفير'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التعليقات</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalComments || 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              بدء الرصد من {isReset ? 'الآن' : 'قبل التصفير'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التحميلات</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalDownloads || 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              بدء الرصد من {isReset ? 'الآن' : 'قبل التصفير'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات المحتوى */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المقالات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <div className="text-xs text-muted-foreground">إجمالي المقالات</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المفاهيم</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConcepts}</div>
            <div className="text-xs text-muted-foreground">إجمالي المفاهيم</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإنفوجرافيك</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInfographics}</div>
            <div className="text-xs text-muted-foreground">إجمالي الإنفوجرافيك</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموارد</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResources}</div>
            <div className="text-xs text-muted-foreground">إجمالي الموارد</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الدروس</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTutorials}</div>
            <div className="text-xs text-muted-foreground">إجمالي الدروس</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <Card>
          <CardHeader>
            <CardTitle>المحتوى الأكثر شعبية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.length > 0 ? (
                topContent.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.title || item.name}</div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                        <span>👁️ {item.views || 0}</span>
                        <span>❤️ {item.likes || 0}</span>
                        {(item.comments || 0) > 0 && <span>💬 {item.comments}</span>}
                        {(item.downloads || 0) > 0 && <span>📥 {item.downloads}</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لا توجد إحصائيات بعد</p>
                  <p className="text-sm">ستظهر هنا بعد بدء تفاعل المستخدمين</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories Performance */}
        <Card>
          <CardHeader>
            <CardTitle>أداء الفئات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.totalViews > 0 ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">المقالات</span>
                      <span className="text-muted-foreground">
                        {(() => {
                          const articles = JSON.parse(localStorage.getItem('articles') || '[]');
                          const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0);
                          return totalViews.toLocaleString();
                        })()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${stats.totalViews > 0 ? ((() => {
                            const articles = JSON.parse(localStorage.getItem('articles') || '[]');
                            const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0);
                            return (totalViews / stats.totalViews) * 100;
                          })()) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">المفاهيم</span>
                      <span className="text-muted-foreground">
                        {(() => {
                          const concepts = JSON.parse(localStorage.getItem('concepts') || '[]');
                          const totalViews = concepts.reduce((sum: number, concept: any) => sum + (concept.views || 0), 0);
                          return totalViews.toLocaleString();
                        })()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${stats.totalViews > 0 ? ((() => {
                            const concepts = JSON.parse(localStorage.getItem('concepts') || '[]');
                            const totalViews = concepts.reduce((sum: number, concept: any) => sum + (concept.views || 0), 0);
                            return (totalViews / stats.totalViews) * 100;
                          })()) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">الإنفوجرافيك</span>
                      <span className="text-muted-foreground">
                        {(() => {
                          const infographics = JSON.parse(localStorage.getItem('infographics') || '[]');
                          const totalViews = infographics.reduce((sum: number, infographic: any) => sum + (infographic.views || 0), 0);
                          return totalViews.toLocaleString();
                        })()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${stats.totalViews > 0 ? ((() => {
                            const infographics = JSON.parse(localStorage.getItem('infographics') || '[]');
                            const totalViews = infographics.reduce((sum: number, infographic: any) => sum + (infographic.views || 0), 0);
                            return (totalViews / stats.totalViews) * 100;
                          })()) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لا توجد إحصائيات مشاهدات بعد</p>
                  <p className="text-sm">ستظهر هنا بعد بدء تفاعل المستخدمين</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.totalViews > 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>سيظهر هنا النشاط الأخير بعد بدء تفاعل المستخدمين</p>
                <p className="text-sm">مثل المشاهدات والإعجابات والتعليقات</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>لا يوجد نشاط بعد</p>
                <p className="text-sm">ستظهر هنا الأنشطة بعد بدء تفاعل المستخدمين</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>تصدير التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير CSV
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 ml-2" />
              تقرير شامل
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 ml-2" />
              عرض مفصل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}