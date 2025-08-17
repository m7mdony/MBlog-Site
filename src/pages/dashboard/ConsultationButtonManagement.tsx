import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsultationButtonConfig {
  text: string;
  url: string;
  isEnabled: boolean;
}

export default function ConsultationButtonManagement() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConsultationButtonConfig>({
    text: "احجز استشارتك",
    url: "",
    isEnabled: true
  });

  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    const savedConfig = localStorage.getItem('consultationButtonConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing consultation button config:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('consultationButtonConfig', JSON.stringify(config));
      
      // إرسال إشعار للمكونات الأخرى
      window.dispatchEvent(new CustomEvent('consultationButtonUpdated'));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعدادات زر الاستشارة",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إدارة زر الاستشارة</h1>
        <p className="text-muted-foreground">تخصيص زر "احجز استشارتك" في قسم طرق التواصل</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الإعدادات */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الزر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">تفعيل الزر</Label>
              <Switch
                id="enabled"
                checked={config.isEnabled}
                onCheckedChange={(checked) => setConfig({...config, isEnabled: checked})}
              />
            </div>
            
            <div>
              <Label htmlFor="text">نص الزر</Label>
              <Input
                id="text"
                value={config.text}
                onChange={(e) => setConfig({...config, text: e.target.value})}
                placeholder="مثل: احجز استشارتك، تواصل الآن..."
              />
            </div>
            
            <div>
              <Label htmlFor="url">الرابط</Label>
              <Input
                id="url"
                value={config.url}
                onChange={(e) => setConfig({...config, url: e.target.value})}
                placeholder="مثل: https://calendly.com/your-link أو mailto:email@example.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك استخدام رابط تقويم، نموذج حجز، واتساب، أو بريد إلكتروني
              </p>
            </div>

            <div className="space-y-2">
              <Label>أمثلة للروابط:</Label>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• تقويم: https://calendly.com/your-username</p>
                <p>• واتساب: https://wa.me/966501234567</p>
                <p>• بريد: mailto:mariam@example.com</p>
                <p>• نموذج: https://forms.google.com/...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* المعاينة */}
        <Card>
          <CardHeader>
            <CardTitle>معاينة الزر</CardTitle>
          </CardHeader>
          <CardContent>
            {config.isEnabled ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">كيف سيظهر الزر:</p>
                <Button
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group w-full"
                  disabled={!config.url || config.url === "#"}
                >
                  <Calendar className="w-5 h-5" />
                  <div className="text-right">
                    <p className="font-medium">
                      {config.text || "احجز استشارتك"}
                    </p>
                    <p className="text-sm opacity-80">تواصل معي</p>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </Button>
                
                {(!config.url || config.url === "#") && (
                  <p className="text-xs text-orange-600">
                    ⚠️ يجب إضافة رابط صحيح لتفعيل الزر
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>الزر معطل حالياً</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* زر الحفظ */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="w-4 h-4 ml-2" />
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}