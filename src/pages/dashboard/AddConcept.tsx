import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addConcept } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Upload,
  FileText,
  Image,
  Link as LinkIcon,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddConcept() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    status: "مسودة",
    hasVideo: false,
    isPopular: false
  });

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان المفهوم",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الفئة",
        variant: "destructive",
      });
      return;
    }

    try {
      addConcept({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        hasVideo: formData.hasVideo,
        isPopular: formData.isPopular,
      });

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إضافة المفهوم الجديد",
      });

      // Navigate back to concepts list
      navigate("/dashboard/concepts");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المفهوم",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">إضافة مفهوم جديد</h1>
        <p className="text-muted-foreground">إنشاء مفهوم أو مقال جديد ونشره في الموقع</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="اكتب عنوان المفهوم..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">الوصف المختصر</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف مختصر للمفهوم..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نمو الأعمال">نمو الأعمال</SelectItem>
                    <SelectItem value="التشغيل">التشغيل</SelectItem>
                    <SelectItem value="العقلية">العقلية</SelectItem>
                    <SelectItem value="التقنية">التقنية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المحتوى</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">المحتوى الكامل</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="اكتب المحتوى الكامل للمفهوم..."
                  rows={15}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  يمكنك استخدام Markdown للتنسيق
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4 ml-2" />
                  إضافة صورة
                </Button>
                <Button variant="outline" size="sm">
                  <LinkIcon className="w-4 h-4 ml-2" />
                  إضافة رابط
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 ml-2" />
                  إضافة ملف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النشر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">حالة النشر</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مسودة">مسودة</SelectItem>
                    <SelectItem value="منشور">منشور</SelectItem>
                    <SelectItem value="مخفي">مخفي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasVideo"
                  checked={formData.hasVideo}
                  onChange={(e) => setFormData({...formData, hasVideo: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="hasVideo">يحتوي على فيديو</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isPopular">مفهوم مميز</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معاينة</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 ml-2" />
                معاينة المفهوم
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ المفهوم
              </Button>
              <Button variant="outline" className="w-full">
                حفظ كمسودة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}