import { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MobileCarouselProps {
  children: ReactNode[];
  title: string;
}

export function MobileCarousel({ children, title }: MobileCarouselProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
        {title}
      </h3>
      <Carousel
        opts={{
          align: "center",
          loop: true,
          direction: "rtl"
        }}
        className="w-full max-w-sm mx-auto md:hidden"
      >
        <CarouselContent>
          {children.map((child, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="p-1">
                {child}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/80 border-border" />
        <CarouselNext className="right-2 bg-background/80 border-border" />
      </Carousel>
      
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}