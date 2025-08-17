import { 
  Home, 
  FileText, 
  Settings, 
  Eye, 
  Plus,
  Filter,
  Users,
  User,
  BarChart3,
  Video,
  Download,
  Heart,
  Mail,
  Megaphone,
  Layout,
  Calendar,
  Image,
  Code
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "الصفحة الرئيسية", url: "/", icon: Home },
  { title: "لوحة التحكم", url: "/dashboard", icon: Layout },
  { title: "إدارة المفاهيم", url: "/dashboard/concepts", icon: FileText },
  { title: "إدارة المقالات", url: "/dashboard/articles", icon: FileText },
  { title: "إدارة الدورات", url: "/dashboard/tutorials", icon: Video },
  { title: "إدارة الموارد", url: "/dashboard/resources", icon: Download },
  { title: "إدارة الإنفوجرافيكات", url: "/dashboard/infographics", icon: Image },
  { title: "إدارة المفضلة", url: "/dashboard/favorites", icon: Heart },
  { title: "إعدادات الأقسام", url: "/dashboard/sections", icon: Eye },
  { title: "الفلاتر", url: "/dashboard/filters", icon: Filter },
  { title: "إعدادات البروفايل", url: "/dashboard/profile", icon: User },
  { title: "إدارة 'حول مريم'", url: "/dashboard/about", icon: Users },
  { title: "إدارة 'تواصل معنا'", url: "/dashboard/contact", icon: Mail },
  { title: "زر الاستشارة", url: "/dashboard/consultation-button", icon: Calendar },
  { title: "الإحصائيات", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "إدارة الإحصائيات", url: "/dashboard/stats", icon: BarChart3 },
  { title: "إدارة GTM", url: "/dashboard/gtm", icon: Code },
];

const quickActions = [
  { title: "إضافة مقال", url: "/dashboard/add-article", icon: Plus },
  { title: "إضافة مفهوم", url: "/dashboard/add-concept", icon: Plus },
  { title: "إضافة شرح", url: "/dashboard/add-tutorial", icon: Plus },
  { title: "إضافة ملف", url: "/dashboard/add-resource", icon: Plus },
  { title: "إضافة إنفوجرافيك", url: "/dashboard/add-infographic", icon: Plus },
  { title: "إضافة رابط", url: "/dashboard/add-favorite", icon: Plus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
      side="right"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>إدارة المحتوى</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-primary text-primary-foreground" : ""}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>إضافة سريعة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton asChild>
                    <Link to={action.url}>
                      <action.icon className="w-4 h-4" />
                      {!collapsed && <span>{action.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}