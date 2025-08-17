import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionWithShowMoreProps {
  children: ReactNode[];
  title: string;
  initialCount?: number;
  viewAllLink?: string;
}

export function SectionWithShowMore({ 
  children, 
  title, 
  initialCount = 3,
  viewAllLink
}: SectionWithShowMoreProps) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? children : children.slice(0, initialCount);

  return (
    <div className="mb-12">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
          {viewAllLink && (
            <Button variant="outline" size="sm" asChild>
              <Link to={viewAllLink}>
                <ArrowLeft className="w-4 h-4 ml-2" />
                عرض الكل
              </Link>
            </Button>
          )}
        </div>
      )}
      
      {/* Mobile Carousel for small screens */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {children.map((child, index) => (
            <div key={index} className="flex-shrink-0 w-80 snap-center">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop Grid for larger screens */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayItems}
        </div>
        
        {children.length > initialCount && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="group transition-all duration-300"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 ml-2 group-hover:animate-bounce" />
                  عرض أقل
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 ml-2 group-hover:animate-bounce" />
                  عرض المزيد ({children.length - initialCount} إضافي)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}