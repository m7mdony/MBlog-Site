import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreHorizontal,
  Download,
  FileText,
  File
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// واجهة المورد
interface Resource {
  id: number;
  fileName: string;
  fileType: string;
  description: string;
  fileSize: string;
  downloads: number;
  status: "منشور" | "مسودة" | "مخفي";
  createdAt: string;
  category: string;
  fileUrl: string;
}

// مفتاح التخزين
const RESOURCES_STORAGE_KEY = 'mariam_bassitman_resources';

// البيانات الافتراضية
const defaultResources: Resource[] = [
  {
    id: 1,
    fileName: "قالب تقييم أفكار المشاريع",
    fileType: "PDF",
    description: "قالب شامل لتقييم الأفكار وتحليل الجدوى قبل بدء أي مشروع",
    fileSize: "2.5 MB",
    downloads: 450,
    status: "منشور",
    createdAt: "2024-01-22",
    category: "قوالب",
    fileUrl: "/resources/project-evaluation-template.pdf"
  },
  {
    id: 2,
    fileName: "خطة التسويق الرقمي",
    fileType: "Notion",
    description: "قالب جاهز لبناء استراتيجية التسويق الرقمي لمشروعك",
    fileSize: "—",
    downloads: 320,
    status: "منشور",
    createdAt: "2024-01-20",
    category: "قوالب",
    fileUrl: "https://notion.so/digital-marketing-plan"
  },
  {
    id: 3,
    fileName: "تتبع الأهداف الشخصية",
    fileType: "Excel",
    description: "جدول بيانات لتتبع وقياس تقدمك في تحقيق أهدافك",
    fileSize: "1.2 MB",
    downloads: 280,
    status: "منشور",
    createdAt: "2024-01-18",
    category: "أدوات",
    fileUrl: "/resources/goal-tracking.xlsx"
  },
  {
    id: 4,
    fileName: "دليل بناء العادات الإنتاجية",
    fileType: "PDF",
    description: "دليل شامل لبناء عادات إنتاجية مستدامة في العمل والحياة",
    fileSize: "3.8 MB",
    downloads: 0,
    status: "مسودة",
    createdAt: "2024-01-15",
    category: "أدلة",
    fileUrl: "/resources/productivity-habits-guide.pdf"
  }
];

// وظائف التخزين
const getResources = (): Resource[] => {
  try {
    const stored = localStorage.getItem(RESOURCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // تهيئة البيانات الافتراضية
    setResources(defaultResources);
    return defaultResources;
  } catch (error) {
    console.error('Error loading resources:', error);
    return defaultResources;
  }
};

const setResources = (resources: Resource[]): void => {
  try {
    localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(resources));
    // إرسال حدث تحديث
    window.dispatchEvent(new CustomEvent('resourcesUpdated', { detail: resources }));
  } catch (error) {
    console.error('Error saving resources:', error);
  }
};

const addResource = (resourceData: Omit<Resource, 'id' | 'downloads' | 'createdAt'>): Resource => {
  const resources = getResources();
  const newId = Math.max(...resources.map(r => r.id), 0) + 1;
  
  const newResource: Resource = {
    ...resourceData,
    id: newId,
    downloads: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const updatedResources = [newResource, ...resources];
  setResources(updatedResources);
  return newResource;
};

const updateResource = (id: number, updates: Partial<Resource>): void => {
  const resources = getResources();
  const updatedResources = resources.map(resource => 
    resource.id === id ? { ...resource, ...updates } : resource
  );
  setResources(updatedResources);
};

const deleteResource = (id: number): void => {
  const resources = getResources();
  const updatedResources = resources.filter(resource => resource.id !== id);
  setResources(updatedResources);
};

const toggleResourceVisibility = (id: number): void => {
  const resources = getResources();
  const updatedResources = resources.map(resource => {
    if (resource.id === id) {
      const newStatus = resource.status === "مخفي" ? "منشور" : "مخفي";
      return { ...resource, status: newStatus };
    }
    return resource;
  });
  setResources(updatedResources);
};

export default function ResourcesManagement() {
  const [resources, setLocalResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLocalResources(getResources());
    
    const handleResourcesUpdate = () => {
      setLocalResources(getResources());
    };
    
    window.addEventListener('resourcesUpdated', handleResourcesUpdate);
    
    return () => {
      window.removeEventListener('resourcesUpdated', handleResourcesUpdate);
    };
  }, []);

  const filteredResources = resources.filter(resource =>
    resource.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "منشور":
        return "bg-green-100 text-green-800";
      case "مسودة":
        return "bg-yellow-100 text-yellow-800";
      case "مخفي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'notion':
        return '📝';
      case 'excel':
      case 'xlsx':
        return '📊';
      default:
        return '📁';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return "bg-red-100 text-red-800";
      case 'notion':
        return "bg-blue-100 text-blue-800";
      case 'excel':
      case 'xlsx':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (id: number, fileName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف "${fileName}"؟`)) {
      deleteResource(id);
      toast.success("تم حذف المورد بنجاح");
    }
  };

  const handleToggleVisibility = (id: number) => {
    toggleResourceVisibility(id);
    toast.success("تم تحديث حالة المورد");
  };

  const handleAddResource = () => {
    // إضافة مورد جديد للاختبار
    const newResource = addResource({
      fileName: "مورد جديد",
      fileType: "PDF",
      description: "وصف المورد الجديد",
      fileSize: "1.0 MB",
      status: "مسودة",
      category: "أدوات",
      fileUrl: "/resources/new-resource.pdf"
    });
    toast.success("تم إضافة مورد جديد");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الملفات والمصادر</h1>
          <p className="text-muted-foreground">إدارة وتنظيم جميع الملفات والمصادر القابلة للتحميل</p>
        </div>
        <Button onClick={handleAddResource} className="bg-gradient-to-r from-accent to-accent/80">
          <Plus className="w-4 h-4 ml-2" />
          إضافة ملف جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المجموع الكلي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              منشور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.status === "منشور").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي التحميلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
                              {resources.reduce((sum, r) => sum + (r.downloads || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              حجم الملفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {resources.reduce((sum, r) => {
                const size = parseFloat(r.fileSize);
                return isNaN(size) ? sum : sum + size;
              }, 0).toFixed(1)} MB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في الملفات..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الملفات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الملف</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحجم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التحميلات</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getFileIcon(resource.fileType)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{resource.fileName}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {resource.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getFileTypeColor(resource.fileType)}>
                      {resource.fileType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.category}</Badge>
                  </TableCell>
                  <TableCell>{resource.fileSize}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span>{resource.downloads}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {resource.createdAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 ml-2" />
                          تحميل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisibility(resource.id)}>
                          {resource.status === "مخفي" ? (
                            <>
                              <Eye className="w-4 h-4 ml-2" />
                              إظهار
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 ml-2" />
                              إخفاء
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(resource.id, resource.fileName)}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}