import { useState, useEffect } from "react";
import { getProfile, getProfileWithFallback, createNewProfile, forceRefreshProfile, forceUpdateProfileImage, isProfileImageCorrect, type ProfileData } from "@/lib/profile-storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Twitter, Linkedin, Mail, Github, Instagram, Youtube, Facebook } from "lucide-react";

const iconMap = {
  ExternalLink,
  Twitter,
  Linkedin,
  Mail,
  Github,
  Instagram,
  Youtube,
  Facebook
};

const ProfileCard = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadProfile = () => {
      const profileData = getProfile();
      if (profileData) {
        setProfile(profileData);
      } else {
        // Auto-create default profile if none exists
        const defaultProfile = getProfileWithFallback();
        setProfile(defaultProfile);
      }
    };
    
    // Load initially
    loadProfile();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadProfile();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-origin updates
    window.addEventListener('profileUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);

  const handleCreateNewProfile = () => {
    const newProfile = createNewProfile();
    setProfile(newProfile);
  };

  const handleForceRefresh = () => {
    forceRefreshProfile();
    // Force reload the component
    window.location.reload();
  };

  const handleUpdateProfileImage = () => {
    forceUpdateProfileImage();
    // Force reload the component to show new image
    window.location.reload();
  };

  if (!profile) {
    return (
      <Card className="relative overflow-hidden bg-gradient-subtle border-0 shadow-elegant">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">لا يوجد ملف شخصي</h2>
            <p className="text-muted-foreground mb-6">
              لم يتم العثور على ملف شخصي محفوظ. يرجى الذهاب إلى إعدادات البروفايل لإنشاء ملف جديد.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleCreateNewProfile}
                className="bg-primary hover:bg-primary/90"
              >
                إنشاء ملف جديد
              </Button>
              <Button 
                onClick={handleUpdateProfileImage}
                variant="outline"
              >
                تحديث الصورة
              </Button>
              <Button 
                onClick={handleForceRefresh}
                variant="outline"
              >
                تحديث قوي
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                إعادة تحميل
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-subtle border-0 shadow-elegant">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-glow"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full border-2 border-background animate-pulse"></div>
          </div>
          
          <div className="text-center md:text-right flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {profile.name}
            </h1>
            <p className="text-xl text-primary font-medium mb-3">
              {profile.title}
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4 max-w-md">
              {profile.description}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-6">
              {profile.categories.filter(cat => cat.name !== "الكل").slice(0, 3).map((category) => (
                <Badge key={category.id} variant="secondary" className="bg-accent-soft text-accent-foreground">
                  {category.name}
                </Badge>
              ))}
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 justify-center md:justify-end">
              {profile.socialLinks.slice(0, 4).map((link) => {
                const IconComponent = iconMap[link.icon as keyof typeof iconMap];
                return (
                  <Button key={link.id} size="sm" variant="card" className="hover:text-primary" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <IconComponent className="w-4 h-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
};

export default ProfileCard;