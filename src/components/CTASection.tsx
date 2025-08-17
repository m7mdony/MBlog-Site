import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Mail } from "lucide-react";

export function CTASection() {
  return (
    <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      <CardContent className="relative p-8 md:p-12 text-center space-y-6">
        <div className="space-y-3">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            تابع رحلة النمو والتطوير
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            اكتشف أحدث المفاهيم والأدوات والمصادر التي تساعدك في بناء مشاريعك وتطوير مهاراتك
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg space-y-4 border border-primary/10">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Bell className="w-5 h-5" />
              <span className="text-base font-medium">تحديثات دورية</span>
            </div>
            <p className="text-sm text-muted-foreground">
              أحدث المفاهيم والأدوات المختارة بعناية لتطوير مهاراتك
            </p>
          </div>
          
          <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg space-y-4 border border-secondary/10">
            <div className="flex items-center justify-center gap-3 text-secondary">
              <Mail className="w-5 h-5" />
              <span className="text-base font-medium">محتوى حصري</span>
            </div>
            <p className="text-sm text-muted-foreground">
              أدوات ومفاهيم وقوالب مختارة بعناية لتطوير مشاريعك
            </p>
          </div>
        </div>
          
        <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
            size="lg"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            تابع مشاريعي الجديدة
          </Button>
          
          <Button 
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/5"
            size="lg"
          >
            <Mail className="w-5 h-5 ml-2" />
            اشترك في التحديثات
          </Button>
        </div>
        
        <div className="pt-4 border-t border-muted/20">
          <p className="text-sm text-muted-foreground">
            📨 تحديثات أسبوعية • 🎯 محتوى مختار • 🚀 مشاريع جديدة
          </p>
        </div>
      </CardContent>
    </Card>
  );
}