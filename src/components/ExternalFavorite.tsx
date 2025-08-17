import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ExternalFavoriteProps {
  id?: string;
  siteName: string;
  description: string;
  reason: string;
  category: string;
  isNew?: boolean;
  url?: string;
}

export function ExternalFavorite({ 
  id = "1",
  siteName = "Linear - أداة إدارة المشاريع", 
  description = "أداة رائعة لإدارة المهام والمشاريع التقنية",
  reason = "واجهة نظيفة وسرعة استثنائية في الأداء",
  category = "أدوات",
  isNew = true,
  url = "#"
}: ExternalFavoriteProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-muted/10 to-secondary/5 border-muted/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium bg-muted/20 text-muted-foreground">
              ⭐ رابط مميز
            </Badge>
            <Badge variant="outline" className="bg-muted/10 text-muted-foreground text-xs border-muted/20">
              {category}
            </Badge>
          </div>
          {isNew && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              جديد
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-3">🌐</div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {siteName}
            </h3>
            
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed text-center">
          {description}
        </p>
        
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">ليه أعجبني:</span> {reason}
            </p>
          </div>
        </div>
        
        <Button 
          asChild
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
          size="sm"
        >
          <Link to={`/favorite/${id}`}>
            <ExternalLink className="w-4 h-4 ml-2" />
            جربه الآن
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}