
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { toggleLike, hasLiked, getConcepts } from "@/lib/storage";
import { toast } from "sonner";

interface ArticleInteractionButtonsProps {
  articleId: number;
  showEngagement?: boolean;
}

const ArticleInteractionButtons = ({ articleId, showEngagement = true }: ArticleInteractionButtonsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setIsLiked(hasLiked(articleId));
    
    const concepts = getConcepts();
    const concept = concepts.find(c => c.id === articleId);
    if (concept) {
      setLikeCount(concept.likes);
    }

    // Listen for storage updates
    const handleStorageUpdate = (e: CustomEvent) => {
      const concepts = e.detail;
      const concept = concepts.find((c: any) => c.id === articleId);
      if (concept) {
        setLikeCount(concept.likes);
      }
    };

    window.addEventListener('conceptsUpdated', handleStorageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('conceptsUpdated', handleStorageUpdate as EventListener);
    };
  }, [articleId]);

  const handleLike = () => {
    const newLikedState = toggleLike(articleId);
    setIsLiked(newLikedState);
    toast.success(newLikedState ? "تم الإعجاب!" : "تم إلغاء الإعجاب");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.share({
        title: "مقال من موقع مريم",
        url: url,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط!");
    }
  };

  const handleComment = () => {
    toast.info("التعليقات تتطلب تسجيل الدخول");
  };

  if (!showEngagement) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-center gap-4">
        {/* Like Button */}
        <Button
          variant="ghost"
          onClick={handleLike}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
            isLiked 
              ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200" 
              : "text-muted-foreground hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="font-medium">{likeCount}</span>
          <span className="text-sm">إعجاب</span>
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          onClick={handleShare}
          className="flex items-center gap-3 px-6 py-3 rounded-xl text-muted-foreground hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-300 hover:scale-105"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">مشاركة</span>
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          onClick={handleComment}
          className="flex items-center gap-3 px-6 py-3 rounded-xl text-muted-foreground hover:text-green-600 hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">تعليق</span>
        </Button>
      </div>
    </div>
  );
};

export default ArticleInteractionButtons;
