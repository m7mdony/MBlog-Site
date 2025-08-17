import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Image,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import DraggableContentList from './DraggableContentList';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isInfographic?: boolean;
  order: number;
  type: 'concept' | 'infographic' | 'tutorial' | 'resource';
}

interface ContentOrderManagementProps {
  className?: string;
  onOrderChange?: (type: string, newOrder: ContentItem[]) => void;
}

const ContentOrderManagement: React.FC<ContentOrderManagementProps> = ({
  className = '',
  onOrderChange,
}) => {
  const [activeTab, setActiveTab] = useState('concepts');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // بيانات تجريبية للمفاهيم
  const [concepts, setConcepts] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'كيفية بناء استراتيجية تسويق رقمية ناجحة',
      imageUrl: '/src/assets/hero-bg.jpg',
      views: 1250,
      likes: 89,
      comments: 23,
      order: 1,
      type: 'concept'
    },
    {
      id: '2',
      title: 'أساسيات إدارة المشاريع الحديثة',
      imageUrl: '/src/assets/hero-profile.jpg',
      views: 890,
      likes: 45,
      comments: 12,
      order: 2,
      type: 'concept'
    },
    {
      id: '3',
      title: 'التقنيات الحديثة في ريادة الأعمال',
      imageUrl: '/src/assets/hero-bg.jpg',
      views: 2100,
      likes: 156,
      comments: 34,
      order: 3,
      type: 'concept'
    }
  ]);

  // بيانات تجريبية للإنفوجرافيك
  const [infographics, setInfographics] = useState<ContentItem[]>([
    {
      id: '4',
      title: 'دليل شامل لريادة الأعمال',
      imageUrl: '/src/assets/hero-profile.jpg',
      views: 3420,
      likes: 156,
      comments: 67,
      isInfographic: true,
      order: 1,
      type: 'infographic'
    },
    {
      id: '5',
      title: 'خريطة طريق النجاح في ريادة الأعمال',
      imageUrl: '/src/assets/hero-bg.jpg',
      views: 5670,
      likes: 320,
      comments: 89,
      isInfographic: true,
      order: 2,
      type: 'infographic'
    },
    {
      id: '6',
      title: 'أساسيات التسويق الرقمي',
      imageUrl: '/src/assets/hero-profile.jpg',
      views: 1890,
      likes: 98,
      comments: 45,
      isInfographic: true,
      order: 3,
      type: 'infographic'
    }
  ]);

  // بيانات تجريبية للشروحات
  const [tutorials, setTutorials] = useState<ContentItem[]>([
    {
      id: '7',
      title: 'تعلم Notion من الصفر',
      imageUrl: '/src/assets/hero-bg.jpg',
      views: 890,
      likes: 67,
      comments: 23,
      order: 1,
      type: 'tutorial'
    },
    {
      id: '8',
      title: 'أساسيات Figma للمبتدئين',
      imageUrl: '/src/assets/hero-profile.jpg',
      views: 1200,
      likes: 89,
      comments: 34,
      order: 2,
      type: 'tutorial'
    }
  ]);

  // بيانات تجريبية للمصادر
  const [resources, setResources] = useState<ContentItem[]>([
    {
      id: '9',
      title: 'قوالب إدارة المشاريع',
      imageUrl: '/src/assets/hero-bg.jpg',
      views: 450,
      likes: 34,
      comments: 12,
      order: 1,
      type: 'resource'
    },
    {
      id: '10',
      title: 'أدوات تحسين الإنتاجية',
      imageUrl: '/src/assets/hero-profile.jpg',
      views: 670,
      likes: 56,
      comments: 18,
      order: 2,
      type: 'resource'
    }
  ]);

  const handleConceptsOrderChange = (newOrder: ContentItem[]) => {
    setConcepts(newOrder);
    setHasUnsavedChanges(true);
    onOrderChange?.('concepts', newOrder);
  };

  const handleInfographicsOrderChange = (newOrder: ContentItem[]) => {
    setInfographics(newOrder);
    setHasUnsavedChanges(true);
    onOrderChange?.('infographics', newOrder);
  };

  const handleTutorialsOrderChange = (newOrder: ContentItem[]) => {
    setTutorials(newOrder);
    setHasUnsavedChanges(true);
    onOrderChange?.('tutorials', newOrder);
  };

  const handleResourcesOrderChange = (newOrder: ContentItem[]) => {
    setResources(newOrder);
    setHasUnsavedChanges(true);
    onOrderChange?.('resources', newOrder);
  };

  const handleSaveAllChanges = () => {
    try {
      // حفظ جميع التغييرات
      localStorage.setItem('mariam_bassitman_concepts_order', JSON.stringify(concepts));
      localStorage.setItem('mariam_bassitman_infographics_order', JSON.stringify(infographics));
      localStorage.setItem('mariam_bassitman_tutorials_order', JSON.stringify(tutorials));
      localStorage.setItem('mariam_bassitman_resources_order', JSON.stringify(resources));
      
      setHasUnsavedChanges(false);
      toast.success('تم حفظ جميع التغييرات بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ التغييرات');
      console.error('Error saving changes:', error);
    }
  };

  const handleResetAllChanges = () => {
    // إعادة تحميل البيانات الأصلية
    setConcepts([...concepts]);
    setInfographics([...infographics]);
    setTutorials([...tutorials]);
    setResources([...resources]);
    setHasUnsavedChanges(false);
    toast.info('تم إعادة جميع التغييرات');
  };

  const handleItemClick = (item: ContentItem) => {
    console.log('تم النقر على:', item.title);
    // يمكن إضافة منطق التنقل هنا
  };

  const handleItemOptionsClick = (item: ContentItem) => {
    console.log('خيارات:', item.title);
    // يمكن إضافة قائمة خيارات هنا
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  إدارة ترتيب المحتوى
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  اسحب وأفلت العناصر لإعادة ترتيبها حسب الأولوية
                </p>
              </div>
            </div>

            {/* Global Action Buttons */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                onClick={handleResetAllChanges}
                disabled={!hasUnsavedChanges || isDragging}
                className="text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين الكل
              </Button>

              <Button
                onClick={handleSaveAllChanges}
                disabled={!hasUnsavedChanges || isDragging}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ جميع التغييرات
              </Button>
            </div>
          </div>

          {/* Global Status */}
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 space-x-reverse text-amber-600 bg-amber-50 p-3 rounded-lg mt-4">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">يوجد تغييرات غير محفوظة. تأكد من حفظ التغييرات قبل المغادرة.</span>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="concepts" className="flex items-center space-x-2 space-x-reverse">
            <FileText className="w-4 h-4" />
            <span>المفاهيم</span>
            <Badge variant="secondary" className="ml-1">
              {concepts.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="infographics" className="flex items-center space-x-2 space-x-reverse">
            <Image className="w-4 h-4" />
            <span>الإنفوجرافيك</span>
            <Badge variant="secondary" className="ml-1">
              {infographics.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="tutorials" className="flex items-center space-x-2 space-x-reverse">
            <BarChart3 className="w-4 h-4" />
            <span>الشروحات</span>
            <Badge variant="secondary" className="ml-1">
              {infographics.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="resources" className="flex items-center space-x-2 space-x-reverse">
            <FileText className="w-4 h-4" />
            <span>المصادر</span>
            <Badge variant="secondary" className="ml-1">
              {resources.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Concepts Tab */}
        <TabsContent value="concepts" className="mt-6">
          <DraggableContentList
            title="ترتيب المفاهيم"
            items={concepts}
            onOrderChange={handleConceptsOrderChange}
            onItemClick={handleItemClick}
            onItemOptionsClick={handleItemOptionsClick}
            storageKey="mariam_bassitman_concepts_order"
            showSaveButton={false}
            showResetButton={false}
          />
        </TabsContent>

        {/* Infographics Tab */}
        <TabsContent value="infographics" className="mt-6">
          <DraggableContentList
            title="ترتيب الإنفوجرافيك"
            items={infographics}
            onOrderChange={handleInfographicsOrderChange}
            onItemClick={handleItemClick}
            onItemOptionsClick={handleItemOptionsClick}
            storageKey="mariam_bassitman_infographics_order"
            showSaveButton={false}
            showResetButton={false}
          />
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="mt-6">
          <DraggableContentList
            title="ترتيب الشروحات"
            items={tutorials}
            onOrderChange={handleTutorialsOrderChange}
            onItemClick={handleItemClick}
            onItemOptionsClick={handleItemOptionsClick}
            storageKey="mariam_bassitman_tutorials_order"
            showSaveButton={false}
            showResetButton={false}
          />
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <DraggableContentList
            title="ترتيب المصادر"
            items={resources}
            onOrderChange={handleResourcesOrderChange}
            onItemClick={handleItemClick}
            onItemOptionsClick={handleItemOptionsClick}
            storageKey="mariam_bassitman_resources_order"
            showSaveButton={false}
            showResetButton={false}
          />
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3 space-x-reverse">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-blue-800">
              <h4 className="font-medium mb-2">تعليمات الاستخدام:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside space-x-reverse">
                <li>اسحب العناصر باستخدام أيقونة القبضة (⋮⋮) لإعادة ترتيبها</li>
                <li>يمكنك التنقل بين أنواع المحتوى المختلفة باستخدام التبويبات</li>
                <li>احفظ التغييرات بعد إعادة الترتيب لتطبيقها</li>
                <li>يمكنك إعادة تعيين الترتيب الأصلي في أي وقت</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentOrderManagement; 