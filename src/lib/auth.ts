// Simple authentication check
const ADMIN_PASSWORD = "admin123"; // In real app, this would be handled differently

export function isAuthenticated(): boolean {
  return localStorage.getItem("admin_authenticated") === "true";
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("admin_authenticated", "true");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem("admin_authenticated");
}