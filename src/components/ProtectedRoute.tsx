import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, isBrowser } from "@/lib/auth";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Only check authentication if we're in a browser environment
    if (isBrowser()) {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
    } else {
      setIsAuth(false);
    }
  }, [location.pathname]);

  // Show loading state while checking authentication
  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}