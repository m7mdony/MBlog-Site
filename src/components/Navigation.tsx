import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "الرئيسية" },
    { path: "/about", label: "حول مريم" },
    { path: "/contact", label: "تواصل معنا" }
  ];

  return (
    <nav className="flex items-center gap-4">
      {navItems.map((item) => (
        <Button
          key={item.path}
          asChild
          variant={location.pathname === item.path ? "default" : "ghost"}
          size="sm"
        >
          <Link to={item.path}>
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}