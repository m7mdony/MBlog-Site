import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LatestToolTutorial } from "@/components/LatestToolTutorial";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowRight, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const tutorials = [
  {
    id: "1",
    title: "Notion - نظرة سريعة وشاملة",
    description: "كيف تستخدم Notion لتنظيم حياتك ومشاريعك بطريقة احترافية",
    thumbnail: "/placeholder.svg",
    duration: "12:30"
  },
  {
    id: "2",
    title: "Figma للمبتدئين",
    description: "أساسيات التصميم في Figma وكيفية إنشاء واجهات جميلة",
    thumbnail: "/placeholder.svg",
    duration: "15:45"
  },
  {
    id: "3",
    title: "Obsidian - إدارة المعرفة",
    description: "بناء قاعدة معرفة شخصية قوية باستخدام Obsidian",
    thumbnail: "/placeholder.svg",
    duration: "18:20"
  },
  {
    id: "4",
    title: "VSCode - إعداد بيئة التطوير",
    description: "كيفية إعداد VSCode للبرمجة بكفاءة وإنتاجية عالية",
    thumbnail: "/placeholder.svg",
    duration: "22:15"
  },
  {
    id: "5",
    title: "Git & GitHub - إدارة الإصدارات",
    description: "أساسيات استخدام Git و GitHub لإدارة المشاريع البرمجية",
    thumbnail: "/placeholder.svg",
    duration: "28:40"
  },
  {
    id: "6",
    title: "Slack - التواصل الفعال",
    description: "استخدام Slack لتحسين التواصل والتعاون في الفريق",
    thumbnail: "/placeholder.svg",
    duration: "14:25"
  }
];

const AllTutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const categories = ["الكل", "إدارة المشاريع", "التصميم", "البرمجة", "التواصل"];

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            📹 جميع شروحات الأدوات
          </h1>
          <p className="text-xl text-muted-foreground">
            تعلم أحدث الأدوات والتقنيات من خلال شروحات مفصلة وعملية
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في الشروحات..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortOrder === "desc" ? "default" : "outline"}
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                size="sm"
              >
                <ArrowUpDown className="w-4 h-4 ml-2" />
                {sortOrder === "desc" ? "الأحدث" : "الأقدم"}
              </Button>
              <Button variant="card" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <LatestToolTutorial key={tutorial.id} {...tutorial} />
          ))}
        </div>

        {filteredTutorials.length === 0 && (
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

export default AllTutorials;