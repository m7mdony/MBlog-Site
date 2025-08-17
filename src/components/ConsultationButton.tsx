import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";

interface ConsultationButtonConfig {
  text: string;
  url: string;
  isEnabled: boolean;
}

const ConsultationButton = () => {
  const [config, setConfig] = useState<ConsultationButtonConfig>({
    text: "احجز استشارتك",
    url: "#",
    isEnabled: true
  });

  useEffect(() => {
    // تحميل الإعدادات من التخزين المحلي
    const savedConfig = localStorage.getItem('consultationButtonConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing consultation button config:', error);
      }
    }

    // الاستماع للتحديثات
    const handleConfigUpdate = () => {
      const savedConfig = localStorage.getItem('consultationButtonConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
        } catch (error) {
          console.error('Error parsing consultation button config:', error);
        }
      }
    };

    window.addEventListener('consultationButtonUpdated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);

    return () => {
      window.removeEventListener('consultationButtonUpdated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  if (!config.isEnabled) {
    return null;
  }

  const handleClick = () => {
    if (config.url === "#" || !config.url) {
      return;
    }
    
    if (config.url.startsWith('mailto:')) {
      window.location.href = config.url;
    } else {
      window.open(config.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group w-full"
      disabled={config.url === "#" || !config.url}
    >
      <Calendar className="w-5 h-5" />
      <div className="text-right">
        <p className="font-medium group-hover:text-primary-foreground transition-colors">
          {config.text}
        </p>
        <p className="text-sm opacity-80">تواصل معي</p>
      </div>
      <ExternalLink className="w-4 h-4 opacity-60" />
    </Button>
  );
};

export default ConsultationButton;