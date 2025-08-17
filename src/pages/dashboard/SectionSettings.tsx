
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Save } from "lucide-react";
import { getSettings, setSettings, type SectionSettings } from "@/lib/settings-storage";
import { toast } from "sonner";

export default function SectionSettings() {
  const [settings, updateSettings] = useState<SectionSettings>(getSettings());

  useEffect(() => {
    updateSettings(getSettings());
  }, []);

  const handleToggle = (key: keyof SectionSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    updateSettings(newSettings);
    setSettings(newSettings);
    toast.success("تم تحديث الإعدادات");
  };

  const sections = [
    { key: 'showHero' as const, label: 'القسم الرئيسي (Hero)', description: 'عرض القسم الترحيبي الرئيسي' },
    { key: 'showLatestConcept' as const, label: 'آخر مفهوم', description: 'عرض آخر مفهوم تم إضافته' },
    { key: 'showConcepts' as const, label: 'المفاهيم', description: 'عرض قسم المفاهيم' },
    { key: 'showTutorials' as const, label: 'الدورات', description: 'عرض قسم الدورات التعليمية' },
    { key: 'showResources' as const, label: 'الموارد', description: 'عرض قسم الموارد والملفات' },
    { key: 'showFavorites' as const, label: 'المفضلة', description: 'عرض قسم الروابط المفضلة' },
    { key: 'showStats' as const, label: 'الإحصائيات', description: 'عرض قسم الإحصائيات' },
    { key: 'showCTA' as const, label: 'دعوة للعمل', description: 'عرض قسم الدعوة للعمل' },
    { key: 'showCertifications' as const, label: 'الشهادات', description: 'عرض قسم الشهادات' },
    { key: 'hideEngagementStats' as const, label: 'إخفاء إحصائيات التفاعل', description: 'إخفاء أرقام المشاهدات والإعجابات في البطاقات' },
    { key: 'showEngagementInArticles' as const, label: 'أزرار التفاعل في المقالات', description: 'عرض أزرار الإعجاب والمشاركة والتعليق داخل المقالات' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Eye className="w-8 h-8" />
          إعدادات الأقسام
        </h1>
        <p className="text-muted-foreground">تحكم في ظهور وإخفاء أقسام الموقع</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أقسام الصفحة الرئيسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section) => (
            <div key={section.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor={section.key} className="text-base font-medium">
                  {section.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <Switch
                id={section.key}
                checked={settings[section.key]}
                onCheckedChange={(checked) => handleToggle(section.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("تم حفظ جميع الإعدادات")}>
          <Save className="w-4 h-4 ml-2" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
}
