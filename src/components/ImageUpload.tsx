import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon, FileImage } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  placeholder = "اختر صورة أو أدخل رابط",
  className = "",
  showPreview = true
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // دالة ضغط الصور
  const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // حساب الأبعاد الجديدة مع الحفاظ على النسبة
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // رسم الصورة المضغوطة
          ctx?.drawImage(img, 0, 0, width, height);
          
          // تحويل إلى Base64 مع جودة محددة
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ في نوع الملف",
        description: "يرجى اختيار ملف صورة صحيح (JPG, PNG, GIF, WebP)",
        variant: "destructive"
      });
      return;
    }

    // التحقق من حجم الملف (أقل من 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "الملف كبير جداً",
        description: "يرجى اختيار صورة أقل من 10 ميجابايت",
        variant: "destructive"
      });
      return;
    }

    // التحقق من أسماء الملفات المدعومة
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى اختيار صورة بصيغة: JPG, PNG, GIF, WebP, BMP",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setIsCompressing(true);

    try {
      // ضغط الصورة أولاً ثم تحويلها إلى Base64
      const compressedImage = await compressImage(file);
      
      if (compressedImage) {
        onChange(compressedImage);
        setIsUploading(false);
        setIsCompressing(false);
        
        // حساب حجم الملف المضغوط
        const originalSize = (file.size / 1024 / 1024).toFixed(2);
        const compressedSize = (compressedImage.length * 0.75 / 1024 / 1024).toFixed(2);
        
        toast({
          title: "تم رفع الصورة بنجاح",
          description: `تم ضغط الصورة "${file.name}" من ${originalSize}MB إلى ${compressedSize}MB تقريباً`
        });
      }
      
    } catch (error) {
      console.error("خطأ في معالجة الصورة:", error);
      setIsUploading(false);
      setIsCompressing(false);
      
      // محاولة رفع الصورة بدون ضغط كحل بديل
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const result = e.target?.result as string;
            if (result && result.startsWith('data:image/')) {
              onChange(result);
              setIsUploading(false);
              toast({
                title: "تم رفع الصورة بنجاح (بدون ضغط)",
                description: `تم رفع الصورة "${file.name}" بدون ضغط`
              });
            } else {
              throw new Error("فشل في تحويل الصورة");
            }
          } catch (error) {
            console.error("خطأ في معالجة الصورة:", error);
            setIsUploading(false);
            toast({
              title: "خطأ في معالجة الصورة",
              description: "فشل في تحويل الصورة، يرجى المحاولة مرة أخرى",
              variant: "destructive"
            });
          }
        };

        reader.onerror = () => {
          setIsUploading(false);
          toast({
            title: "خطأ في قراءة الملف",
            description: "فشل في قراءة الملف، يرجى المحاولة مرة أخرى",
            variant: "destructive"
          });
        };

        reader.onabort = () => {
          setIsUploading(false);
          toast({
            title: "تم إلغاء العملية",
            description: "تم إلغاء رفع الصورة",
            variant: "destructive"
          });
        };

        // بدء قراءة الملف بدون ضغط
        reader.readAsDataURL(file);
        
      } catch (fallbackError) {
        console.error("خطأ في الحل البديل:", fallbackError);
        setIsUploading(false);
        toast({
          title: "خطأ في رفع الصورة",
          description: "فشل في رفع الصورة، يرجى المحاولة مرة أخرى",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* معاينة الصورة */}
      {showPreview && value && (
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 border-blue-400/20 shadow-lg">
            <img
              src={value}
              alt="معاينة الصورة"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* منطقة رفع الصور */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-blue-400 ${
          isUploading ? 'border-blue-500 bg-blue-50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : isCompressing ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <FileImage className="w-4 h-4 text-green-500" />
              </div>
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            {isUploading ? (
              isCompressing ? "جاري ضغط الصورة..." : "جاري رفع الصورة..."
            ) : (
              <>
                <p>اسحب وأفلت الصورة هنا، أو</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 ml-1" />
                  اختر صورة
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* إدخال الرابط */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          أو أدخل رابط الصورة مباشرة:
        </label>
        <Input
          type="url"
          value={value || ""}
          onChange={handleUrlInput}
          placeholder="https://example.com/image.jpg"
          disabled={isUploading}
        />
      </div>

      {/* إدخال الملف المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
} 