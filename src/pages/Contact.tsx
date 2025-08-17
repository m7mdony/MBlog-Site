import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Send, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ContactSocialLinks from "@/components/ContactSocialLinks";

interface ConsultationButtonConfig {
  text: string;
  url: string;
  isEnabled: boolean;
}

export default function Contact() {
  const [consultationConfig, setConsultationConfig] = useState<ConsultationButtonConfig>({
    text: "احجز استشارتك",
    url: "",
    isEnabled: true
  });

  useEffect(() => {
    // تحميل إعدادات زر الاستشارة
    const loadConsultationConfig = () => {
      const savedConfig = localStorage.getItem('consultationButtonConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConsultationConfig(parsedConfig);
        } catch (error) {
          console.error('Error parsing consultation button config:', error);
        }
      }
    };

    loadConsultationConfig();

    // الاستماع لتحديثات الإعدادات
    const handleConfigUpdate = () => {
      loadConsultationConfig();
    };

    window.addEventListener('consultationButtonUpdated', handleConfigUpdate);
    return () => {
      window.removeEventListener('consultationButtonUpdated', handleConfigUpdate);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  const handleConsultationClick = () => {
    if (consultationConfig.url && consultationConfig.url !== "#") {
      window.open(consultationConfig.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="group flex items-center gap-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Mail className="w-6 h-6" />
                تواصل معنا
              </CardTitle>
              <p className="text-muted-foreground">
                أرسل لنا رسالة وسنعود إليك في أقرب وقت ممكن
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right">الاسم</Label>
                  <Input
                    id="name"
                    placeholder="اسمك الكامل"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-right">الموضوع</Label>
                  <Input
                    id="subject"
                    placeholder="موضوع الرسالة"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-right">الرسالة</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    required
                    className="text-right resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  size="lg"
                >
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الرسالة
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Social Links */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-secondary/5 to-accent/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  طرق التواصل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-3 rounded-lg border border-border bg-background/50">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/25 transform hover:scale-105 flex items-center gap-3 group"
                    onClick={handleConsultationClick}
                    disabled={!consultationConfig.isEnabled}
                  >
                    <Calendar className="w-6 h-6 text-white group-hover:animate-pulse transition-all duration-300" />
                    {consultationConfig.text || "احجز موعدك الآن"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-primary/10 border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  تابعني على
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ContactSocialLinks />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}