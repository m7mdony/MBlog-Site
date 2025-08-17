import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Upload, 
  Trash2, 
  Plus,
  ExternalLink,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Facebook
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  getProfile, 
  getProfileWithFallback,
  updateProfile, 
  addSocialLink, 
  removeSocialLink, 
  updateSocialLink,
  addCategory,
  removeCategory,
  updateCategory,
  forceUpdateProfileImage,
  isProfileImageCorrect,
  type ProfileData, 
  type SocialLink, 
  type Category 
} from "@/lib/profile-storage";

const iconMap = {
  ExternalLink,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Facebook
};

const platformOptions = [
  { value: "ExternalLink", label: "موقع إلكتروني" },
  { value: "Mail", label: "البريد الإلكتروني" },
  { value: "Twitter", label: "تويتر" },
  { value: "Linkedin", label: "لينكد إن" },
  { value: "Github", label: "جيت هاب" },
  { value: "Instagram", label: "إنستجرام" },
  { value: "Youtube", label: "يوتيوب" },
  { value: "Facebook", label: "فيسبوك" }
];

const colorOptions = [
  { value: "blue", label: "أزرق" },
  { value: "green", label: "أخضر" },
  { value: "purple", label: "بنفسجي" },
  { value: "orange", label: "برتقالي" },
  { value: "red", label: "أحمر" },
  { value: "indigo", label: "نيلي" },
  { value: "pink", label: "وردي" },
  { value: "teal", label: "تركوازي" }
];

export default function ProfileSettings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id'>>({
    platform: "ExternalLink",
    url: "",
    icon: "ExternalLink"
  });
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: "",
    count: 0,
    color: "blue"
  });

  useEffect(() => {
    const loadProfile = () => {
      const profileData = getProfile();
      if (profileData) {
        setProfile(profileData);
      } else {
        // Only create default profile if user explicitly wants to reset
        // Don't auto-create default profile
        setProfile(null);
      }
    };
    
    loadProfile();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadProfile();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const handleSaveProfile = () => {
    if (!profile) return;

    try {
      updateProfile(profile);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث بيانات البروفايل",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfileImage = () => {
    try {
      forceUpdateProfileImage();
      
      // Reload profile data
      setProfile(getProfile());
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث الصورة الشخصية",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الصورة",
        variant: "destructive",
      });
    }
  };

  const handleAddSocialLink = () => {
    if (!newSocialLink.url.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال الرابط",
        variant: "destructive",
      });
      return;
    }

    try {
      addSocialLink(newSocialLink);
      setNewSocialLink({ platform: "ExternalLink", url: "", icon: "ExternalLink" });
      setProfile(getProfile());
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الرابط الجديد",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الإضافة",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSocialLink = (id: string) => {
    try {
      removeSocialLink(id);
      setProfile(getProfile());
      toast({
        title: "تم الحذف",
        description: "تم حذف الرابط",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المجال",
        variant: "destructive",
      });
      return;
    }

    try {
      addCategory(newCategory);
      setNewCategory({ name: "", count: 0, color: "blue" });
      setProfile(getProfile());
      toast({
        title: "تم الإضافة",
        description: "تم إضافة المجال الجديد",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الإضافة",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCategory = (id: string) => {
    try {
      removeCategory(id);
      setProfile(getProfile());
      toast({
        title: "تم الحذف",
        description: "تم حذف المجال",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="p-6 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إعدادات البروفايل</h1>
          <p className="text-muted-foreground">تحرير بيانات البروفايل والمعلومات الشخصية</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>لا يوجد ملف شخصي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              لم يتم العثور على ملف شخصي محفوظ. يمكنك إنشاء ملف جديد أو استعادة النسخة الافتراضية.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  const defaultProfile = getProfileWithFallback();
                  setProfile(defaultProfile);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                إنشاء ملف افتراضي جديد
              </Button>
              <Button 
                variant="outline"
                onClick={handleUpdateProfileImage}
              >
                تحديث الصورة
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                إعادة تحميل الصفحة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إعدادات البروفايل</h1>
        <p className="text-muted-foreground">تحرير بيانات البروفايل والمعلومات الشخصية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="الاسم الكامل"
              />
            </div>
            
            <div>
              <Label htmlFor="title">المسمى الوظيفي</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({...profile, title: e.target.value})}
                placeholder="مثل: رائدة أعمال تقني"
              />
            </div>
            
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({...profile, description: e.target.value})}
                placeholder="وصف مختصر عنك..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="profileImage">الصورة الشخصية</Label>
              <div className="flex gap-2">
                <Input
                  id="profileImage"
                  value={profile.profileImage}
                  onChange={(e) => setProfile({...profile, profileImage: e.target.value})}
                  placeholder="رابط الصورة..."
                />
                <Button 
                  variant="outline"
                  onClick={handleUpdateProfileImage}
                  className="whitespace-nowrap"
                >
                  تحديث الصورة
                </Button>
              </div>
              
              {/* Image status */}
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground">
                  الحالة: {isProfileImageCorrect() ? 'صحيحة ✓' : 'قديمة !'}
                </p>
                <p className="text-muted-foreground">
                  المسار الحالي: {profile.profileImage}
                </p>
              </div>
              
              {/* Upload button */}
              <Button
                variant="outline"
                size="icon"
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
                        setProfile({...profile, profileImage: result});
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>معاينة البروفايل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary/20"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div>
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <p className="text-primary font-medium">{profile.title}</p>
                <p className="text-sm text-muted-foreground mt-2">{profile.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>الروابط الاجتماعية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.socialLinks.map((link) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap];
              return (
                <div key={link.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{platformOptions.find(p => p.value === link.platform)?.label}</span>
                  <span className="text-xs text-muted-foreground flex-1 truncate">{link.url}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveSocialLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="border-t pt-4">
            <Label>إضافة رابط جديد</Label>
            <div className="flex gap-2 mt-2">
              <Select 
                value={newSocialLink.platform} 
                onValueChange={(value) => setNewSocialLink({...newSocialLink, platform: value, icon: value})}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                placeholder="الرابط..."
                className="flex-1"
              />
              <Button onClick={handleAddSocialLink}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>المجالات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 p-3 border rounded-lg">
                <Badge variant="secondary" className={`bg-${category.color}-100 text-${category.color}-800`}>
                  {category.name}
                </Badge>
                <span className="text-sm text-muted-foreground">({category.count})</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-auto"
                  onClick={() => handleRemoveCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <Label>إضافة مجال جديد</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="اسم المجال..."
                className="flex-1"
              />
              <Input
                type="number"
                value={newCategory.count}
                onChange={(e) => setNewCategory({...newCategory, count: parseInt(e.target.value) || 0})}
                placeholder="العدد"
                className="w-20"
              />
              <Select 
                value={newCategory.color} 
                onValueChange={(value) => setNewCategory({...newCategory, color: value})}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddCategory}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Button onClick={handleSaveProfile} className="w-full" size="lg">
            <Save className="w-4 h-4 ml-2" />
            حفظ جميع التغييرات
          </Button>
          
          <Button 
            onClick={handleUpdateProfileImage} 
            variant="outline" 
            className="w-full"
          >
            تحديث الصورة الشخصية
          </Button>
          
          {/* Image status summary */}
          <div className="text-center p-4 border rounded-lg bg-background/50">
            <p className="text-sm font-medium mb-2">حالة الصورة الشخصية</p>
            <p className={`text-sm ${isProfileImageCorrect() ? 'text-green-600' : 'text-red-600'}`}>
              {isProfileImageCorrect() ? 'صحيحة ✓' : 'قديمة !'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              المسار: {profile.profileImage}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}