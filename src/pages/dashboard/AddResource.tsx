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
  Download,
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

export default function AddResource() {
  const [formData, setFormData] = useState({
    fileName: "",
    description: "",
    content: "",
    fileType: "",
    fileSize: "",
    category: "",
    status: "مسودة",
    hasPreview: false
  });

  const handleSave = () => {
    console.log("Saving resource:", formData);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">إضافة ملف جديد</h1>
        <p className="text-muted-foreground">إضافة ملف أو مصدر جديد للموقع</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fileName">اسم الملف</Label>
                <Input
                  id="fileName"
                  value={formData.fileName}
                  onChange={(e) => setFormData({...formData, fileName: e.target.value})}
                  placeholder="مثال: قالب تقييم أفكار المشاريع"
                />
              </div>
              
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف مختصر للملف..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fileType">نوع الملف</Label>
                  <Select value={formData.fileType} onValueChange={(value) => setFormData({...formData, fileType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="Notion">Notion</SelectItem>
                      <SelectItem value="Word">Word</SelectItem>
                      <SelectItem value="PowerPoint">PowerPoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fileSize">حجم الملف</Label>
                  <Input
                    id="fileSize"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({...formData, fileSize: e.target.value})}
                    placeholder="2.5 MB"
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="قوالب">قوالب</SelectItem>
                      <SelectItem value="أدوات">أدوات</SelectItem>
                      <SelectItem value="أدلة">أدلة</SelectItem>
                      <SelectItem value="نماذج">نماذج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>رفع الملف</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">اسحب الملف هنا أو اضغط للاختيار</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    اختيار ملف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>وصف المحتوى</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">الوصف التفصيلي</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="اكتب وصف تفصيلي للملف ومحتوياته..."
                  rows={15}
                  className="font-mono"
                />
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
                  id="hasPreview"
                  checked={formData.hasPreview}
                  onChange={(e) => setFormData({...formData, hasPreview: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="hasPreview">يحتوي على معاينة</Label>
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
                معاينة الملف
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-accent to-accent/80">
                <Save className="w-4 h-4 ml-2" />
                حفظ الملف
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