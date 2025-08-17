import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Upload,
  Play,
  Clock,
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

export default function AddTutorial() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    duration: "",
    videoUrl: "",
    category: "",
    status: "مسودة",
    hasDownload: false
  });

  const handleSave = () => {
    console.log("Saving tutorial:", formData);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">إضافة شرح جديد</h1>
        <p className="text-muted-foreground">إنشاء شرح فيديو جديد ونشره في الموقع</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الشرح</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الشرح</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="مثال: Notion - نظرة سريعة وشاملة"
                />
              </div>
              
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف مختصر للشرح..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">مدة الفيديو</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="12:30"
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أدوات الإنتاجية">أدوات الإنتاجية</SelectItem>
                      <SelectItem value="التصميم">التصميم</SelectItem>
                      <SelectItem value="البرمجة">البرمجة</SelectItem>
                      <SelectItem value="إدارة المشاريع">إدارة المشاريع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="videoUrl">رابط الفيديو</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>محتوى الشرح</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">الوصف التفصيلي</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="اكتب الوصف التفصيلي للشرح..."
                  rows={15}
                  className="font-mono"
                />
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4 ml-2" />
                  إضافة صورة مصغرة
                </Button>
                <Button variant="outline" size="sm">
                  <LinkIcon className="w-4 h-4 ml-2" />
                  إضافة رابط
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 ml-2" />
                  إضافة ملفات مرفقة
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
                  id="hasDownload"
                  checked={formData.hasDownload}
                  onChange={(e) => setFormData({...formData, hasDownload: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="hasDownload">يحتوي على ملفات للتحميل</Label>
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
                معاينة الشرح
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-secondary to-secondary/80">
                <Save className="w-4 h-4 ml-2" />
                حفظ الشرح
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