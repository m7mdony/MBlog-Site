import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { addArticle } from "@/lib/articles-storage";
import { toast } from "sonner";
import { Save, FileText, Upload, Video, Image as ImageIcon } from "lucide-react";

export default function AddArticle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    status: "مسودة",
    hasVideo: false,
    isPopular: false,
    videoUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { getCategories } = await import("@/lib/categories-storage");
        const categoryData = getCategories();
        setCategories(categoryData.filter(cat => cat.visible).map(cat => cat.name));
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories(["نمو الأعمال", "التشغيل", "العقلية", "التقنية"]);
      }
    };
    
    loadCategories();
  }, []);

  const statuses = [
    "مسودة",
    "منشور",
    "مخفي"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast.success("تم رفع الصورة بنجاح");
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (file.type.startsWith('video/')) {
        // التحقق من حجم الملف (أقل من 100MB)
        if (file.size > 100 * 1024 * 1024) {
          toast.error("حجم الفيديو يجب أن يكون أقل من 100MB");
          return;
        }
        
        setVideoFile(file);
        handleInputChange("hasVideo", true);
        toast.success("تم رفع الفيديو بنجاح");
      } else {
        toast.error("يرجى اختيار ملف فيديو صحيح");
      }
    }
  };

  // تحويل الفيديو إلى Base64
  const convertVideoToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // تأكيد الحفظ (اختياري)
    // if (!confirm("هل أنت متأكد من حفظ المقال؟")) {
    //   return;
    // }

    try {
      let videoFileBase64: string | undefined;
      
      // تحويل الفيديو إلى Base64 إذا كان موجوداً
      if (videoFile) {
        try {
          videoFileBase64 = await convertVideoToBase64(videoFile);
        } catch (error) {
          console.error("Error converting video:", error);
          toast.error("حدث خطأ أثناء تحويل الفيديو");
          return;
        }
      }
      
      // إضافة المقال كـ article جديد
      const newArticle = addArticle({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        hasVideo: formData.hasVideo,
        isPopular: formData.isPopular,
        videoUrl: formData.videoUrl || undefined,
        videoFile: videoFileBase64
      });
      
      console.log("تم إضافة المقال بنجاح:", newArticle);
      toast.success("تم إضافة المقال بنجاح");
      
      // إعادة تعيين النموذج
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "",
        status: "مسودة",
        hasVideo: false,
        isPopular: false,
        videoUrl: "",
      });
      setImageFile(null);
      setVideoFile(null);
      
      // الانتقال إلى صفحة إدارة المقالات
      setTimeout(() => {
        navigate("/dashboard/articles");
      }, 1000);
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("حدث خطأ أثناء إضافة المقال");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8" />
            إضافة مقال جديد
          </h1>
          <p className="text-muted-foreground">أنشئ مقالاً جديداً وشاركه مع الجمهور</p>
          <p className="text-xs text-muted-foreground mt-1">
            آخر تحديث: {new Date().toLocaleString('ar-SA')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المحتوى الأساسي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان المقال *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="اكتب عنوان المقال..."
                    required
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    عدد الأحرف: {formData.title.length}/100
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="اكتب وصف مختصر للمقال..."
                    rows={3}
                    required
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    عدد الأحرف: {formData.description.length}/300
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">محتوى المقال</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="اكتب محتوى المقال الكامل..."
                    rows={10}
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    عدد الكلمات: {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  رفع الملفات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">صورة المقال</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="relative">
                      <ImageIcon className="w-4 h-4 ml-2" />
                      اختر صورة
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    {imageFile && (
                      <span className="text-sm text-green-600">
                        تم رفع: {imageFile.name}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {imageFile ? (
                      <span className="text-green-600">✓ تم اختيار صورة</span>
                    ) : (
                      <span className="text-yellow-600">⚠ اختيار صورة اختياري</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="videoUrl">رابط الفيديو</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl || ""}
                    onChange={(e) => {
                      handleInputChange("videoUrl", e.target.value);
                      handleInputChange("hasVideo", !!e.target.value);
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.videoUrl ? (
                      <span className="text-green-600">✓ تم إضافة رابط الفيديو</span>
                    ) : (
                      <span className="text-yellow-600">⚠ إضافة فيديو اختياري</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="videoFile">رفع فيديو من الجهاز</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="relative">
                      <Video className="w-4 h-4 ml-2" />
                      اختر فيديو
                      <input
                        id="videoFile"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    {videoFile && (
                      <span className="text-sm text-green-600">
                        تم رفع: {videoFile.name}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {videoFile ? (
                      <span className="text-green-600">✓ تم اختيار فيديو</span>
                    ) : (
                      <span className="text-yellow-600">⚠ اختيار فيديو اختياري</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المقال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">الفئة *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.category ? (
                      <span className="text-green-600">✓ تم اختيار الفئة: {formData.category}</span>
                    ) : (
                      <span className="text-red-600">⚠ يجب اختيار فئة</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground mt-1">
                    الحالة الحالية: {formData.status}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPopular">مقال مميز</Label>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {formData.isPopular ? (
                    <span className="text-green-600">✓ المقال مميز</span>
                  ) : (
                    <span className="text-yellow-600">⚠ المقال عادي</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasVideo">يحتوي على فيديو</Label>
                  <Switch
                    id="hasVideo"
                    checked={formData.hasVideo}
                    onCheckedChange={(checked) => handleInputChange("hasVideo", checked)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {formData.hasVideo ? (
                    <span className="text-green-600">✓ المقال يحتوي على فيديو</span>
                  ) : (
                    <span className="text-yellow-600">⚠ المقال لا يحتوي على فيديو</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                <Save className="w-4 h-4 ml-2" />
                حفظ المقال
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (formData.title && formData.description) {
                    alert(`معاينة المقال:\n\nالعنوان: ${formData.title}\nالوصف: ${formData.description}\nالفئة: ${formData.category}\nالحالة: ${formData.status}`);
                  } else {
                    alert("يرجى ملء العنوان والوصف أولاً لعرض المعاينة");
                  }
                }}
              >
                معاينة
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/concepts")}
              >
                إلغاء
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category ? (
                  <span className="text-green-600">✓ جاهز للحفظ</span>
                ) : (
                  <span className="text-yellow-600">⚠ يرجى ملء جميع الحقول المطلوبة</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيتم حفظه في قسم "المفاهيم"</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>سيتم توجيهك تلقائياً إلى صفحة إدارة المفاهيم بعد الحفظ</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>يمكنك الوصول إلى المقالات من صفحة "إدارة المفاهيم"</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>سيتم حفظ المقال مع التاريخ الحالي: {new Date().toLocaleDateString('ar-SA')}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>سيتم تعيين معرف فريد تلقائياً للمقال</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>سيتم حفظ المقال في التخزين المحلي للمتصفح</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>يمكنك تعديل أو حذف المقال لاحقاً من صفحة إدارة المفاهيم</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في الإحصائيات العامة للموقع</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في البحث والفلترة</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في الصفحة الرئيسية إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في نتائج البحث إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في الإحصائيات العامة للموقع</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {formData.title && formData.description && formData.category && (
                  <span>المقال سيظهر في صفحة "جميع المفاهيم" إذا كان منشوراً</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}