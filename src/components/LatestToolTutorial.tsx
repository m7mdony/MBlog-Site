import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

interface LatestToolTutorialProps {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  isNew?: boolean;
}

export function LatestToolTutorial({ 
  id = "1",
  title = "Notion - نظرة سريعة وشاملة", 
  description = "كيف تستخدم Notion لتنظيم حياتك ومشاريعك بطريقة احترافية",
  thumbnail = "/placeholder.svg",
  duration = "12:30",
  isNew = true 
}: LatestToolTutorialProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-secondary/5 to-accent/10 border-secondary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium bg-secondary/20 text-secondary-foreground">
              📹 شرح أداة
            </Badge>
            <Badge variant="outline" className="bg-secondary/10 text-secondary text-xs border-secondary/20">
              فيديو
            </Badge>
          </div>
          {isNew && (
            <Badge variant="outline" className="text-xs border-secondary/30 text-secondary">
              جديد
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative group cursor-pointer">
          <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <Play className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <h3 className="text-lg font-bold text-foreground leading-tight">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <Button 
            asChild
            className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-medium"
            size="sm"
          >
            <Link to={`/tutorial/${id}`}>
              <Play className="w-4 h-4 ml-2" />
              شاهد الفيديو
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}