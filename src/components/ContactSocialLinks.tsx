import { useState, useEffect } from "react";
import { getProfile, getProfileWithFallback, forceUpdateProfileImage, isProfileImageCorrect, type SocialLink } from "@/lib/profile-storage";
import { Linkedin, Twitter, Github, Instagram, Youtube, Facebook, Mail, ExternalLink } from "lucide-react";

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

const ContactSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [email, setEmail] = useState("mariam@example.com");

  useEffect(() => {
    const loadProfile = () => {
      const profile = getProfile();
      if (profile) {
        setSocialLinks(profile.socialLinks);
        
        // Find email in social links
        const emailLink = profile.socialLinks.find(link => link.platform === "Mail");
        if (emailLink) {
          setEmail(emailLink.url.replace("mailto:", ""));
        }
      } else {
        // Auto-create default profile if none exists
        const defaultProfile = getProfileWithFallback();
        setSocialLinks(defaultProfile.socialLinks);
        
        // Find email in social links
        const emailLink = defaultProfile.socialLinks.find(link => link.platform === "Mail");
        if (emailLink) {
          setEmail(emailLink.url.replace("mailto:", ""));
        }
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

  // Update email in contact form
  useEffect(() => {
    const emailElement = document.getElementById('contact-email');
    if (emailElement) {
      emailElement.textContent = email;
      emailElement.setAttribute('href', `mailto:${email}`);
    }
  }, [email]);

  if (socialLinks.length === 0) {
    return (
      <div className="text-center p-6 border border-border rounded-lg bg-background/50">
        <p className="text-muted-foreground mb-4">
          لا توجد روابط اجتماعية متاحة. يرجى الذهاب إلى إعدادات البروفايل لإنشاء ملف جديد.
        </p>
        
        {/* Image info */}
        <div className="mb-4 p-3 border border-border rounded bg-background/30">
          <p className="text-xs text-muted-foreground mb-2">
            <strong>معلومات الصورة:</strong>
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            الحالة: {isProfileImageCorrect() ? 'صحيحة ✓' : 'قديمة !'}
          </p>
        </div>
        
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
    );
  }

  return (
    <>
      {socialLinks.map((link) => {
        const IconComponent = iconMap[link.icon as keyof typeof iconMap];
        const isEmail = link.platform === "Mail";
        
        if (isEmail) return null; // Email is handled separately
        
        return (
          <a 
            key={link.id}
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50 hover:bg-background hover:shadow-md transition-all duration-300 group"
          >
            <IconComponent className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {link.platform === "ExternalLink" ? "موقع إلكتروني" : 
                 link.platform === "Twitter" ? "تويتر" :
                 link.platform === "Linkedin" ? "لينكد إن" :
                 link.platform === "Github" ? "جيت هاب" :
                 link.platform === "Instagram" ? "إنستجرام" :
                 link.platform === "Youtube" ? "يوتيوب" :
                 link.platform === "Facebook" ? "فيسبوك" : link.platform}
              </p>
              <p className="text-sm text-muted-foreground">تواصل معي</p>
            </div>
          </a>
        );
      })}
    </>
  );
};

export default ContactSocialLinks;