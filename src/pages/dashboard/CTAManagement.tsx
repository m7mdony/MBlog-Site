import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Edit, Trash2, Plus, Save, Link as LinkIcon, Bell, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CTAContent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isVisible: boolean;
  order: number;
}

interface CTAFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isVisible: boolean;
  order: number;
}

interface CTAButton {
  id: string;
  text: string;
  url: string;
  style: "primary" | "outline";
  icon: string;
  isVisible: boolean;
  order: number;
}

interface FooterText {
  id: string;
  text: string;
  isVisible: boolean;
}

// مفتاح التخزين
const CTA_STORAGE_KEY = 'mariam_bassitman_cta';

// البيانات الافتراضية
const initialContent: CTAContent = {
  id: "1",
  title: "تابع رحلة النمو والتطوير",
  description: "اكتشف أحدث المفاهيم والأدوات والمصادر التي تساعدك في بناء مشاريعك وتطوير مهاراتك",
  emoji: "🚀",
  isVisible: true,
  order: 1
};

const initialFeatures: CTAFeature[] = [
  {
    id: "1",
    title: "تحديثات دورية",
    description: "أحدث المفاهيم والأدوات المختارة بعناية لتطوير مهاراتك",
    icon: "Bell",
    color: "primary",
    isVisible: true,
    order: 1
  },
  {
    id: "2",
    title: "محتوى حصري",
    description: "أدوات ومفاهيم وقوالب مختارة بعناية لتطوير مشاريعك",
    icon: "Mail",
    color: "secondary",
    isVisible: true,
    order: 2
  }
];

const initialButtons: CTAButton[] = [
  {
    id: "1",
    text: "تابع مشاريعي الجديدة",
    url: "#",
    style: "primary",
    icon: "ArrowRight",
    isVisible: true,
    order: 1
  },
  {
    id: "2",
    text: "اشترك في التحديثات",
    url: "#",
    style: "outline",
    icon: "Mail",
    isVisible: true,
    order: 2
  }
];

const initialFooter: FooterText = {
  id: "1",
  text: "📨 تحديثات أسبوعية • 🎯 محتوى مختار • 🚀 مشاريع جديدة",
  isVisible: true
};

