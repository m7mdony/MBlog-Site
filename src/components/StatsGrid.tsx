import { Card } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, Heart } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "45+",
    label: "مفهوم ومقال",
    color: "text-primary"
  },
  {
    icon: Users,
    value: "12K+",
    label: "متابع",
    color: "text-accent"
  },
  {
    icon: Heart,
    value: "8.5K",
    label: "إعجاب",
    color: "text-red-500"
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "معدل التفاعل",
    color: "text-green-500"
  }
];

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 text-center bg-gradient-subtle border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">
            {stat.label}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;