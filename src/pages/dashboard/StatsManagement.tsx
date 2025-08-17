
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { resetAllStats } from "@/lib/storage";
import { toast } from "sonner";
import { BarChart3, RefreshCcw, CheckCircle } from "lucide-react";

export default function StatsManagement() {
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    // Auto-reset stats on component mount
    handleResetStats();
  }, []);

  const handleResetStats = () => {
    try {
      resetAllStats();
      setIsReset(true);
      toast.success("تم تصفير جميع الإحصائيات بنجاح - بدء الرصد من الآن");
    } catch (error) {
      toast.error("حدث خطأ أثناء تصفير الإحصائيات");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          إدارة الإحصائيات
        </h1>
        <p className="text-muted-foreground">إدارة وتصفير إحصائيات الموقع</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isReset ? <CheckCircle className="w-5 h-5 text-green-600" /> : <RefreshCcw className="w-5 h-5" />}
            حالة الإحصائيات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isReset ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">تم تصفير الإحصائيات بنجاح! ✅</h3>
              <p className="text-green-700 text-sm">
                جميع الإحصائيات الآن = 0 (المشاهدات، الإعجابات، التعليقات)
                <br />
                تم بدء الرصد من هذه اللحظة لتعكس التفاعل الحقيقي للمستخدمين.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              سيؤدي هذا الإجراء إلى تصفير جميع المشاهدات والإعجابات والتعليقات لكافة المقالات.
            </p>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isReset}>
                <RefreshCcw className="w-4 h-4 ml-2" />
                {isReset ? "تم التصفير" : "تصفير جميع الإحصائيات"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد تصفير الإحصائيات</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من تصفير جميع الإحصائيات؟ لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleResetStats}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  تصفير
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
