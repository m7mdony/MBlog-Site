import { useState, useEffect } from "react";
import { getProfile, forceUpdateProfileImage, isProfileImageCorrect, type ProfileData } from "@/lib/profile-storage";

const AboutMariamProfile = () => {
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

  if (!profile) {
    return (
      <div className="prose prose-lg max-w-none text-center">
        <div className="mb-6">
          <p className="text-muted-foreground leading-relaxed">
            مرحباً! أنا مريم، مطورة برمجيات ومصممة تجربة مستخدم متخصصة في بناء حلول تقنية مبتكرة. 
            أحب مشاركة معرفتي في مجال ريادة الأعمال التقنية والتطوير الشخصي.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            من خلال هذه المنصة، أهدف إلى مساعدة رواد الأعمال والمطورين على بناء مشاريعهم 
            بطريقة أكثر فعالية باستخدام أفضل الأدوات والممارسات التقنية.
          </p>
        </div>
        
        <div className="border border-border rounded-lg p-4 bg-background/50">
          <p className="text-muted-foreground mb-4">
            لا يوجد ملف شخصي محفوظ. يمكنك إنشاء ملف جديد أو استعادة النسخة الافتراضية.
          </p>
                      <div className="flex gap-3">
              <button 
                onClick={() => {
                  const defaultProfile = getProfileWithFallback();
                  // Trigger profile update event
                  window.dispatchEvent(new CustomEvent('profileUpdated'));
                }}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                إنشاء ملف افتراضي
              </button>
              <button 
                onClick={() => {
                  forceUpdateProfileImage();
                  // Trigger profile update event
                  window.dispatchEvent(new CustomEvent('profileUpdated'));
                }}
                className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                تحديث الصورة
              </button>
              <button 
                onClick={() => {
                  // Force reload the page
                  window.location.reload();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                إعادة تحميل
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none text-center">
      <p className="text-muted-foreground leading-relaxed">
        {profile.description}
      </p>
      
      {/* Image info */}
      <div className="mt-6 p-4 border border-border rounded-lg bg-background/50">
        <p className="text-sm text-muted-foreground mb-2">
          <strong>معلومات الصورة:</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          المسار: {profile.profileImage}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          الحالة: {isProfileImageCorrect() ? 'صحيحة ✓' : 'قديمة !'}
        </p>
        
        <button 
          onClick={() => {
            forceUpdateProfileImage();
            // Trigger profile update event
            window.dispatchEvent(new CustomEvent('profileUpdated'));
          }}
          className="bg-secondary hover:bg-secondary/90 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          تحديث الصورة
        </button>
      </div>
    </div>
  );
};

export default AboutMariamProfile;