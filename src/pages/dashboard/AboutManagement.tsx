import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Edit, Trash2, Plus, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "@/hooks/use-toast";
import {
  getSections,
  setSections,
  addSection,
  updateSection,
  deleteSection,
  toggleSectionVisibility,
  getSkills,
  setSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  toggleSkillVisibility,
  getEducation,
  setEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  toggleEducationVisibility,
  resetEducationToDefault,
  getCertifications,
  setCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  toggleCertificationVisibility,
  type AboutSection,
  type TechSkill,
  type Education,
  type Certification
} from "@/lib/about-storage";

const initialSections: AboutSection[] = [
  {
    id: "1",
    title: "مقدمة",
    content: "مرحباً! أنا مريم، مطورة برمجيات ومصممة تجربة مستخدم متخصصة في بناء حلول تقنية مبتكرة. أحب مشاركة معرفتي في مجال ريادة الأعمال التقنية والتطوير الشخصي.",
    isVisible: true,
    order: 1
  },
  {
    id: "2", 
    title: "الهدف",
    content: "من خلال هذه المنصة، أهدف إلى مساعدة رواد الأعمال والمطورين على بناء مشاريعهم بطريقة أكثر فعالية باستخدام أفضل الأدوات والممارسات التقنية.",
    isVisible: true,
    order: 2
  }
];

const initialSkills: TechSkill[] = [
  // Office Apps
  { id: "1", name: "Word", icon: "📝", category: "Office Apps", isVisible: true },
  { id: "2", name: "Excel", icon: "📊", category: "Office Apps", isVisible: true },
  { id: "3", name: "PowerPoint", icon: "📽️", category: "Office Apps", isVisible: true },
  { id: "4", name: "OneNote", icon: "📋", category: "Office Apps", isVisible: true },
  
  // Google Apps
  { id: "5", name: "Sheets", icon: "📊", category: "Google Apps", isVisible: true },
  { id: "6", name: "Docs", icon: "📄", category: "Google Apps", isVisible: true },
  { id: "7", name: "Slides", icon: "🎞️", category: "Google Apps", isVisible: true },
  { id: "8", name: "Forms", icon: "📝", category: "Google Apps", isVisible: true },
  
  // Graphics & Videos Apps
  { id: "9", name: "Illustrator", icon: "🎨", category: "Graphics & Videos Apps", isVisible: true },
  { id: "10", name: "Premiere", icon: "🎬", category: "Graphics & Videos Apps", isVisible: true },
  { id: "11", name: "Photoshop", icon: "📸", category: "Graphics & Videos Apps", isVisible: true },
  { id: "12", name: "InDesign", icon: "📖", category: "Graphics & Videos Apps", isVisible: true },
  { id: "13", name: "Adobe XD", icon: "🎯", category: "Graphics & Videos Apps", isVisible: true },
  { id: "14", name: "Figma", icon: "🎨", category: "Graphics & Videos Apps", isVisible: true },
  
  // Zoho Apps
  { id: "15", name: "Zoho CRM", icon: "👥", category: "Zoho Apps", isVisible: true },
  { id: "16", name: "Zoho Mail", icon: "📧", category: "Zoho Apps", isVisible: true },
  { id: "17", name: "Zoho Projects", icon: "📋", category: "Zoho Apps", isVisible: true },
  
  // WordPress
  { id: "18", name: "WordPress", icon: "🌐", category: "WordPress", isVisible: true },
  
  // Analytics Apps
  { id: "19", name: "Google Analytics", icon: "📈", category: "Analytics Apps", isVisible: true },
  { id: "20", name: "Google Tag Manager", icon: "🏷️", category: "Analytics Apps", isVisible: true },
  { id: "21", name: "Google Data Studio", icon: "📊", category: "Analytics Apps", isVisible: true },
  { id: "22", name: "AgencyAnalytics", icon: "📊", category: "Analytics Apps", isVisible: true },
  { id: "23", name: "DataiKu", icon: "🔍", category: "Analytics Apps", isVisible: true },
  { id: "24", name: "Power BI", icon: "⚡", category: "Analytics Apps", isVisible: true },
  
  // Paid ADs
  { id: "25", name: "Twitter Ads", icon: "🐦", category: "Paid ADs", isVisible: true },
  { id: "26", name: "Facebook Ads", icon: "📘", category: "Paid ADs", isVisible: true },
  { id: "27", name: "Snapchat Ads", icon: "👻", category: "Paid ADs", isVisible: true },
  { id: "28", name: "Google Ads", icon: "🎯", category: "Paid ADs", isVisible: true },
  { id: "29", name: "TikTok Ads", icon: "🎵", category: "Paid ADs", isVisible: true },
  
  // Monitoring Apps
  { id: "30", name: "Talkwalker", icon: "👁️", category: "Monitoring Apps", isVisible: true },
  { id: "31", name: "Tweetdeck", icon: "🐦", category: "Monitoring Apps", isVisible: true },
  { id: "32", name: "Meltwater", icon: "💧", category: "Monitoring Apps", isVisible: true },
  
  // SEO Apps
  { id: "33", name: "Semrush", icon: "🔍", category: "SEO Apps", isVisible: true },
  { id: "34", name: "Moz", icon: "🦎", category: "SEO Apps", isVisible: true },
  
  // CRM
  { id: "35", name: "Zoho", icon: "📊", category: "CRM", isVisible: true },
  { id: "36", name: "Mailer", icon: "📧", category: "CRM", isVisible: true },
  { id: "37", name: "Mailchimp", icon: "🐵", category: "CRM", isVisible: true },
  { id: "38", name: "Mailerlite", icon: "✉️", category: "CRM", isVisible: true },
  
  // Task Management Tools
  { id: "39", name: "Asana", icon: "✅", category: "Task Management Tools", isVisible: true },
  { id: "40", name: "Notion", icon: "📝", category: "Task Management Tools", isVisible: true },
  { id: "41", name: "Trello", icon: "📋", category: "Task Management Tools", isVisible: true }
];