// وظائف التخزين
const getCTAData = () => {
  try {
    const stored = localStorage.getItem(CTA_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // تهيئة البيانات الافتراضية
    const defaultData = {
      content: initialContent,
      features: initialFeatures,
      buttons: initialButtons,
      footer: initialFooter
    };
    return defaultData;
  } catch (error) {
    console.error('Error loading CTA data:', error);
    return {
      content: initialContent,
      features: initialFeatures,
      buttons: initialButtons,
      footer: initialFooter
    };
  }
};

const setCTAData = (data: any): void => {
  try {
    localStorage.setItem(CTA_STORAGE_KEY, JSON.stringify(data));
    // إرسال حدث تحديث
    window.dispatchEvent(new CustomEvent('ctaUpdated', { detail: data }));
  } catch (error) {
    console.error('Error saving CTA data:', error);
  }
};

export default function CTAManagement() {
  const [ctaData, setCTADataState] = useState(getCTAData());
  const [content, setContent] = useState<CTAContent>(ctaData.content);
  const [features, setFeatures] = useState<CTAFeature[]>(ctaData.features);
  const [buttons, setButtons] = useState<CTAButton[]>(ctaData.buttons);
  const [footer, setFooter] = useState<FooterText>(ctaData.footer);
  const [editingContent, setEditingContent] = useState(false);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [editingButton, setEditingButton] = useState<string | null>(null);
  const [editingFooter, setEditingFooter] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    icon: "Bell",
    color: "primary"
  });
  const [newButton, setNewButton] = useState<{
    text: string;
    url: string;
    style: "primary" | "outline";
    icon: string;
  }>({
    text: "",
    url: "",
    style: "primary",
    icon: "ArrowRight"
  });

  // تحديث البيانات عند تغيير ctaData
  useEffect(() => {
    setContent(ctaData.content);
    setFeatures(ctaData.features);
    setButtons(ctaData.buttons);
    setFooter(ctaData.footer);
  }, [ctaData]);

  // استماع لتحديثات البيانات
  useEffect(() => {
    const handleCTAUpdate = () => {
      setCTADataState(getCTAData());
    };
    
    window.addEventListener('ctaUpdated', handleCTAUpdate);
    
    return () => {
      window.removeEventListener('ctaUpdated', handleCTAUpdate);
    };
  }, []);

  // حفظ البيانات في التخزين
  const saveToStorage = () => {
    const data = { content, features, buttons, footer };
    setCTAData(data);
    setCTADataState(data);
  };

  const toggleContentVisibility = () => {
    const newContent = { ...content, isVisible: !content.isVisible };
    setContent(newContent);
    saveToStorage();
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const toggleFeatureVisibility = (id: string) => {
    const newFeatures = features.map(feature => 
      feature.id === id ? { ...feature, isVisible: !feature.isVisible } : feature
    );
    setFeatures(newFeatures);
    saveToStorage();
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const toggleButtonVisibility = (id: string) => {
    const newButtons = buttons.map(button => 
      button.id === id ? { ...button, isVisible: !button.isVisible } : button
    );
    setButtons(newButtons);
    saveToStorage();
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const toggleFooterVisibility = () => {
    const newFooter = { ...footer, isVisible: !footer.isVisible };
    setFooter(newFooter);
    saveToStorage();
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const deleteFeature = (id: string) => {
    const newFeatures = features.filter(feature => feature.id !== id);
    setFeatures(newFeatures);
    saveToStorage();
    toast({ title: "تم حذف الميزة بنجاح" });
  };

  const deleteButton = (id: string) => {
    const newButtons = buttons.filter(button => button.id !== id);
    setButtons(newButtons);
    saveToStorage();
    toast({ title: "تم حذف الزر بنجاح" });
  };

  const addNewFeature = () => {
    if (newFeature.title && newFeature.description) {
      const feature: CTAFeature = {
        id: Date.now().toString(),
        ...newFeature,
        isVisible: true,
        order: features.length + 1
      };
      const newFeatures = [...features, feature];
      setFeatures(newFeatures);
      setNewFeature({ title: "", description: "", icon: "Bell", color: "primary" });
      saveToStorage();
      toast({ title: "تم إضافة الميزة بنجاح" });
    }
  };

  const addNewButton = () => {
    if (newButton.text && newButton.url) {
      const button: CTAButton = {
        id: Date.now().toString(),
        ...newButton,
        isVisible: true,
        order: buttons.length + 1
      };
      const newButtons = [...buttons, button];
      setButtons(newButtons);
      setNewButton({ text: "", url: "", style: "primary", icon: "ArrowRight" });
      saveToStorage();
      toast({ title: "تم إضافة الزر بنجاح" });
    }
  };

  const updateContent = (updates: Partial<CTAContent>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    setEditingContent(false);
    saveToStorage();
    toast({ title: "تم تحديث المحتوى بنجاح" });
  };

  const updateFeature = (id: string, updates: Partial<CTAFeature>) => {
    const newFeatures = features.map(feature => 
      feature.id === id ? { ...feature, ...updates } : feature
    );
    setFeatures(newFeatures);
    setEditingFeature(null);
    saveToStorage();
    toast({ title: "تم تحديث الميزة بنجاح" });
  };

  const updateButton = (id: string, updates: Partial<CTAButton>) => {
    const newButtons = buttons.map(button => 
      button.id === id ? { ...button, ...updates } : button
    );
    setButtons(newButtons);
    setEditingButton(null);
    saveToStorage();
    toast({ title: "تم تحديث الزر بنجاح" });
  };

  const updateFooter = (updates: Partial<FooterText>) => {
    const newFooter = { ...footer, ...updates };
    setFooter(newFooter);
    setEditingFooter(false);
    saveToStorage();
    toast({ title: "تم تحديث النص السفلي بنجاح" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إدارة قسم "تابع رحلة التعلم"</h1>
        <p className="text-muted-foreground">إدارة محتوى وعناصر قسم الـ CTA</p>
      </div>

      {/* Main Content Management */}
      <Card>
        <CardHeader>
          <CardTitle>المحتوى الرئيسي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{content.emoji}</span>
                <div>
                  <h3 className="font-semibold">{content.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{content.description}</p>
                </div>
                <Badge variant={content.isVisible ? "default" : "secondary"}>
                  {content.isVisible ? "مرئي" : "مخفي"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleContentVisibility}
                >
                  {content.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingContent(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {editingContent && (
              <div className="space-y-3 pt-3 border-t">
                <Input
                  value={content.title}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  placeholder="العنوان"
                />
                <Textarea
                  value={content.description}
                  onChange={(e) => updateContent({ description: e.target.value })}
                  placeholder="الوصف"
                  rows={3}
                />
                <Input
                  value={content.emoji}
                  onChange={(e) => updateContent({ emoji: e.target.value })}
                  placeholder="الرمز التعبيري"
                />
                <Button onClick={() => setEditingContent(false)}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Management */}
      <Card>
        <CardHeader>
          <CardTitle>الميزات المميزة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    {feature.icon === "Bell" && <Bell className="w-4 h-4" />}
                    {feature.icon === "Mail" && <Mail className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Badge variant={feature.isVisible ? "default" : "secondary"}>
                    {feature.isVisible ? "مرئي" : "مخفي"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeatureVisibility(feature.id)}
                  >
                    {feature.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFeature(feature.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteFeature(feature.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingFeature === feature.id && (
                <div className="space-y-3 pt-3 border-t">
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                    placeholder="عنوان الميزة"
                  />
                  <Textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                    placeholder="وصف الميزة"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={feature.icon}
                      onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md"
                    >
                      <option value="Bell">جرس</option>
                      <option value="Mail">بريد</option>
                    </select>
                    <select
                      value={feature.color}
                      onChange={(e) => updateFeature(feature.id, { color: e.target.value })}
                      className="px-3 py-2 border border-border rounded-md"
                    >
                      <option value="primary">أساسي</option>
                      <option value="secondary">ثانوي</option>
                    </select>
                  </div>
                  <Button onClick={() => setEditingFeature(null)}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Feature */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة ميزة جديدة</h3>
            <Input
              value={newFeature.title}
              onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
              placeholder="عنوان الميزة"
            />
            <Textarea
              value={newFeature.description}
              onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف الميزة"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newFeature.icon}
                onChange={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="Bell">جرس</option>
                <option value="Mail">بريد</option>
              </select>
              <select
                value={newFeature.color}
                onChange={(e) => setNewFeature(prev => ({ ...prev, color: e.target.value }))}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="primary">أساسي</option>
                <option value="secondary">ثانوي</option>
              </select>
            </div>
            <Button onClick={addNewFeature}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة ميزة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Buttons Management */}
      <Card>
        <CardHeader>
          <CardTitle>الأزرار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {buttons.map((button) => (
            <div key={button.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{button.text}</span>
                    <Badge variant={button.style === "primary" ? "default" : "outline"}>
                      {button.style}
                    </Badge>
                    <Badge variant={button.isVisible ? "default" : "secondary"}>
                      {button.isVisible ? "مرئي" : "مخفي"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleButtonVisibility(button.id)}
                  >
                    {button.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingButton(button.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteButton(button.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingButton === button.id && (
                <div className="space-y-3 pt-3 border-t">
                  <Input
                    value={button.text}
                    onChange={(e) => updateButton(button.id, { text: e.target.value })}
                    placeholder="نص الزر"
                  />
                  <Input
                    value={button.url}
                    onChange={(e) => updateButton(button.id, { url: e.target.value })}
                    placeholder="الرابط"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={button.style}
                      onChange={(e) => updateButton(button.id, { style: e.target.value as "primary" | "outline" })}
                      className="px-3 py-2 border border-border rounded-md"
                    >
                      <option value="primary">أساسي</option>
                      <option value="outline">مخطط</option>
                    </select>
                    <Input
                      value={button.icon}
                      onChange={(e) => updateButton(button.id, { icon: e.target.value })}
                      placeholder="الأيقونة"
                    />
                  </div>
                  <Button onClick={() => setEditingButton(null)}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Button */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة زر جديد</h3>
            <Input
              value={newButton.text}
              onChange={(e) => setNewButton(prev => ({ ...prev, text: e.target.value }))}
              placeholder="نص الزر"
            />
            <Input
              value={newButton.url}
              onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
              placeholder="الرابط"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newButton.style}
                onChange={(e) => setNewButton(prev => ({ ...prev, style: e.target.value as "primary" | "outline" }))}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="primary">أساسي</option>
                <option value="outline">مخطط</option>
              </select>
              <Input
                value={newButton.icon}
                onChange={(e) => setNewButton(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="الأيقونة"
              />
            </div>
            <Button onClick={addNewButton}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة زر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Text Management */}
      <Card>
        <CardHeader>
          <CardTitle>النص السفلي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm">{footer.text}</p>
                <Badge variant={footer.isVisible ? "default" : "secondary"}>
                  {footer.isVisible ? "مرئي" : "مخفي"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleFooterVisibility}
                >
                  {footer.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingFooter(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {editingFooter && (
              <div className="space-y-3 pt-3 border-t">
                <Textarea
                  value={footer.text}
                  onChange={(e) => updateFooter({ text: e.target.value })}
                  placeholder="النص السفلي"
                  rows={2}
                />
                <Button onClick={() => setEditingFooter(false)}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}