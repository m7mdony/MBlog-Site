import { useState } from "react";
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
  ExternalLink,
  Star,
  Globe
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

const favoritesData = [
  {
    id: 1,
    siteName: "Linear - أداة إدارة المشاريع",
    description: "أداة رائعة لإدارة المهام والمشاريع التقنية",
    reason: "واجهة نظيفة وسرعة استثنائية في الأداء",
    category: "أدوات",
    url: "https://linear.app",
    clicks: 120,
    status: "منشور",
    createdAt: "2024-01-25"
  },
  {
    id: 2,
    siteName: "Raycast - مشغل التطبيقات",
    description: "أداة إنتاجية قوية لنظام macOS",
    reason: "توفر الوقت وتسرع من سير العمل بشكل مذهل",
    category: "إنتاجية",
    url: "https://raycast.com",
    clicks: 89,
    status: "منشور",
    createdAt: "2024-01-23"
  },
  {
    id: 3,
    siteName: "Excalidraw - الرسم التفاعلي",
    description: "أداة رسم بسيطة وقوية للتوضيحات والمخططات",
    reason: "سهولة الاستخدام مع إمكانيات تعاون رائعة",
    category: "تصميم",
    url: "https://excalidraw.com",
    clicks: 67,
    status: "منشور",
    createdAt: "2024-01-20"
  },
  {
    id: 4,
    siteName: "Framer - منصة التصميم والتطوير",
    description: "منصة شاملة لتصميم وتطوير المواقع التفاعلية",
    reason: "تجمع بين التصميم والتطوير في مكان واحد",
    category: "تصميم",
    url: "https://framer.com",
    clicks: 0,
    status: "مسودة",
    createdAt: "2024-01-18"
  }
];

export default function FavoritesManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites] = useState(favoritesData);

  const filteredFavorites = favorites.filter(favorite =>
    favorite.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "أدوات":
        return "bg-blue-100 text-blue-800";
      case "إنتاجية":
        return "bg-green-100 text-green-800";
      case "تصميم":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الروابط المميزة</h1>
          <p className="text-muted-foreground">إدارة وتنظيم جميع الروابط والأدوات المفضلة</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="w-4 h-4 ml-2" />
          إضافة رابط جديد
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
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              منشور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي النقرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">276</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الفئات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3</div>
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
              placeholder="ابحث في الروابط..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Favorites Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الروابط المميزة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الموقع</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الرابط</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>النقرات</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFavorites.map((favorite) => (
                <TableRow key={favorite.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {favorite.siteName}
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {favorite.description}
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-1 rounded">
                          💡 {favorite.reason}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(favorite.category)}>
                      {favorite.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={favorite.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {favorite.url}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(favorite.status)}>
                      {favorite.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span>{favorite.clicks}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {favorite.createdAt}
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
                          <ExternalLink className="w-4 h-4 ml-2" />
                          زيارة الموقع
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {favorite.status === "مخفي" ? (
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
                        <DropdownMenuItem className="text-red-600">
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