const initialEducation: Education[] = [
  {
    id: "1",
    degree: "بكالوريوس",
    field: "اللغات والترجمة",
    university: "جامعة الملك سعود",
    icon: "🎓",
    isVisible: true
  },
  {
    id: "2",
    degree: "ماجستير",
    field: "إدارة الأعمال",
    university: "جامعة الملك سعود",
    icon: "🎯",
    isVisible: true
  }
];

const initialCertifications: Certification[] = [
  {
    id: "1",
    name: "CPMM",
    fullName: "Certified Product Marketing Manager",
    organization: "AIPMM",
    icon: "📊",
    isVisible: true
  },
  {
    id: "2",
    name: "شهادة احترافية",
    fullName: "وصف الشهادة الثانية",
    organization: "الجهة المانحة",
    icon: "🎯",
    isVisible: true
  },
  {
    id: "3",
    name: "شهادة احترافية",
    fullName: "وصف الشهادة الثالثة",
    organization: "الجهة المانحة",
    icon: "💼",
    isVisible: true
  }
];

export default function AboutManagement() {
  const [sections, setLocalSections] = useState<AboutSection[]>([]);
  const [skills, setLocalSkills] = useState<TechSkill[]>([]);
  const [education, setLocalEducation] = useState<Education[]>([]);
  const [certifications, setLocalCertifications] = useState<Certification[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [editingCertification, setEditingCertification] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({ title: "", content: "" });
  const [newSkill, setNewSkill] = useState({ name: "", icon: "", image: "", category: "" });
  const [newEducation, setNewEducation] = useState({ degree: "", field: "", university: "", icon: "🎓", image: "" });
  const [newCertification, setNewCertification] = useState({ name: "", fullName: "", organization: "", icon: "📊" });

  // Load data from storage on component mount
  useEffect(() => {
    setLocalSections(getSections());
    setLocalSkills(getSkills());
    setLocalEducation(getEducation());
    setLocalCertifications(getCertifications());
  }, []);

  // Listen for storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setLocalSections(getSections());
      setLocalSkills(getSkills());
      setLocalEducation(getEducation());
      setLocalCertifications(getCertifications());
    };

    window.addEventListener('aboutDataUpdated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    
    // إضافة استماع لتحديثات البروفايل
    window.addEventListener('profileUpdated', handleStorageUpdate);

    return () => {
      window.removeEventListener('aboutDataUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('profileUpdated', handleStorageUpdate);
    };
  }, []);

  const handleToggleSectionVisibility = (id: string) => {
    toggleSectionVisibility(id);
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const handleToggleSkillVisibility = (id: string) => {
    toggleSkillVisibility(id);
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const handleToggleEducationVisibility = (id: string) => {
    toggleEducationVisibility(id);
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const handleToggleCertificationVisibility = (id: string) => {
    toggleCertificationVisibility(id);
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const handleDeleteSection = (id: string) => {
    deleteSection(id);
    toast({ title: "تم حذف القسم بنجاح" });
  };

  const handleDeleteSkill = (id: string) => {
    deleteSkill(id);
    toast({ title: "تم حذف المهارة بنجاح" });
  };

  const handleDeleteEducation = (id: string) => {
    deleteEducation(id);
    toast({ title: "تم حذف التعليم بنجاح" });
  };

  const handleDeleteCertification = (id: string) => {
    deleteCertification(id);
    toast({ title: "تم حذف الشهادة بنجاح" });
  };

  const addNewSection = () => {
    if (newSection.title && newSection.content) {
      addSection({
        title: newSection.title,
        content: newSection.content,
        isVisible: true,
        order: sections.length + 1
      });
      setNewSection({ title: "", content: "" });
      toast({ title: "تم إضافة القسم بنجاح" });
    }
  };

  const addNewSkill = () => {
    if (newSkill.name && (newSkill.icon || newSkill.image) && newSkill.category) {
      addSkill({
        name: newSkill.name,
        icon: newSkill.icon,
        image: newSkill.image,
        category: newSkill.category,
        isVisible: true
      });
      setNewSkill({ name: "", icon: "", image: "", category: "" });
      toast({ title: "تم إضافة المهارة بنجاح" });
    }
  };

  const addNewEducation = () => {
    if (newEducation.degree && newEducation.field && newEducation.university) {
      const educationData = {
        ...newEducation,
        isVisible: true
      };
      
              // إضافة المؤهل التعليمي
        console.log("بيانات المؤهل المراد إضافته:", educationData);
        
        const addedEducation = addEducation(educationData);
        
        if (addedEducation) {
          console.log("تم إضافة المؤهل بنجاح:", addedEducation);
          
          // تحديث القائمة المحلية
          const updatedEducation = getEducation();
          console.log("قائمة التعليم المحدثة:", updatedEducation);
          setLocalEducation(updatedEducation);
          
          // إعادة تعيين النموذج
          setNewEducation({ degree: "", field: "", university: "", icon: "🎓", image: "" });
          
          toast({ 
            title: "تم إضافة المؤهل التعليمي بنجاح",
            description: newEducation.image ? "تم حفظ الصورة مع المؤهل" : "تم إضافة المؤهل بدون صورة"
          });
          
          // إرسال حدث تحديث البيانات
          window.dispatchEvent(new CustomEvent('aboutDataUpdated'));
        } else {
        toast({ 
          title: "خطأ في إضافة المؤهل",
          description: "فشل في حفظ المؤهل التعليمي",
          variant: "destructive"
        });
      }
    } else {
      toast({ 
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
    }
  };

  const addNewCertification = () => {
    if (newCertification.name && newCertification.fullName && newCertification.organization) {
      addCertification({
        ...newCertification,
        isVisible: true
      });
      setNewCertification({ name: "", fullName: "", organization: "", icon: "📊" });
      toast({ title: "تم إضافة الشهادة بنجاح" });
    }
  };

  const handleUpdateSection = (id: string, updates: Partial<AboutSection>) => {
    updateSection(id, updates);
    setEditingSection(null);
    toast({ title: "تم تحديث القسم بنجاح" });
  };

  const handleUpdateSkill = (id: string, updates: Partial<TechSkill>) => {
    updateSkill(id, updates);
    setEditingSkill(null);
    toast({ title: "تم تحديث المهارة بنجاح" });
  };

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    updateEducation(id, updates);
    setEditingEducation(null);
    toast({ title: "تم تحديث التعليم بنجاح" });
  };

  const handleUpdateCertification = (id: string, updates: Partial<Certification>) => {
    updateCertification(id, updates);
    setEditingCertification(null);
    toast({ title: "تم تحديث الشهادة بنجاح" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إدارة صفحة "حول مريم"</h1>
        <p className="text-muted-foreground">إدارة محتوى وأقسام صفحة "حول مريم"</p>
      </div>

      {/* About Sections Management */}
      <Card>
        <CardHeader>
          <CardTitle>أقسام الصفحة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{section.title}</h3>
                  <Badge variant={section.isVisible ? "default" : "secondary"}>
                    {section.isVisible ? "مرئي" : "مخفي"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleSectionVisibility(section.id)}
                  >
                    {section.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingSection(section.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingSection === section.id ? (
                <div className="space-y-3">
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="عنوان القسم"
                  />
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="محتوى القسم"
                    rows={4}
                  />
                  <Button onClick={() => setEditingSection(null)}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">{section.content}</p>
              )}
            </div>
          ))}

          {/* Add New Section */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة قسم جديد</h3>
            <Input
              value={newSection.title}
              onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
              placeholder="عنوان القسم"
            />
            <Textarea
              value={newSection.content}
              onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
              placeholder="محتوى القسم"
              rows={3}
            />
            <Button onClick={addNewSection}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة قسم
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tech Skills Management */}
      <Card>
        <CardHeader>
          <CardTitle>المهارات التقنية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {skill.image ? (
                      <img 
                        src={skill.image} 
                        alt={skill.name}
                        className="w-6 h-6 object-contain rounded"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'inline';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-xl">{skill.icon}</span>
                    )}
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <Badge variant={skill.isVisible ? "default" : "secondary"}>
                    {skill.isVisible ? "مرئي" : "مخفي"}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {skill.category}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleSkillVisibility(skill.id)}
                  >
                    {skill.isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingSkill(skill.id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {editingSkill === skill.id && (
                  <div className="space-y-2 pt-2 border-t">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      placeholder="اسم المهارة"
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={skill.icon || ""}
                        onChange={(e) => updateSkill(skill.id, { icon: e.target.value })}
                        placeholder="الأيقونة (emoji)"
                        className="text-sm flex-1"
                      />
                      <span className="text-muted-foreground text-sm self-center">أو</span>
                      <div className="flex gap-1">
                        <Input
                          value={skill.image || ""}
                          onChange={(e) => updateSkill(skill.id, { image: e.target.value })}
                          placeholder="رابط الصورة"
                          className="text-sm"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const result = e.target?.result as string;
                                  updateSkill(skill.id, { image: result });
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          📁
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                      placeholder="الفئة"
                      className="text-sm"
                    />
                    <Button size="sm" onClick={() => setEditingSkill(null)}>
                      <Save className="w-3 h-3 ml-1" />
                      حفظ
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Skill */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة مهارة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم المهارة"
              />
              <Input
                value={newSkill.category}
                onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                placeholder="الفئة"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">اختر نوع الأيقونة:</p>
              <div className="flex gap-2">
                <Input
                  value={newSkill.icon}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="أيقونة (emoji)"
                  className="flex-1"
                />
                <span className="text-muted-foreground text-sm self-center">أو</span>
                <div className="flex gap-1 flex-1">
                  <Input
                    value={newSkill.image}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="رابط الصورة"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/png,image/jpg,image/jpeg,image/svg+xml';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const result = e.target?.result as string;
                            setNewSkill(prev => ({ ...prev, image: result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    📁 رفع صورة
                  </Button>
                </div>
              </div>
              {newSkill.image && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <img 
                    src={newSkill.image} 
                    alt="معاينة" 
                    className="w-8 h-8 object-contain rounded"
                  />
                  <span className="text-sm text-muted-foreground">معاينة الصورة</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setNewSkill(prev => ({ ...prev, image: "" }))}
                  >
                    ❌
                  </Button>
                </div>
              )}
            </div>
            <Button onClick={addNewSkill}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة مهارة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Education Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>التعليم الأكاديمي</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                resetEducationToDefault();
                setLocalEducation(getEducation());
                toast({ 
                  title: "تم إعادة تعيين البيانات",
                  description: "تم إعادة تعيين المؤهلات التعليمية إلى القيم الافتراضية"
                });
              }}
            >
              إعادة تعيين للافتراضي
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {edu.image && edu.image.trim() !== "" ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                        <img
                          src={edu.image}
                          alt={edu.degree}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("خطأ في تحميل الصورة في لوحة التحكم:", edu.image);
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                          onLoad={() => {
                            console.log("تم تحميل الصورة في لوحة التحكم:", edu.image);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-xl">{edu.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{edu.degree} {edu.field}</h3>
                    <p className="text-sm text-muted-foreground">{edu.university}</p>
                  </div>
                  <Badge variant={edu.isVisible ? "default" : "secondary"}>
                    {edu.isVisible ? "مرئي" : "مخفي"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleEducationVisibility(edu.id)}
                  >
                    {edu.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingEducation(edu.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteEducation(edu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editingEducation === edu.id && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="الدرجة العلمية"
                      className="text-sm"
                    />
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      placeholder="التخصص"
                      className="text-sm"
                    />
                  </div>
                  <Input
                    value={edu.university}
                    onChange={(e) => updateEducation(edu.id, { university: e.target.value })}
                    placeholder="الجامعة"
                    className="text-sm"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      value={edu.icon}
                      onChange={(e) => updateEducation(edu.id, { icon: e.target.value })}
                      placeholder="الأيقونة"
                      className="text-sm"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        صورة المؤهل التعليمي:
                      </label>
                      <ImageUpload
                        value={edu.image || ""}
                        onChange={(value) => updateEducation(edu.id, { image: value })}
                        placeholder="اختر صورة للمؤهل التعليمي"
                        showPreview={true}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setEditingEducation(null)}>
                    <Save className="w-3 h-3 ml-1" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Education */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة مؤهل تعليمي جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newEducation.degree}
                onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="الدرجة العلمية"
              />
              <Input
                value={newEducation.field}
                onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                placeholder="التخصص"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newEducation.university}
                onChange={(e) => setNewEducation(prev => ({ ...prev, university: e.target.value }))}
                placeholder="الجامعة"
              />
              <Input
                value={newEducation.icon}
                onChange={(e) => setNewEducation(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="الأيقونة (emoji)"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                صورة المؤهل التعليمي:
              </label>
              <ImageUpload
                value={newEducation.image}
                onChange={(value) => setNewEducation(prev => ({ ...prev, image: value }))}
                placeholder="اختر صورة للمؤهل التعليمي"
                showPreview={true}
              />
            </div>
            <Button onClick={addNewEducation}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة مؤهل تعليمي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certifications Management */}
      <Card>
        <CardHeader>
          <CardTitle>الشهادات الاحترافية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cert.icon}</span>
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.fullName}</p>
                    <p className="text-xs text-muted-foreground">{cert.organization}</p>
                  </div>
                  <Badge variant={cert.isVisible ? "default" : "secondary"}>
                    {cert.isVisible ? "مرئي" : "مخفي"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCertificationVisibility(cert.id)}
                  >
                    {cert.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCertification(cert.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCertification(cert.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editingCertification === cert.id && (
                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                    placeholder="اسم الشهادة المختصر"
                    className="text-sm"
                  />
                  <Input
                    value={cert.fullName}
                    onChange={(e) => updateCertification(cert.id, { fullName: e.target.value })}
                    placeholder="الاسم الكامل للشهادة"
                    className="text-sm"
                  />
                  <Input
                    value={cert.organization}
                    onChange={(e) => updateCertification(cert.id, { organization: e.target.value })}
                    placeholder="الجهة المانحة"
                    className="text-sm"
                  />
                  <Input
                    value={cert.icon}
                    onChange={(e) => updateCertification(cert.id, { icon: e.target.value })}
                    placeholder="الأيقونة"
                    className="text-sm"
                  />
                  <Button size="sm" onClick={() => setEditingCertification(null)}>
                    <Save className="w-3 h-3 ml-1" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Certification */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة شهادة احترافية جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newCertification.name}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم الشهادة المختصر"
              />
              <Input
                value={newCertification.fullName}
                onChange={(e) => setNewCertification(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="الاسم الكامل للشهادة"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newCertification.organization}
                onChange={(e) => setNewCertification(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="الجهة المانحة"
              />
              <Input
                value={newCertification.icon}
                onChange={(e) => setNewCertification(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="الأيقونة (emoji)"
              />
            </div>
            <Button onClick={addNewCertification}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة شهادة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}