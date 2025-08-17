import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface NewFileResourceProps {
  id?: string;
  fileName: string;
  fileType: string;
  description: string;
  fileSize: string;
  isNew?: boolean;
  downloadUrl?: string;
}

export function NewFileResource({ 
  id = "1",
  fileName = "قالب تقييم أفكار المشاريع", 
  fileType = "PDF",
  description = "قالب شامل لتقييم الأفكار وتحليل الجدوى قبل بدء أي مشروع",
  fileSize = "2.5 MB",
  isNew = true,
  downloadUrl = "#"
}: NewFileResourceProps) {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'notion':
        return '📝';
      case 'excel':
      case 'xlsx':
        return '📊';
      default:
        return '📁';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium bg-accent/20 text-accent-foreground">
              📁 ملف جديد
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent text-xs border-accent/20">
              {fileType}
            </Badge>
          </div>
          {isNew && (
            <Badge variant="outline" className="text-xs border-accent/30 text-accent">
              جديد
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div className="text-5xl mb-3">
          {getFileIcon(fileType)}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground leading-tight">
            {fileName}
          </h3>
          
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {fileType}
            </Badge>
            <span>{fileSize}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="flex gap-2">
          <Button 
            asChild
            className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-medium"
            size="sm"
          >
            <Link to={`/resource/${id}`}>
              <Download className="w-4 h-4 ml-2" />
              تحميل
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}