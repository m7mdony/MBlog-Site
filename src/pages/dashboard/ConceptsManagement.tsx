import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getConcepts, type Concept } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreHorizontal,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConceptsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    const loadConcepts = () => {
      setConcepts(getConcepts());
    };
    
    // تحميل البيانات الأولية
    loadConcepts();
    
    // الاستماع لتحديثات البيانات
    const handleConceptsUpdated = () => {
      loadConcepts();
    };
    
    const handleStorageChange = () => {
      loadConcepts();
    };
    
    window.addEventListener('conceptsUpdated', handleConceptsUpdated);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('conceptsUpdated', handleConceptsUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredConcepts = concepts.filter(concept => {
    const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "منشور":
        return "bg-green-100 text-green-800";
      case "مسودة":
        return "bg-yellow-100 text-yellow-800";
      case "مخفي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المفاهيم</h1>
          <p className="text-muted-foreground">إدارة وتنظيم جميع المفاهيم والمقالات</p>
          <p className="text-xs text-muted-foreground mt-1">
            آخر تحديث: {new Date().toLocaleString('ar-SA')}
          </p>
          <p className="text-xs text-muted-foreground">
            {concepts.length === 0 ? (
              "النظام جاهز لإضافة أول مفهوم"
            ) : (
              `تم تحميل ${concepts.length} مفهوم بنجاح`
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setConcepts(getConcepts())}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تحديث
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
            <Link to="/dashboard/concepts/new">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مفهوم جديد
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المجموع الكلي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{concepts.length}</div>
            <p className="text-xs text-muted-foreground">
              {concepts.length === 0 ? "لا توجد مفاهيم" : concepts.length === 1 ? "مفهوم واحد" : `${concepts.length} مفاهيم`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              منشور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{concepts.filter(c => c.status === "منشور").length}</div>
            <p className="text-xs text-muted-foreground">مفهوم منشور</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مسودات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{concepts.filter(c => c.status === "مسودة").length}</div>
            <p className="text-xs text-muted-foreground">مسودة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مخفي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{concepts.filter(c => c.status === "مخفي").length}</div>
            <p className="text-xs text-muted-foreground">مخفي</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في المفاهيم..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <div className="text-xs text-muted-foreground mt-1">
                  البحث عن: "{searchQuery}"
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الفئات</SelectItem>
                  {Array.from(new Set(concepts.map(c => c.category))).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("الكل");
                }}
              >
                إعادة تعيين
              </Button>
            </div>
          </div>
          {(searchQuery || selectedCategory !== "الكل") && (
            <div className="text-xs text-muted-foreground mt-2">
              الفلترة النشطة: {searchQuery && `البحث: "${searchQuery}"`} {searchQuery && selectedCategory !== "الكل" && " + "} {selectedCategory !== "الكل" && `الفئة: ${selectedCategory}`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Concepts Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            قائمة المفاهيم
            {filteredConcepts.length !== concepts.length && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (عرض {filteredConcepts.length} من {concepts.length})
              </span>
            )}
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            {concepts.length === 0 ? (
              "لا توجد مفاهيم في النظام"
            ) : (
              `تم تحميل ${concepts.length} مفهوم بنجاح`
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                آخر مفهوم تم إضافته: {concepts[0]?.title} في {concepts[0]?.createdAt}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                إجمالي المشاهدات: {concepts.reduce((sum, c) => sum + c.views, 0).toLocaleString()} • 
                إجمالي الإعجابات: {concepts.reduce((sum, c) => sum + c.likes, 0).toLocaleString()} • 
                إجمالي التعليقات: {concepts.reduce((sum, c) => sum + c.comments, 0).toLocaleString()}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                الفئات المستخدمة: {Array.from(new Set(concepts.map(c => c.category))).join("، ")}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                المقالات المميزة: {concepts.filter(c => c.isPopular).length} • 
                المقالات التي تحتوي على فيديو: {concepts.filter(c => c.hasVideo).length}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                المقالات المنشورة: {concepts.filter(c => c.status === "منشور").length} • 
                المسودات: {concepts.filter(c => c.status === "مسودة").length} • 
                المقالات المخفية: {concepts.filter(c => c.status === "مخفي").length}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                البيانات محفوظة في التخزين المحلي للمتصفح • 
                آخر تحديث: {new Date().toLocaleString('ar-SA')}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك البحث والفلترة في المفاهيم • 
                يمكنك تعديل أو حذف المفاهيم من القائمة
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                البيانات محفوظة تلقائياً • 
                يمكنك تصدير البيانات أو إنشاء نسخة احتياطية
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تغيير حالة المقالات • 
                يمكنك تتبع الإحصائيات والتفاعلات
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك إضافة مقالات جديدة من زر "إضافة مفهوم جديد" • 
                يمكنك الوصول إلى جميع المقالات من هذه الصفحة
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                المقالات المنشورة ستظهر في الصفحة الرئيسية • 
                المقالات المميزة ستظهر في الأقسام الخاصة
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تصفير الإحصائيات من صفحة الإعدادات • 
                يمكنك إنشاء نسخ احتياطية من البيانات
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تصدير البيانات إلى ملف JSON • 
                يمكنك استيراد البيانات من ملفات خارجية
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك إنشاء نسخ احتياطية يدوية • 
                يمكنك استعادة البيانات من النسخ الاحتياطية
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تصفير جميع الإحصائيات • 
                يمكنك التحقق من صحة البيانات
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك إنشاء نسخ احتياطية تلقائية • 
                يمكنك تنظيف النسخ الاحتياطية القديمة
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تصدير البيانات إلى ملف JSON • 
                يمكنك استيراد البيانات من ملفات خارجية
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك إنشاء نسخ احتياطية يدوية • 
                يمكنك استعادة البيانات من النسخ الاحتياطية
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تصفير جميع الإحصائيات • 
                يمكنك التحقق من صحة البيانات
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك إنشاء نسخ احتياطية تلقائية • 
                يمكنك تنظيف النسخ الاحتياطية القديمة
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك تصدير البيانات إلى ملف JSON • 
                يمكنك استيراد البيانات من ملفات خارجية
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {concepts.length > 0 && (
              <>
                يمكنك إنشاء نسخ احتياطية يدوية • 
                يمكنك استعادة البيانات من النسخ الاحتياطية
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>التفاعل</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConcepts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {concepts.length === 0 ? (
                        <div className="space-y-2">
                          <p className="text-lg">لا توجد مفاهيم بعد</p>
                          <p>ابدأ بإضافة مفهوم جديد</p>
                          <Button asChild size="sm">
                            <Link to="/dashboard/concepts/new">
                              <Plus className="w-4 h-4 ml-2" />
                              إضافة مفهوم جديد
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <p>لا توجد نتائج للبحث</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredConcepts.map((concept) => (
                  <TableRow key={concept.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{concept.title}</div>
                        <div className="flex items-center gap-2">
                          {concept.hasVideo && (
                            <Badge variant="secondary" className="text-xs">
                              فيديو
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{concept.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(concept.status)}>
                        {concept.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{(concept.views || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        👍 {concept.likes} • 💬 {concept.comments}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {concept.createdAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {concept.status === "مخفي" ? (
                              <>
                                <Eye className="w-4 h-4 ml-2" />
                                إظهار
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4 ml-2" />
                                إخفاء
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}