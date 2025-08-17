import { useState, useEffect } from "react";
import { getInfographics, type Infographic } from "@/lib/infographics-storage";
import { getCategories, type Category } from "@/lib/categories-storage";
import { InfographicCard } from "./InfographicCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function InfographicsSection() {
  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadInfographics = () => {
      console.log('InfographicsSection: loadInfographics called');
      const allInfographics = getInfographics();
      console.log('InfographicsSection: getInfographics returned:', allInfographics);
      console.log('InfographicsSection: Loading infographics:', allInfographics.length);
      // Show latest 6 infographics
      const displayInfographics = allInfographics.slice(0, 6);
      console.log('InfographicsSection: Display infographics:', displayInfographics);
      setInfographics(displayInfographics);
    };

    const loadCategories = () => {
      const allCategories = getCategories();
      // ترتيب الفلاتر حسب الترتيب المحفوظ
      const sortedCategories = [...allCategories].sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    loadInfographics();
    loadCategories();

    // Listen for updates
    const handleInfographicsUpdate = () => {
      console.log('InfographicsSection: infographicsUpdated event received');
      loadInfographics();
    };
    const handleInfographicsReordered = () => {
      console.log('InfographicsSection: infographicsReordered event received');
      loadInfographics();
    };
    const handleCategoriesUpdate = () => loadCategories();
    
    window.addEventListener('infographicsUpdated', handleInfographicsUpdate);
    window.addEventListener('infographicsReordered', handleInfographicsReordered);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('infographicsUpdated', handleInfographicsUpdate);
      window.removeEventListener('infographicsReordered', handleInfographicsReordered);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  // إضافة useEffect إضافي للتأكد من تحديث البيانات
  useEffect(() => {
    console.log('InfographicsSection: infographics state changed:', infographics.length);
  }, [infographics]);

  // إضافة useEffect إضافي للتأكد من تحديث البيانات
  useEffect(() => {
    console.log('InfographicsSection: categories state changed:', categories.length);
  }, [categories]);

  // إضافة useEffect إضافي للتأكد من تحديث البيانات
  useEffect(() => {
    console.log('InfographicsSection: Component re-rendered');
  });

  // إضافة useEffect إضافي للتأكد من تحديث البيانات
  useEffect(() => {
    console.log('InfographicsSection: Component mounted');
  }, []);

  // إضافة useEffect إضافي للتأكد من تحديث البيانات
  useEffect(() => {
    console.log('InfographicsSection: Component mounted');
  }, []);

  if (infographics.length === 0) {
    console.log('InfographicsSection: No infographics to display');
    return null;
  }

  console.log('InfographicsSection: Displaying', infographics.length, 'infographics');

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              الإنفوجرافيكات
            </h2>
            <p className="text-muted-foreground">
              مجموعة من الإنفوجرافيكات التوضيحية المفيدة
            </p>
          </div>
          <Link to="/infographics">
            <Button variant="outline" className="flex items-center gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infographics.map((infographic) => {
            console.log('InfographicsSection: Rendering infographic:', infographic.id, infographic.title);
            return (
              <InfographicCard
                key={`${infographic.id}-${infographic.thumbnailUrl}`}
                id={infographic.id}
                title={infographic.title}
                description={infographic.description}
                thumbnailUrl={infographic.thumbnailUrl}
                category={infographic.category}
                views={infographic.views}
                likes={infographic.likes}
                downloads={infographic.downloads}
                slug={infographic.slug}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}