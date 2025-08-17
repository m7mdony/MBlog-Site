import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NewFileResource } from "@/components/NewFileResource";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const resources = [
  {
    id: "1",
    fileName: "قالب تقييم أفكار المشاريع",
    fileType: "PDF",
    description: "قالب شامل لتقييم الأفكار وتحليل الجدوى قبل بدء أي مشروع",
    fileSize: "2.5 MB"
  },
  {
    id: "2",
    fileName: "خطة التسويق الرقمي",
    fileType: "Notion",
    description: "قالب جاهز لبناء استراتيجية التسويق الرقمي لمشروعك",
    fileSize: "—"
  },
  {
    id: "3",
    fileName: "تتبع الأهداف الشخصية",
    fileType: "Excel",
    description: "جدول بيانات لتتبع وقياس تقدمك في تحقيق أهدافك",
    fileSize: "1.2 MB"
  },
  {
    id: "4",
    fileName: "دليل بناء الفريق",
    fileType: "PDF",
    description: "دليل شامل لبناء وإدارة فريق عمل ناجح",
    fileSize: "3.8 MB"
  },
  {
    id: "5",
    fileName: "قالب دراسة المنافسين",
    fileType: "Excel",
    description: "قالب لتحليل المنافسين ومقارنة نقاط القوة والضعف",
    fileSize: "890 KB"
  },
  {
    id: "6",
    fileName: "استراتيجية المحتوى",
    fileType: "Notion",
    description: "خطة شاملة لإنشاء وإدارة المحتوى الرقمي",
    fileSize: "—"
  }
];

const AllResources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(resource =>
    resource.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            📁 جميع الملفات والمصادر
          </h1>
          <p className="text-xl text-muted-foreground">
            مجموعة شاملة من القوالب والأدوات التي تساعدك في تطوير مشروعك
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في الملفات..." 
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

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <NewFileResource key={resource.id} {...resource} />
          ))}
        </div>

        {filteredResources.length === 0 && (
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

export default AllResources;