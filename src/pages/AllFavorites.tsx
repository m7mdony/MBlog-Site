import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ExternalFavorite } from "@/components/ExternalFavorite";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const favorites = [
  {
    id: "1",
    siteName: "Linear - أداة إدارة المشاريع",
    description: "أداة رائعة لإدارة المهام والمشاريع التقنية",
    reason: "واجهة نظيفة وسرعة استثنائية في الأداء",
    category: "أدوات"
  },
  {
    id: "2",
    siteName: "Raycast - مشغل التطبيقات",
    description: "أداة إنتاجية قوية لنظام macOS",
    reason: "توفر الوقت وتسرع من سير العمل بشكل مذهل",
    category: "إنتاجية"
  },
  {
    id: "3",
    siteName: "Excalidraw - الرسم التفاعلي",
    description: "أداة رسم بسيطة وقوية للتوضيحات والمخططات",
    reason: "سهولة الاستخدام مع إمكانيات تعاون رائعة",
    category: "تصميم"
  },
  {
    id: "4",
    siteName: "Vercel - استضافة المواقع",
    description: "منصة استضافة سريعة وموثوقة للمطورين",
    reason: "نشر سريع ودعم ممتاز للتطبيقات الحديثة",
    category: "تطوير"
  },
  {
    id: "5",
    siteName: "Stripe - معالج المدفوعات",
    description: "حل شامل لمعالجة المدفوعات الإلكترونية",
    reason: "واجهات برمجية ممتازة ودعم عالمي",
    category: "أدوات"
  },
  {
    id: "6",
    siteName: "Tailwind CSS - إطار العمل",
    description: "إطار عمل CSS للتصميم السريع والمرن",
    reason: "يسرع عملية التطوير مع مرونة عالية في التخصيص",
    category: "تطوير"
  }
];

const AllFavorites = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFavorites = favorites.filter(favorite =>
    favorite.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Navigation />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            ⭐ جميع الروابط المميزة
          </h1>
          <p className="text-xl text-muted-foreground">
            مجموعة مختارة من أفضل الأدوات والمواقع التي أنصح بها
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في الروابط..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="card" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <ExternalFavorite key={favorite.id} {...favorite} />
          ))}
        </div>

        {filteredFavorites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لم نجد نتائج
            </h3>
            <p className="text-muted-foreground">
              جرب تغيير كلمات البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFavorites;