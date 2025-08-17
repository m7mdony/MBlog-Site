import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle,
  Calendar,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { getArticles, deleteArticle, updateArticle, clearArticlesCacheAndReload, forceRefreshArticlesData, testStorage, type Article } from "@/lib/articles-storage";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    setArticles(getArticles()); // عرض جميع المقالات
    
    // استماع لتحديثات البيانات
    const handleArticlesUpdate = () => {
      setArticles(getArticles()); // عرض جميع المقالات
    };
    
    window.addEventListener('articlesUpdated', handleArticlesUpdate);
    
    return () => {
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(articles.map(a => a.category))];
  const statuses = ["مسودة", "منشور", "مخفي"];

  const handleDelete = (id: number) => {
    try {
      deleteArticle(id);
      setArticles(getArticles());
      toast.success("تم حذف المقال بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    try {
      updateArticle(id, { status: newStatus });
      setArticles(getArticles());
      toast.success("تم تحديث حالة المقال");
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "منشور": return "default";
      case "مسودة": return "secondary";
      case "مخفي": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8" />
            إدارة المقالات
          </h1>
          <p className="text-muted-foreground">إدارة وتحرير المقالات والمحتوى</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              forceRefreshArticlesData();
              setArticles(getArticles()); // عرض جميع المقالات
              toast.success("تم تحديث البيانات");
            }}
          >
            تحديث البيانات
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              clearArticlesCacheAndReload();
              setArticles(getArticles()); // عرض جميع المقالات
              toast.success("تم مسح الكاش وإعادة تحميل البيانات");
            }}
          >
            مسح الكاش
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const isWorking = testStorage();
              if (isWorking) {
                toast.success("التخزين يعمل بشكل صحيح");
              } else {
                toast.error("مشكلة في التخزين");
              }
            }}
          >
            اختبار التخزين
          </Button>
          <Button asChild>
            <Link to="/dashboard/add-article">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مقال جديد
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              المجموع: {filteredArticles.length} مقال
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="grid gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(article.status)} className="mr-4">
                      {article.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.createdAt}
                    </div>
                    <Badge variant="outline">{article.category}</Badge>
                    {article.hasVideo && (
                      <Badge variant="secondary">يحتوي على فيديو</Badge>
                    )}
                    {article.isPopular && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        مميز
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {article.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {article.comments}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Select 
                    value={article.status} 
                    onValueChange={(value) => handleStatusChange(article.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/dashboard/edit-article/${article.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/article/${article.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف المقال</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(article.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredArticles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                لا توجد مقالات
              </h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على أي مقالات تطابق معايير البحث
              </p>
              <Button asChild>
                <Link to="/dashboard/add-article">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مقال جديد
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}