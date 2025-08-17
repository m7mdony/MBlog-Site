// Categories storage for managing concept categories
export interface Category {
  id: number;
  name: string;
  color: string;
  count: number;
  visible: boolean;
  order: number;
  description: string;
}

const CATEGORIES_KEY = 'mariam_categories';

const defaultCategories: Category[] = [
  {
    id: 1,
    name: "نمو الأعمال",
    color: "#10B981",
    count: 18,
    visible: true,
    order: 1,
    description: "مفاهيم متعلقة بنمو وتطوير الأعمال"
  },
  {
    id: 2,
    name: "التشغيل",
    color: "#3B82F6",
    count: 12,
    visible: true,
    order: 2,
    description: "عمليات وأنظمة التشغيل"
  },
  {
    id: 3,
    name: "العقلية",
    color: "#8B5CF6",
    count: 8,
    visible: true,
    order: 3,
    description: "تطوير العقلية الريادية"
  },
  {
    id: 4,
    name: "التقنية",
    color: "#F59E0B",
    count: 7,
    visible: true,
    order: 4,
    description: "الأدوات والتقنيات"
  }
];

export function getCategories(): Category[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    setCategories(defaultCategories);
    return defaultCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories;
  }
}

export function setCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('categoriesUpdated', { detail: categories }));
    // إرسال حدث إضافي للتأكد من التحديث
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
}

export function addCategory(categoryData: Omit<Category, 'id'>): Category {
  const categories = getCategories();
  const newId = Math.max(...categories.map(c => c.id), 0) + 1;
  
  const newCategory: Category = {
    ...categoryData,
    id: newId,
  };
  
  const updatedCategories = [...categories, newCategory];
  setCategories(updatedCategories);
  return newCategory;
}

export function updateCategory(id: number, updates: Partial<Category>): void {
  const categories = getCategories();
  const updatedCategories = categories.map(category => 
    category.id === id ? { ...category, ...updates } : category
  );
  setCategories(updatedCategories);
}

export function deleteCategory(id: number): void {
  const categories = getCategories();
  const updatedCategories = categories.filter(category => category.id !== id);
  setCategories(updatedCategories);
}

export function updateCategoriesOrder(newOrder: Category[]): void {
  const updatedCategories = newOrder.map((category, index) => ({
    ...category,
    order: index + 1
  }));
  setCategories(updatedCategories);
}