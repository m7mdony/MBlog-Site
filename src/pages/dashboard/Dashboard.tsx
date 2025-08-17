import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  FileText, 
  Lightbulb, 
  Image, 
  BookOpen, 
  Heart, 
  Settings, 
  BarChart3,
  Code,
  User,
  MessageSquare,
  Target,
  RefreshCw,
  Database,
  Shield,
  Download,
  Upload
} from 'lucide-react';
import { checkStorageHealth, restoreFromBackup, createManualBackup, getBackupInfo, exportDataToFile, importDataFromFile, cleanupOldBackups, validateDataIntegrity } from '../../lib/storage';

const Dashboard: React.FC = () => {
  const [storageHealth, setStorageHealth] = useState<any>(null);
  const [backupInfo, setBackupInfo] = useState<any>(null);
  const [dataIntegrity, setDataIntegrity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileInputRef] = useState(React.useRef<HTMLInputElement>(null));

  useEffect(() => {
    // Check storage health on component mount
    const health = checkStorageHealth();
    setStorageHealth(health);
    
    // Get backup info
    const backup = getBackupInfo();
    setBackupInfo(backup);
    
    // Validate data integrity
    const integrity = validateDataIntegrity();
    setDataIntegrity(integrity);
  }, []);

  const handleStorageHealthCheck = () => {
    const health = checkStorageHealth();
    setStorageHealth(health);
  };

  const handleRestoreFromBackup = async () => {
    setIsLoading(true);
    try {
      const success = restoreFromBackup();
      if (success) {
        // Refresh health check
        setTimeout(() => {
          const health = checkStorageHealth();
          setStorageHealth(health);
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error restoring from backup:', error);
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const success = createManualBackup();
      if (success) {
        // Refresh health check
        setTimeout(() => {
          const health = checkStorageHealth();
          setStorageHealth(health);
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    exportDataToFile();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      importDataFromFile(file).then((success) => {
        if (success) {
          // Refresh all data
          setTimeout(() => {
            const health = checkStorageHealth();
            const backup = getBackupInfo();
            const integrity = validateDataIntegrity();
            setStorageHealth(health);
            setBackupInfo(backup);
            setDataIntegrity(integrity);
            setIsLoading(false);
          }, 1000);
        } else {
          setIsLoading(false);
        }
      });
    }
  };

  const handleCleanupBackups = () => {
    cleanupOldBackups();
    setTimeout(() => {
      const backup = getBackupInfo();
      setBackupInfo(backup);
    }, 500);
  };

  const handleValidateData = () => {
    const integrity = validateDataIntegrity();
    setDataIntegrity(integrity);
  };

  const dashboardItems = [
    {
      title: 'إدارة المقالات',
      description: 'إضافة وتعديل وحذف المقالات',
      icon: FileText,
      link: '/dashboard/articles',
      color: 'bg-blue-500'
    },
    {
      title: 'إدارة المفاهيم',
      description: 'إدارة المفاهيم والمصطلحات',
      icon: Lightbulb,
      link: '/dashboard/concepts',
      color: 'bg-green-500'
    },
    {
      title: 'إدارة الإنفوجرافيك',
      description: 'إدارة الرسوم البيانية والصور',
      icon: Image,
      link: '/dashboard/infographics',
      color: 'bg-purple-500'
    },
    {
      title: 'إدارة الموارد',
      description: 'إدارة الملفات والموارد',
      icon: BookOpen,
      link: '/dashboard/resources',
      color: 'bg-orange-500'
    },
    {
      title: 'إدارة الدروس',
      description: 'إدارة الدروس التعليمية',
      icon: BookOpen,
      link: '/dashboard/tutorials',
      color: 'bg-indigo-500'
    },
    {
      title: 'إدارة المفضلة',
      description: 'إدارة المحتويات المفضلة',
      icon: Heart,
      link: '/dashboard/favorites',
      color: 'bg-red-500'
    },
    {
      title: 'إدارة "حول مريم"',
      description: 'إدارة الأقسام والمهارات والتعليم والشهادات',
      icon: User,
      link: '/dashboard/about',
      color: 'bg-emerald-500'
    },
    {
      title: 'إدارة الإحصائيات',
      description: 'عرض وإدارة إحصائيات الموقع',
      icon: BarChart3,
      link: '/dashboard/stats',
      color: 'bg-teal-500'
    },
    {
      title: 'إدارة GTM',
      description: 'إدارة Google Tag Manager والإحصائيات',
      icon: Code,
      link: '/dashboard/gtm',
      color: 'bg-gray-500'
    },
    {
      title: 'إعدادات الملف الشخصي',
      description: 'تعديل معلومات الملف الشخصي',
      icon: User,
      link: '/dashboard/profile',
      color: 'bg-pink-500'
    },
    {
      title: 'إدارة الاتصال',
      description: 'إدارة معلومات الاتصال',
      icon: MessageSquare,
      link: '/dashboard/contact',
      color: 'bg-cyan-500'
    },
    {
      title: 'إدارة CTA',
      description: 'إدارة أزرار الدعوة للعمل',
      icon: Target,
      link: '/dashboard/cta',
      color: 'bg-yellow-500'
    },
    {
      title: 'إعدادات الأقسام',
      description: 'إدارة إعدادات أقسام الموقع',
      icon: Settings,
      link: '/dashboard/sections',
      color: 'bg-gray-600'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">لوحة التحكم</h1>
        <p className="text-lg text-gray-600">
          مرحباً بك في لوحة تحكم موقع مريم بسيمان. اختر القسم الذي تريد إدارته.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${item.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-gray-600">
                  {item.description}
                </CardDescription>
                <Button asChild className="w-full">
                  <Link to={item.link}>
                    فتح الإدارة
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* قسم سريع للعمليات المهمة */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">عمليات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <RefreshCw className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">تصفير الإحصائيات</h3>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                تصفير جميع الإحصائيات لبدء العد من جديد
              </p>
              <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                <Link to="/dashboard/gtm">الذهاب إلى GTM</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Code className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">إعداد GTM</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                إعداد Google Tag Manager لتتبع الزوار
              </p>
              <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link to="/dashboard/gtm">إعداد GTM</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">عرض الإحصائيات</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">
                عرض إحصائيات الموقع الحالية
              </p>
              <Button asChild variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                <Link to="/dashboard/stats">عرض الإحصائيات</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* قسم إدارة التخزين والنسخ الاحتياطية */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">إدارة التخزين والنسخ الاحتياطية</h2>
        
        {/* حالة التخزين */}
        <div className="mb-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                حالة التخزين
              </CardTitle>
            </CardHeader>
            <CardContent>
              {storageHealth ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">الحالة العامة:</span>
                    <Badge variant={storageHealth.isHealthy ? "default" : "destructive"}>
                      {storageHealth.isHealthy ? "✅ سليم" : "❌ مشاكل"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">عدد المفاهيم:</span>
                    <span className="text-sm">{storageHealth.totalConcepts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">آخر حفظ:</span>
                    <span className="text-sm">{storageHealth.lastSaveTime || "غير متوفر"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">حجم التخزين:</span>
                    <span className="text-sm">{(storageHealth.storageSize / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">نسخة احتياطية:</span>
                    <Badge variant={storageHealth.hasBackup ? "default" : "secondary"}>
                      {storageHealth.hasBackup ? "✅ متوفرة" : "❌ غير متوفرة"}
                    </Badge>
                  </div>
                  {storageHealth.issues.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <span className="text-sm font-medium text-red-800">المشاكل المكتشفة:</span>
                      <ul className="mt-2 space-y-1">
                        {storageHealth.issues.map((issue: string, index: number) => (
                          <li key={index} className="text-sm text-red-700">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">جاري فحص حالة التخزين...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* معلومات النسخ الاحتياطية */}
        {backupInfo && (
          <div className="mb-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  معلومات النسخ الاحتياطية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800">النسخة الرئيسية</div>
                    <div className="text-xs text-green-600 mt-1">
                      {backupInfo.mainBackup.exists ? "✅ متوفرة" : "❌ غير متوفرة"}
                    </div>
                    {backupInfo.mainBackup.exists && (
                      <div className="text-xs text-green-600 mt-1">
                        {(backupInfo.mainBackup.size / 1024).toFixed(2)} KB
                      </div>
                    )}
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">نسخة يدوية</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {backupInfo.manualBackup.exists ? "✅ متوفرة" : "❌ غير متوفرة"}
                    </div>
                    {backupInfo.manualBackup.exists && (
                      <div className="text-xs text-blue-600 mt-1">
                        {(backupInfo.manualBackup.size / 1024).toFixed(2)} KB
                      </div>
                    )}
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-orange-800">نسخة مستعادة</div>
                    <div className="text-xs text-orange-600 mt-1">
                      {backupInfo.restoredBackup.exists ? "✅ متوفرة" : "❌ غير متوفرة"}
                    </div>
                    {backupInfo.restoredBackup.exists && (
                      <div className="text-xs text-orange-600 mt-1">
                        {(backupInfo.restoredBackup.size / 1024).toFixed(2)} KB
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* صحة البيانات */}
        {dataIntegrity && (
          <div className="mb-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  صحة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">حالة البيانات:</span>
                    <Badge variant={dataIntegrity.isValid ? "default" : "destructive"}>
                      {dataIntegrity.isValid ? "✅ صحيحة" : "❌ مشاكل"}
                    </Badge>
                  </div>
                  {dataIntegrity.issues.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <span className="text-sm font-medium text-red-800">المشاكل المكتشفة:</span>
                      <ul className="mt-2 space-y-1">
                        {dataIntegrity.issues.map((issue: string, index: number) => (
                          <li key={index} className="text-sm text-red-700">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dataIntegrity.suggestions.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <span className="text-sm font-medium text-blue-800">التوصيات:</span>
                      <ul className="mt-2 space-y-1">
                        {dataIntegrity.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-blue-700">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* أزرار إدارة التخزين */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">فحص حالة التخزين</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                فحص صحة البيانات وسلامة التخزين
              </p>
              <Button 
                onClick={handleStorageHealthCheck}
                disabled={isLoading}
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-100 w-full"
              >
                {isLoading ? "جاري الفحص..." : "فحص التخزين"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Download className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">إنشاء نسخة احتياطية</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">
                إنشاء نسخة احتياطية يدوية من البيانات الحالية
              </p>
              <Button 
                onClick={handleCreateBackup}
                disabled={isLoading}
                variant="outline" 
                className="border-green-300 text-green-700 hover:bg-green-100 w-full"
              >
                {isLoading ? "جاري الإنشاء..." : "إنشاء نسخة احتياطية"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">استعادة من نسخة احتياطية</h3>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                استعادة البيانات من آخر نسخة احتياطية متوفرة
              </p>
              <Button 
                onClick={handleRestoreFromBackup}
                disabled={isLoading || !storageHealth?.hasBackup}
                variant="outline" 
                className="border-orange-300 text-orange-700 hover:bg-orange-100 w-full"
              >
                {isLoading ? "جاري الاستعادة..." : "استعادة البيانات"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">فحص صحة البيانات</h3>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                فحص سلامة واتساق البيانات المخزنة
              </p>
              <Button 
                onClick={handleValidateData}
                disabled={isLoading}
                variant="outline" 
                className="border-purple-300 text-purple-700 hover:bg-purple-100 w-full"
              >
                {isLoading ? "جاري الفحص..." : "فحص صحة البيانات"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* أزرار إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Download className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-800">تصدير البيانات</h3>
              </div>
              <p className="text-sm text-indigo-700 mb-3">
                تصدير جميع البيانات إلى ملف JSON
              </p>
              <Button 
                onClick={handleExportData}
                disabled={isLoading}
                variant="outline" 
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 w-full"
              >
                تصدير البيانات
              </Button>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold text-teal-800">استيراد البيانات</h3>
              </div>
              <p className="text-sm text-teal-700 mb-3">
                استيراد البيانات من ملف JSON
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                variant="outline" 
                className="border-teal-300 text-teal-700 hover:bg-teal-100 w-full"
              >
                {isLoading ? "جاري الاستيراد..." : "استيراد البيانات"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">تنظيف النسخ القديمة</h3>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                حذف النسخ الاحتياطية القديمة تلقائياً
              </p>
              <Button 
                onClick={handleCleanupBackups}
                disabled={isLoading}
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-100 w-full"
              >
                تنظيف النسخ القديمة
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <RefreshCw className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">تحديث جميع البيانات</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                تحديث جميع البيانات والمعلومات
              </p>
              <Button 
                onClick={() => {
                  const health = checkStorageHealth();
                  const backup = getBackupInfo();
                  const integrity = validateDataIntegrity();
                  setStorageHealth(health);
                  setBackupInfo(backup);
                  setDataIntegrity(integrity);
                }}
                disabled={isLoading}
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100 w-full"
              >
                تحديث البيانات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 