import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { getEducation, getSkills, type Education, type TechSkill } from "@/lib/about-storage";
import { getProfile, getProfileWithFallback, type ProfileData } from "@/lib/profile-storage";

// مكون الشعار السعودي
const SaudiLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 120" 
    className={className}
    fill="currentColor"
  >
    {/* الدرع الأبيض */}
    <path 
      d="M50 10 L90 30 L90 90 L50 110 L10 90 L10 30 Z" 
      fill="white" 
      stroke="#1e40af" 
      strokeWidth="2"
    />
    
    {/* النخلة */}
    <path 
      d="M50 25 L45 35 L50 45 L55 35 Z M50 35 L45 45 L50 55 L55 45 Z M50 45 L45 55 L50 65 L55 55 Z" 
      fill="#3b82f6"
    />
    
    {/* السيف الأول */}
    <path 
      d="M35 40 L65 40 M50 35 L50 45" 
      stroke="#3b82f6" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    
    {/* السيف الثاني */}
    <path 
      d="M40 35 L60 35 M50 30 L50 40" 
      stroke="#3b82f6" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    
    {/* الكتاب مع التاريخ */}
    <rect x="42" y="70" width="16" height="12" fill="#3b82f6" rx="1" />
    <text x="50" y="78" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">1957</text>
  </svg>
);

export default function AboutMariam() {
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<TechSkill[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loadData = () => {
      setEducation(getEducation());
      setSkills(getSkills());
      
      // Load profile data
      const profileData = getProfile();
      if (profileData) {
        setProfile(profileData);
      } else {
        // Use fallback profile if no saved profile exists
        const fallbackProfile = getProfileWithFallback();
        setProfile(fallbackProfile);
      }
    };

    loadData();

    // Listen for data updates
    const handleDataUpdate = () => {
      loadData();
    };

    // Listen for profile updates
    const handleProfileUpdate = () => {
      const profileData = getProfile();
      if (profileData) {
        setProfile(profileData);
      }
    };

    window.addEventListener('aboutDataUpdated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('aboutDataUpdated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!skill.isVisible) return acc;
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, TechSkill[]>);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="group flex items-center gap-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        {/* About Section */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-400/20 shadow-lg">
              {profile && profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name || "مريم باعثمان"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl text-white">
                  👩‍💻
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              حول مريم
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              {profile && profile.description ? profile.description : "تمكين المنظمات من تطوير عمليات النمو عبر الاستراتيجيات والتسويق والتقنية وأتمتة العمليات"}
            </p>
          </CardContent>
        </Card>

        {/* Education Section */}
        {education.filter(edu => edu.isVisible).length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
                <GraduationCap className="w-6 h-6 text-gray-600" />
                التعليم الأكاديمي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.filter(edu => edu.isVisible).map((edu) => (
                  <div key={edu.id} className="p-6 rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      {edu.image && edu.image.trim() !== "" ? (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden border-2 border-blue-400/20 shadow-lg hover:shadow-xl transition-shadow">
                          <img
                            src={edu.image}
                            alt={edu.degree}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.error("خطأ في تحميل الصورة:", edu.image);
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                            onLoad={() => {
                              console.log("تم تحميل الصورة بنجاح:", edu.image);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <SaudiLogo className="w-12 h-12 text-blue-600" />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600">
                        {edu.university}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Skills */}
        {Object.keys(groupedSkills).length > 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
                <Wrench className="w-6 h-6 text-gray-600" />
                المهارات التقنية
              </CardTitle>
              <p className="text-gray-600 text-center">
                الأدوات والتقنيات التي أتقنها وأستخدمها في مشاريعي
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(groupedSkills).map(([category, tools]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {tools.map((tool) => (
                      <div
                        key={tool.id}
                        className="group p-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1 group-hover:scale-110 transition-transform">
                            {tool.icon}
                          </div>
                          <p className="font-medium text-gray-800 text-xs">
                            {tool.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contact CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            هل تريد التواصل معي أو التعاون في مشروع؟
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Link to="/contact">
              تواصل معي
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}