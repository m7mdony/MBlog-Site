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
  Play,
  Clock
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

const tutorialsData = [
  {
    id: 1,
    title: "Notion - نظرة سريعة وشاملة",
    description: "كيف تستخدم Notion لتنظيم حياتك ومشاريعك بطريقة احترافية",
    duration: "12:30",
    views: 2340,
    likes: 145,
    status: "منشور",
    createdAt: "2024-01-20",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Figma للمبتدئين",
    description: "أساسيات التصميم في Figma وكيفية إنشاء واجهات جميلة",
    duration: "15:45",
    views: 1890,
    likes: 98,
    status: "منشور",
    createdAt: "2024-01-18",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Obsidian - إدارة المعرفة",
    description: "بناء قاعدة معرفة شخصية قوية باستخدام Obsidian",
    duration: "18:20",
    views: 1567,
    likes: 87,
    status: "مسودة",
    createdAt: "2024-01-15",
    thumbnail: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Linear - إدارة المشاريع التقنية",
    description: "كيفية استخدام Linear لإدارة المشاريع التقنية بكفاءة",
    duration: "22:10",
    views: 0,
    likes: 0,
    status: "مخفي",
    createdAt: "2024-01-12",
    thumbnail: "/placeholder.svg"
  }
];

export default function TutorialsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tutorials] = useState(tutorialsData);

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الأدوات والشروحات</h1>
          <p className="text-muted-foreground">إدارة وتنظيم جميع شروحات الأدوات والفيديوهات التعليمية</p>
        </div>
        <Button className="bg-gradient-to-r from-secondary to-secondary/80">
          <Plus className="w-4 h-4 ml-2" />
          إضافة شرح جديد
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
            <div className="text-2xl font-bold text-green-600">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المشاهدات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5,797</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">68 دقيقة</div>
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
              placeholder="ابحث في الشروحات..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tutorials Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الشروحات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>الإعجابات</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTutorials.map((tutorial) => (
                <TableRow key={tutorial.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                        <Play className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{tutorial.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {tutorial.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(tutorial.status)}>
                      {tutorial.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{(tutorial.views || 0).toLocaleString()}</TableCell>
                  <TableCell>{tutorial.likes}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tutorial.createdAt}
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
                          {tutorial.status === "مخفي" ? (
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