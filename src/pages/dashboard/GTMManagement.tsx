import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  getGTMSettings, 
  saveGTMSettings, 
  GTMSettings
} from '../../lib/gtm-manager';
import { resetAllStats } from '../../lib/storage';
import { 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  Settings, 
  BarChart3,
  RefreshCw
} from 'lucide-react';

const GTMManagement: React.FC = () => {
  const [settings, setSettings] = useState<GTMSettings>({
    gtmId: '',
    isEnabled: false,
    lastUpdated: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const currentSettings = getGTMSettings();
    setSettings(currentSettings);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (settings.isEnabled && !settings.gtmId.trim()) {
        setMessage({ type: 'error', text: 'يجب إدخال معرف GTM عند تفعيل الخدمة' });
        return;
      }

      saveGTMSettings(settings);
      setMessage({ type: 'success', text: 'تم حفظ إعدادات GTM بنجاح' });
      
      // تحديث الصفحة بعد ثانيتين
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetStats = async () => {
    setIsLoading(true);
    try {
      resetAllStats();
      setMessage({ type: 'success', text: 'تم تصفير جميع الإحصائيات بنجاح' });
      setShowResetConfirm(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تصفير الإحصائيات' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleString('ar-SA');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة Google Tag Manager</h1>
          <p className="text-gray-600 mt-2">
            إدارة إعدادات GTM وتصفير الإحصائيات
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* إعدادات GTM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>إعدادات Google Tag Manager</span>
            </CardTitle>
            <CardDescription>
              قم بإدخال معرف GTM وتفعيل الخدمة لتتبع زوار الموقع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gtmId">معرف GTM (GTM-XXXXXXX)</Label>
              <Input
                id="gtmId"
                placeholder="مثال: GTM-ABC1234"
                value={settings.gtmId}
                onChange={(e) => setSettings({ ...settings, gtmId: e.target.value })}
                className="font-mono"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isEnabled"
                checked={settings.isEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, isEnabled: checked })}
              />
              <Label htmlFor="isEnabled">تفعيل GTM</Label>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </CardContent>
        </Card>

        {/* معلومات GTM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>معلومات GTM</span>
            </CardTitle>
            <CardDescription>
              حالة الخدمة وتفاصيل التحديث
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">الحالة:</span>
                <Badge variant={settings.isEnabled ? 'default' : 'secondary'}>
                  {settings.isEnabled ? 'مفعل' : 'معطل'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">معرف GTM:</span>
                <span className="font-mono text-sm">
                  {settings.gtmId || 'غير محدد'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">آخر تحديث:</span>
                <span className="text-sm text-gray-500">
                  {formatDate(settings.lastUpdated)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="text-sm text-gray-600">
              <p className="mb-2">عند تفعيل GTM:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>سيتم إضافة كود التتبع في رأس الصفحة</li>
                <li>يمكن تتبع سلوك الزوار</li>
                <li>إمكانية إرسال أحداث مخصصة</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تصفير الإحصائيات */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <RefreshCw className="h-5 w-5" />
            <span>تصفير الإحصائيات</span>
          </CardTitle>
          <CardDescription className="text-orange-600">
            تحذير: هذا الإجراء سيصفير جميع الإحصائيات (المشاهدات، الإعجابات، التحميلات، التعليقات) 
            في جميع المحتويات. لا يمكن التراجع عن هذا الإجراء.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showResetConfirm ? (
            <Button 
              variant="destructive" 
              onClick={() => setShowResetConfirm(true)}
              className="w-full"
            >
              تصفير جميع الإحصائيات
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  هل أنت متأكد من رغبتك في تصفير جميع الإحصائيات؟ 
                  هذا الإجراء لا يمكن التراجع عنه.
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={handleResetStats}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'جاري التصفير...' : 'نعم، صفير الإحصائيات'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* تعليمات GTM */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">كيفية الحصول على معرف GTM</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>اذهب إلى <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Tag Manager</a></li>
            <li>قم بإنشاء حساب جديد أو اختر حساب موجود</li>
            <li>أنشئ حاوية جديدة للموقع</li>
            <li>انسخ معرف الحاوية (يبدأ بـ GTM-)</li>
            <li>أدخل المعرف في الحقل أعلاه</li>
            <li>قم بتفعيل الخدمة</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default GTMManagement; 