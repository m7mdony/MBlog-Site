import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  ExternalLink,
  Globe,
  Star,
  Image,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddFavorite() {
  const [formData, setFormData] = useState({
    siteName: "",
    description: "",
    reason: "",
    content: "",
    url: "",
    category: "",
    status: "مسودة"
  });

  const handleSave = () => {
    console.log("Saving favorite:", formData);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">إضافة رابط مميز</h1>
        <p className="text-muted-foreground">إضافة أداة أو موقع مميز للموقع</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">اسم الموقع/الأداة</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  placeholder="مثال: Linear - أداة إدارة المشاريع"
                />
              </div>
              
              <div>
                <Label htmlFor="url">الرابط</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://linear.app"
                />
              </div>
              
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف مختصر للموقع أو الأداة..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أدوات">أدوات</SelectItem>
                      <SelectItem value="إنتاجية">إنتاجية</SelectItem>
                      <SelectItem value="تصميم">تصميم</SelectItem>
                      <SelectItem value="تطوير">تطوير</SelectItem>
                      <SelectItem value="تسويق">تسويق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reason">سبب الإعجاب</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="واجهة نظيفة وسرعة استثنائية..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المراجعة التفصيلية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">المراجعة الكاملة</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="اكتب مراجعة تفصيلية للموقع أو الأداة..."
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
                  <ExternalLink className="w-4 h-4 ml-2" />
                  اختبار الرابط
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معاينة</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 ml-2" />
                معاينة الرابط
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-primary/80">
                <Save className="w-4 h-4 ml-2" />
                حفظ الرابط
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