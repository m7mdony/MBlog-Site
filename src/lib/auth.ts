// Simple authentication check
const ADMIN_PASSWORD = "admin123"; // In real app, this would be handled differently

export function isAuthenticated(): boolean {
  try {
    // Check if localStorage is available (important for SSR and initial page loads)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem("admin_authenticated") === "true";
  } catch (error) {
    console.warn("Authentication check failed:", error);
    return false;
  }
}

export function login(password: string): boolean {
  try {
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem("admin_authenticated", "true");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}

export function logout(): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem("admin_authenticated");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

// Check if we're in a browser environment
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}