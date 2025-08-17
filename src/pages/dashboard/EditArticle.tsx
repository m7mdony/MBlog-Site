import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getConcepts, updateConcept } from "@/lib/storage";
import { toast } from "sonner";
import { Save, FileText, Upload, Image as ImageIcon } from "lucide-react";

export default function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load categories
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
    
    // Load article data
    if (id) {
      const concepts = getConcepts();
      const concept = concepts.find(c => c.id === parseInt(id));
      if (concept) {
        setFormData({
          title: concept.title,
          description: concept.description,
          content: concept.content || "",
          category: concept.category,
          status: concept.status,
          hasVideo: concept.hasVideo || false,
          isPopular: concept.isPopular || false,
          videoUrl: concept.videoUrl || "",
        });
      }
    }
    
    loadCategories();
  }, [id]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!id) {
      toast.error("معرف المقال غير صحيح");
      return;
    }

    try {
      updateConcept(parseInt(id), formData);
      toast.success("تم تحديث المقال بنجاح");
      navigate("/dashboard/articles-management");
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("حدث خطأ أثناء تحديث المقال");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8" />
            تحرير المقال
          </h1>
          <p className="text-muted-foreground">تحديث وتعديل المقال</p>
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
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPopular">مقال مميز</Label>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasVideo">يحتوي على فيديو</Label>
                  <Switch
                    id="hasVideo"
                    checked={formData.hasVideo}
                    onCheckedChange={(checked) => handleInputChange("hasVideo", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/articles-management")}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}