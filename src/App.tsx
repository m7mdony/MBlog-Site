import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import AllConcepts from "./pages/AllConcepts";
import AllTutorials from "./pages/AllTutorials";
import AllResources from "./pages/AllResources";
import AllFavorites from "./pages/AllFavorites";
import AllInfographics from "./pages/AllInfographics";
import AllArticles from "./pages/AllArticles";
import InfographicView from "./pages/InfographicView";
import Index from "./pages/Index";
import ConceptView from "./pages/ConceptView";
import TutorialView from "./pages/TutorialView";
import ResourceView from "./pages/ResourceView";
import FavoriteView from "./pages/FavoriteView";
import AboutMariam from "./pages/AboutMariam";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import ConceptsManagementAdvanced from "./pages/dashboard/ConceptsManagementAdvanced";
import TutorialsManagement from "./pages/dashboard/TutorialsManagement";
import ResourcesManagement from "./pages/dashboard/ResourcesManagement";
import FavoritesManagement from "./pages/dashboard/FavoritesManagement";
import FiltersManagement from "./pages/dashboard/FiltersManagement";
import AddConcept from "./pages/dashboard/AddConcept";
import AddArticle from "./pages/dashboard/AddArticle";
import AddTutorial from "./pages/dashboard/AddTutorial";
import AddResource from "./pages/dashboard/AddResource";
import AddFavorite from "./pages/dashboard/AddFavorite";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import Analytics from "./pages/dashboard/Analytics";
import AboutManagement from "./pages/dashboard/AboutManagement";
import ContactManagement from "./pages/dashboard/ContactManagement";
import CTAManagement from "./pages/dashboard/CTAManagement";
import ConsultationButtonManagement from "./pages/dashboard/ConsultationButtonManagement";
import SectionSettings from "./pages/dashboard/SectionSettings";
import NotFound from "./pages/NotFound";
import ArticlesManagement from "./pages/dashboard/ArticlesManagement";
import StatsManagement from "./pages/dashboard/StatsManagement";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import EditArticle from "./pages/dashboard/EditArticle";
import InfographicsManagement from "./pages/dashboard/InfographicsManagement";
import AddInfographic from "./pages/dashboard/AddInfographic";
import EditInfographic from "./pages/dashboard/EditInfographic";
import GTMManagement from "./pages/dashboard/GTMManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/all-articles" element={<AllArticles />} />
          <Route path="/all-concepts" element={<AllConcepts />} />
          <Route path="/tutorials" element={<AllTutorials />} />
          <Route path="/resources" element={<AllResources />} />
          <Route path="/favorites" element={<AllFavorites />} />
          <Route path="/infographics" element={<AllInfographics />} />
          <Route path="/infographics/:slug" element={<InfographicView />} />
          <Route path="/concept/:id" element={<ConceptView />} />
          <Route path="/tutorial/:id" element={<TutorialView />} />
          <Route path="/resource/:id" element={<ResourceView />} />
          <Route path="/favorite/:id" element={<FavoriteView />} />
          <Route path="/about" element={<AboutMariam />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Dashboard Layout with Sidebar
const DashboardLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full" dir="rtl">
      <AppSidebar />
      <main className="flex-1 transition-all duration-300">
        <header className="h-12 flex items-center justify-between border-b bg-background px-4 sticky top-0 z-10">
          <h1 className="text-lg font-semibold">لوحة التحكم</h1>
          <SidebarTrigger />
        </header>
        <div className="overflow-auto p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="concepts" element={<ConceptsManagementAdvanced />} />
            <Route path="concepts/new" element={<AddConcept />} />
            <Route path="add-concept" element={<AddConcept />} />
            <Route path="add-article" element={<AddArticle />} />
            <Route path="edit-article/:id" element={<EditArticle />} />
            <Route path="articles" element={<ArticlesManagement />} />
            <Route path="stats" element={<StatsManagement />} />
            <Route path="concepts/hidden" element={<div className="p-6"><h1 className="text-2xl font-bold">المحتوى المخفي</h1><p className="text-muted-foreground">قريباً...</p></div>} />
            <Route path="tutorials" element={<TutorialsManagement />} />
            <Route path="tutorials/new" element={<AddTutorial />} />
            <Route path="add-tutorial" element={<AddTutorial />} />
            <Route path="resources" element={<ResourcesManagement />} />
            <Route path="resources/new" element={<AddResource />} />
            <Route path="add-resource" element={<AddResource />} />
            <Route path="infographics" element={<InfographicsManagement />} />
            <Route path="add-infographic" element={<AddInfographic />} />
            <Route path="edit-infographic/:id" element={<EditInfographic />} />
            <Route path="favorites" element={<FavoritesManagement />} />
            <Route path="favorites/new" element={<AddFavorite />} />
            <Route path="add-favorite" element={<AddFavorite />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="filters" element={<FiltersManagement />} />
            <Route path="sections" element={<SectionSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="about" element={<AboutManagement />} />
            <Route path="contact" element={<ContactManagement />} />
            <Route path="consultation-button" element={<ConsultationButtonManagement />} />
            <Route path="cta" element={<CTAManagement />} />
            <Route path="gtm" element={<GTMManagement />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  </SidebarProvider>
);

export default App;
