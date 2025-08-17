import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface LatestConceptProps {
  id?: string;
  title: string;
  description: string;
  readTime: string;
  isNew?: boolean;
}

export function LatestConcept({ 
  id = "1",
  title = "كيف تبني نظام إدارة المهام الشخصي", 
  description = "نظرة عميقة على أساليب تنظيم المهام والمشاريع بطريقة فعالة ومستدامة",
  readTime = "5 دقائق",
  isNew = true 
}: LatestConceptProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              🔥 أحدث مفهوم
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary text-xs border-primary/20">
              مفهوم
            </Badge>
          </div>
          {isNew && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              جديد
            </Badge>
          )}
        </div>
        <div className="text-center mb-3">
          <div className="text-4xl mb-2">💭</div>
        </div>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>⏱️</span>
          <span>{readTime} قراءة</span>
        </div>
        
        <Button 
          asChild
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
          size="sm"
        >
          <Link to={`/concept/${id}`}>
            اقرأ المفهوم
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}