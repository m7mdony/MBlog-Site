import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, ArrowLeft } from "lucide-react";
import { getInfographics, updateInfographic, type Infographic } from "@/lib/infographics-storage";
import { getCategories, type Category } from "@/lib/categories-storage";
import { useToast } from "@/components/ui/use-toast";

export default function EditInfographic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    imageUrl: "",
    thumbnailUrl: ""
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/dashboard/infographics");
      return;
    }

    const infographics = getInfographics();
    const infographic = infographics.find(item => item.id === parseInt(id));
    
    if (!infographic) {
      toast({
        title: "خطأ",
        description: "الإنفوجرافيك غير موجود",
        variant: "destructive"
      });
      navigate("/dashboard/infographics");
      return;
    }

    setFormData({
      title: infographic.title,
      description: infographic.description,
      category: infographic.category,
      tags: infographic.tags,
      imageUrl: infographic.imageUrl,
      thumbnailUrl: infographic.thumbnailUrl
    });
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  useEffect(() => {
    const loadCategories = () => {
      const allCategories = getCategories();
      // ترتيب الفلاتر حسب الترتيب المحفوظ
      const sortedCategories = [...allCategories].sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    loadCategories();

    const handleCategoriesUpdate = () => loadCategories();
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          imageUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          thumbnailUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl) {
      toast({
        title: "خطأ",
        description: "يرجى ملء العنوان ورفع الصورة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صحة البيانات
    if (formData.title.length < 3) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون العنوان 3 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    if (formData.description && formData.description.length < 10) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون الوصف 10 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار تصنيف للإنفوجرافيك",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('✏️ Updating infographic', id, 'with data:', formData);
      
      updateInfographic(parseInt(id!), {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        thumbnailUrl: formData.thumbnailUrl || formData.imageUrl,
        category: formData.category,
        tags: formData.tags.filter(tag => tag.trim().length > 0)
      });

      console.log('✅ Infographic updated successfully');

      toast({
        title: "تم التحديث",
        description: "تم تحديث الإنفوجرافيك بنجاح",
      });
      
      navigate("/dashboard/infographics");
    } catch (error) {
      console.error('❌ Error updating infographic:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الإنفوجرافيك",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dashboard/infographics")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة لإدارة الإنفوجرافيكات
        </Button>
        
        <h1 className="text-2xl font-bold text-foreground">تعديل الإنفوجرافيك</h1>
        <p className="text-muted-foreground">تعديل بيانات الإنفوجرافيك</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الإنفوجرافيك</CardTitle>
            <CardDescription>تعديل تفاصيل الإنفوجرافيك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان الإنفوجرافيك"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للإنفوجرافيك"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">التصنيف</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} value={formData.category} defaultValue="عام">
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر تصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">الوسوم</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="اكتب وسماً واضغط Enter"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>صورة الإنفوجرافيك</CardTitle>
            <CardDescription>تحديث صورة الإنفوجرافيك الكاملة (PNG, JPG, SVG)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {formData.imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={formData.imageUrl}
                      alt="معاينة الإنفوجرافيك الكامل"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <div className="flex gap-2 justify-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, imageUrl: "" }));
                          setImageFile(null);
                        }}
                      >
                        إزالة الصورة
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        اسحب وأفلت صورة الإنفوجرافيك الكاملة هنا أو انقر للاختيار
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الصورة المصغرة</CardTitle>
            <CardDescription>تحديث الصورة المصغرة للعرض في البطاقات والمعاينة (PNG, JPG, SVG)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {formData.thumbnailUrl ? (
                  <div className="space-y-4">
                    <img
                      src={formData.thumbnailUrl}
                      alt="معاينة الصورة المصغرة"
                      className="max-w-full max-h-32 mx-auto rounded-lg"
                    />
                    <div className="flex gap-2 justify-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, thumbnailUrl: "" }));
                          setThumbnailFile(null);
                        }}
                      >
                        إزالة الصورة المصغرة
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        اسحب وأفلت الصورة المصغرة هنا أو انقر للاختيار
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ الصورة المصغرة ستستخدم في البطاقات والمعاينة، بينما الصورة الكاملة ستكون متاحة للتحميل فقط
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "جاري التحديث..." : "تحديث الإنفوجرافيك"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/dashboard/infographics")}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}