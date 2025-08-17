import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Eye, GripVertical, Download, Upload, Shield, RotateCcw, Database } from "lucide-react";
import { 
  getInfographics, 
  deleteInfographic, 
  resetInfographicsStats, 
  reorderInfographics, 
  checkInfographicsStorageHealth,
  restoreInfographicsFromBackup,
  createManualBackup,
  exportInfographicsData,
  importInfographicsDataFromFile,
  forceStorageCleanup,
  type Infographic 
} from "@/lib/infographics-storage";
import { getCategories, type Category } from "@/lib/categories-storage";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import ContentCard from "@/components/ContentCard";

export default function InfographicsManagement() {
  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storageHealth, setStorageHealth] = useState<any>(null);
  const [showHealthDetails, setShowHealthDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadInfographics();
    loadCategories();
    checkStorageHealth();
    
    const handleInfographicsUpdate = () => {
      loadInfographics();
    };
    
    const handleCategoriesUpdate = () => {
      loadCategories();
    };
    
    window.addEventListener('infographicsUpdated', handleInfographicsUpdate);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('infographicsUpdated', handleInfographicsUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  const loadInfographics = () => {
    const data = getInfographics();
    setInfographics(data);
  };

  const loadCategories = () => {
    const allCategories = getCategories();
    // ترتيب الفلاتر حسب الترتيب المحفوظ
    const sortedCategories = [...allCategories].sort((a, b) => a.order - b.order);
    setCategories(sortedCategories);
  };

  const checkStorageHealth = () => {
    const health = checkInfographicsStorageHealth();
    setStorageHealth(health);
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف "${title}"؟`)) {
      try {
        deleteInfographic(id);
        toast({
          title: "تم الحذف",
          description: "تم حذف الإنفوجرافيك بنجاح",
        });
        loadInfographics();
        checkStorageHealth();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف الإنفوجرافيك",
          variant: "destructive"
        });
      }
    }
  };

  const handleResetStats = () => {
    if (window.confirm("هل أنت متأكد من تصفير جميع إحصائيات الإنفوجرافيك؟")) {
      try {
        resetInfographicsStats();
        toast({
          title: "تم تصفير الإحصائيات",
          description: "تم تصفير جميع إحصائيات الإنفوجرافيك بنجاح",
        });
        loadInfographics();
        checkStorageHealth();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تصفير الإحصائيات",
          variant: "destructive"
        });
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    try {
      // إعادة ترتيب الإنفوجرافيك
      reorderInfographics(startIndex, endIndex);
      
      toast({
        title: "تم إعادة الترتيب",
        description: `تم نقل الإنفوجرافيك من المركز ${startIndex + 1} إلى المركز ${endIndex + 1}`,
      });
      
      loadInfographics();
      checkStorageHealth();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إعادة الترتيب",
        variant: "destructive"
      });
    }
  };

  const handleCreateBackup = () => {
    try {
      const success = createManualBackup();
      if (success) {
        toast({
          title: "تم إنشاء النسخة الاحتياطية",
          description: "تم إنشاء نسخة احتياطية جديدة بنجاح",
        });
        checkStorageHealth();
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إنشاء النسخة الاحتياطية",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive"
      });
    }
  };

  const handleRestoreFromBackup = () => {
    if (window.confirm("هل أنت متأكد من استعادة البيانات من النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.")) {
      try {
        const success = restoreInfographicsFromBackup();
        if (success) {
          toast({
            title: "تم الاستعادة",
            description: "تم استعادة البيانات من النسخة الاحتياطية بنجاح",
          });
          loadInfographics();
          checkStorageHealth();
        } else {
          toast({
            title: "خطأ",
            description: "فشل في استعادة البيانات من النسخة الاحتياطية",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء استعادة البيانات",
          variant: "destructive"
        });
      }
    }
  };

  const handleExportData = () => {
    try {
      const jsonData = exportInfographicsData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `infographics-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "تم التصدير",
        description: "تم تصدير بيانات الإنفوجرافيك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive"
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (window.confirm("هل أنت متأكد من استيراد البيانات؟ سيتم استبدال البيانات الحالية.")) {
      importInfographicsDataFromFile(file).then((success) => {
        if (success) {
          toast({
            title: "تم الاستيراد",
            description: "تم استيراد بيانات الإنفوجرافيك بنجاح",
          });
          loadInfographics();
          checkStorageHealth();
        } else {
          toast({
            title: "خطأ",
            description: "فشل في استيراد البيانات",
            variant: "destructive"
          });
        }
      }).catch((error) => {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء استيراد البيانات",
          variant: "destructive"
        });
      });
    }
    
    // إعادة تعيين قيمة input
    event.target.value = '';
  };

  const handleForceCleanup = () => {
    if (window.confirm("هل أنت متأكد من تنظيف التخزين الإجباري؟ سيتم حذف جميع النسخ الاحتياطية القديمة وعلامات الإعجاب.")) {
      try {
        const success = forceStorageCleanup();
        if (success) {
          toast({
            title: "تم التنظيف",
            description: "تم تنظيف التخزين بنجاح",
          });
          checkStorageHealth();
        } else {
          toast({
            title: "خطأ",
            description: "فشل في تنظيف التخزين",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تنظيف التخزين",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الإنفوجرافيكات</h1>
          <p className="text-muted-foreground">إدارة وتعديل ترتيب الإنفوجرافيكات المعروضة</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetStats}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            تصفير الإحصائيات
          </Button>
          <Button asChild>
            <Link to="/dashboard/add-infographic" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة إنفوجرافيك جديد
            </Link>
          </Button>
        </div>
      </div>

      {/* معلومات صحة التخزين */}
      {storageHealth && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              حالة التخزين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${
                  storageHealth.isHealthy ? 'text-green-600' : 'text-red-600'
                }`}>
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">
                    {storageHealth.isHealthy ? 'صحي' : 'مشاكل موجودة'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {storageHealth.totalInfographics} إنفوجرافيك
                </span>
                {storageHealth.hasBackup && (
                  <span className="text-sm text-blue-600">نسخة احتياطية متوفرة</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHealthDetails(!showHealthDetails)}
              >
                {showHealthDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              </Button>
            </div>
            
            {showHealthDetails && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">آخر حفظ:</span>
                    <span className="text-muted-foreground ml-2">
                      {storageHealth.lastSaveTime || 'غير محدد'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">حجم التخزين:</span>
                    <span className="text-muted-foreground ml-2">
                      {(storageHealth.storageSize / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">المساحة المتاحة:</span>
                    <span className="text-muted-foreground ml-2">
                      {(storageHealth.availableSpace / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">نسبة الاستخدام:</span>
                    <span className={`ml-2 ${
                      (storageHealth.storageSize / storageHealth.availableSpace) > 0.8 
                        ? 'text-red-600 font-bold' 
                        : 'text-green-600'
                    }`}>
                      {((storageHealth.storageSize / storageHealth.availableSpace) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                {storageHealth.issues.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <span className="font-medium text-red-800">المشاكل:</span>
                    <ul className="mt-1 text-red-700">
                      {storageHealth.issues.map((issue: string, index: number) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <span className="font-medium text-blue-800">نصائح:</span>
                  <ul className="mt-1 text-blue-700">
                    <li>• يتم إنشاء نسخة احتياطية تلقائياً مع كل حفظ</li>
                    <li>• النظام يقوم بتنظيف التخزين تلقائياً عند الحاجة</li>
                    <li>• يمكنك تنظيف التخزين يدوياً باستخدام زر "تنظيف التخزين"</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* أزرار إدارة النسخ الاحتياطية */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Button
          variant="outline"
          onClick={handleCreateBackup}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          إنشاء نسخة احتياطية
        </Button>
        
        <Button
          variant="outline"
          onClick={handleRestoreFromBackup}
          className="flex items-center gap-2"
          disabled={!storageHealth?.hasBackup}
        >
          <RotateCcw className="h-4 w-4" />
          استعادة من النسخة الاحتياطية
        </Button>
        
        <Button
          variant="outline"
          onClick={handleExportData}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          تصدير البيانات
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="import-file"
          />
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full"
            asChild
          >
            <label htmlFor="import-file">
              <Upload className="h-4 w-4" />
              استيراد البيانات
            </label>
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={handleForceCleanup}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          تنظيف التخزين
        </Button>
      </div>

      {infographics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">لا توجد إنفوجرافيكات حالياً</p>
            <Button asChild>
              <Link to="/dashboard/add-infographic">
                <Plus className="h-4 w-4 mr-2" />
                إضافة أول إنفوجرافيك
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <GripVertical className="h-4 w-4" />
              <span className="font-medium">تعليمات السحب والإفلات:</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              اسحب الإنفوجرافيكات باستخدام المقبض الأزرق لإعادة ترتيبها. الترتيب الجديد سيتم حفظه تلقائياً.
            </p>
            <div className="mt-2 text-xs text-blue-600">
              💡 <strong>نصيحة:</strong> الترتيب الأول سيظهر في أعلى الصفحة الرئيسية
            </div>
            <div className="mt-2 text-xs text-blue-600">
              🔄 <strong>تحديث:</strong> التغييرات تُحفظ تلقائياً عند السحب والإفلات
            </div>
            <div className="mt-2 text-xs text-blue-600">
              🎯 <strong>المراكز:</strong> 🥇 الأول 🥈 الثاني 🥉 الثالث
            </div>
            <div className="mt-2 text-xs text-blue-600">
              📱 <strong>التخطيط:</strong> الصور صغيرة لتسهيل السحب والإفلات في شبكة متعددة الأعمدة
            </div>
            <div className="mt-2 text-xs text-blue-600">
              💾 <strong>النسخ الاحتياطية:</strong> يتم إنشاء نسخة احتياطية تلقائياً مع كل حفظ
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="infographics-list">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-200 ${
                    snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
                  }`}
                >
                  {infographics.map((infographic, index) => (
                    <Draggable
                      key={`${infographic.id}-${infographic.thumbnailUrl}`}
                      draggableId={infographic.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            ${snapshot.isDragging ? 'opacity-75 scale-105 rotate-1' : ''}
                            transition-all duration-200 ease-out
                          `}
                        >
                          <ContentCard
                            id={infographic.id.toString()}
                            index={index}
                            title={infographic.title}
                            imageUrl={infographic.thumbnailUrl}
                            views={infographic.views}
                            likes={infographic.likes}
                            comments={infographic.downloads}
                            isInfographic={true}
                            isDraggable={true}
                            showDragHandle={true}
                            compactMode={true}
                            className="w-full"
                            onOptionsClick={() => {
                              // يمكن إضافة قائمة خيارات هنا
                            }}
                            onClick={() => {
                              // يمكن إضافة معاينة الإنفوجرافيك هنا
                            }}
                          />
                          
                          {/* معلومات إضافية وأزرار الإدارة */}
                          <div className="mt-2 flex flex-col gap-2 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(infographic.views)} مشاهدة
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full border ${
                                index === 0 
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                                  : index === 1 
                                  ? 'bg-gray-50 text-gray-700 border-gray-200' 
                                  : index === 2 
                                  ? 'bg-orange-50 text-orange-700 border-orange-200' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {index === 0 ? '🥇 الأول' : index === 1 ? '🥈 الثاني' : index === 2 ? '🥉 الثالث' : `المركز ${index + 1}`}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{
                                  backgroundColor: categories.find(cat => cat.name === infographic.category)?.color + '20',
                                  color: categories.find(cat => cat.name === infographic.category)?.color,
                                  borderColor: categories.find(cat => cat.name === infographic.category)?.color + '40'
                                }}
                              >
                                {infographic.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full border">
                                الترتيب: {infographic.order}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild className="flex-1">
                                <Link to={`/dashboard/edit-infographic/${infographic.id}`}>
                                  <Edit className="h-3 w-3 mr-1" />
                                  تعديل
                                </Link>
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(infographic.id, infographic.title)}
                                className="flex-1"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                حذف
                              </Button>
                            </div>
                            
                            <Button size="sm" variant="ghost" asChild className="w-full">
                              <Link to={`/infographics/${infographic.slug}`} target="_blank">
                                <Eye className="h-3 w-3 mr-1" />
                                معاينة
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}