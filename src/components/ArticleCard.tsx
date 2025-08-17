import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Play, 
  Clock,
  ExternalLink
} from "lucide-react";
import { Article } from "@/lib/articles-storage";
import { useNavigate } from "react-router-dom";

interface ArticleCardProps {
  article: Article;
  showEngagement?: boolean;
}

export default function ArticleCard({ article, showEngagement = true }: ArticleCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // هنا يمكن إضافة منطق الإعجاب
  };

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-blue-50"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {article.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 mr-4">
              <Badge variant="outline" className="text-xs">
                {article.category}
              </Badge>
              {article.isPopular && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                  مميز
                </Badge>
              )}
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime || "5"} دقائق
            </div>
            <div className="flex items-center gap-1">
              <span>•</span>
              {formatDate(article.createdAt)}
            </div>
            {article.hasVideo && (
              <>
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <Play className="w-4 h-4 text-red-500" />
                  فيديو
                </div>
              </>
            )}
          </div>

          {/* Engagement Stats */}
          {showEngagement && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {article.likes || 0}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {article.comments || 0}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className={`hover:bg-red-50 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="hover:bg-blue-50 text-blue-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 