import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Filter,
  Tag,
  Save,
  GripVertical,
  Check,
  AlertCircle,
  Info
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { getCategories, setCategories, addCategory, updateCategory, deleteCategory, updateCategoriesOrder, type Category } from "@/lib/categories-storage";
import { toast } from "sonner";

export default function FiltersManagement() {
  const [categories, setLocalCategories] = useState<Category[]>([]);
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Category | null>(null);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newFilterData, setNewFilterData] = useState({
    name: "",
    description: "",
    color: "#6B7280"
  });

  useEffect(() => {
    setLocalCategories(getCategories());
  }, []);

  const toggleFilterVisibility = (id: number) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, visible: !category.visible } : category
    );
    setLocalCategories(updatedCategories);
    updateCategory(id, { visible: !categories.find(c => c.id === id)?.visible });
    toast.success("تم تحديث حالة الفلتر");
  };

  const handleAddFilter = () => {
    if (newFilterData.name.trim()) {
      const newCategory = addCategory({
        name: newFilterData.name,
        description: newFilterData.description,
        color: newFilterData.color,
        count: 0,
        visible: true,
        order: categories.length + 1
      });
      setLocalCategories([...categories, newCategory]);
      setNewFilterData({ name: "", description: "", color: "#6B7280" });
      setIsAddingFilter(false);
      toast.success("تم إضافة الفلتر بنجاح");
    }
  };

  const handleUpdateFilter = () => {
    if (editingFilter) {
      updateCategory(editingFilter.id, editingFilter);
      setLocalCategories(categories.map(c => 
        c.id === editingFilter.id ? editingFilter : c
      ));
      setEditingFilter(null);
      toast.success("تم تحديث الفلتر بنجاح");
    }
  };

  const handleDeleteFilter = (id: number) => {
    deleteCategory(id);
    setLocalCategories(categories.filter(category => category.id !== id));
    toast.success("تم حذف الفلتر بنجاح");
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const items = Array.from(sortedCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // تحديث الترتيب في العناصر
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setLocalCategories(updatedItems);
    setHasOrderChanges(true);
  };

  const handleSaveOrder = () => {
    updateCategoriesOrder(categories);
    setHasOrderChanges(false);
    toast.success("تم حفظ الترتيب الجديد بنجاح");
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الفلاتر</h1>
          <p className="text-muted-foreground">إدارة وتنظيم فلاتر التصنيف في الموقع</p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanges && (
            <Button 
              onClick={handleSaveOrder}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 ml-2" />
              حفظ الترتيب
            </Button>
          )}
          <Button 
            onClick={() => setIsAddingFilter(true)}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة فلتر جديد
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الفلاتر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الفلاتر المرئية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(f => f.visible).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المحتوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, f) => sum + f.count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Filter Form */}
      {isAddingFilter && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة فلتر جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الفلتر</label>
              <Input
                value={newFilterData.name}
                onChange={(e) => setNewFilterData({...newFilterData, name: e.target.value})}
                placeholder="مثال: التمويل، القيادة، الابتكار..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <Textarea
                value={newFilterData.description}
                onChange={(e) => setNewFilterData({...newFilterData, description: e.target.value})}
                placeholder="وصف مختصر للفلتر..."
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اللون</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={newFilterData.color}
                  onChange={(e) => setNewFilterData({...newFilterData, color: e.target.value})}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={newFilterData.color}
                  onChange={(e) => setNewFilterData({...newFilterData, color: e.target.value})}
                  placeholder="#6B7280"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFilter}>
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingFilter(false)}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Filter Form */}
      {editingFilter && (
        <Card>
          <CardHeader>
            <CardTitle>تعديل الفلتر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الفلتر</label>
              <Input
                value={editingFilter.name}
                onChange={(e) => setEditingFilter({...editingFilter, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <Textarea
                value={editingFilter.description}
                onChange={(e) => setEditingFilter({...editingFilter, description: e.target.value})}
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اللون</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={editingFilter.color}
                  onChange={(e) => setEditingFilter({...editingFilter, color: e.target.value})}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={editingFilter.color}
                  onChange={(e) => setEditingFilter({...editingFilter, color: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateFilter}>
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingFilter(null)}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Management with Drag & Drop */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            قائمة الفلاتر
            {hasOrderChanges && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <AlertCircle className="w-3 h-3 ml-1" />
                تغييرات في الترتيب
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>اسحب وأفلت الفلاتر لترتيبها، ثم اضغط على "حفظ الترتيب" لحفظ التغييرات</p>
              {isDragging && (
                <p className="text-primary font-medium mt-1">
                  💡 يمكنك الآن إفلات الفلتر في المكان المطلوب
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="filters">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 transition-all duration-200 ${
                    snapshot.isDraggingOver ? 'bg-blue-50/50 rounded-lg p-2' : ''
                  }`}
                >
                  {sortedCategories.map((filter, index) => (
                    <Draggable key={filter.id} draggableId={filter.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border rounded-lg bg-card transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'shadow-2xl ring-2 ring-primary/30 scale-105 rotate-2 z-50' 
                              : 'hover:shadow-md hover:border-primary/20'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className={`cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded ${
                                snapshot.isDragging ? 'text-primary' : ''
                              }`}
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Filter Info */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                              <div className="md:col-span-2">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-4 h-4 rounded-full shadow-sm"
                                    style={{ backgroundColor: filter.color }}
                                  />
                                  <div>
                                    <div className="font-medium">{filter.name}</div>
                                    {filter.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {filter.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded border shadow-sm"
                                  style={{ backgroundColor: filter.color }}
                                />
                                <span className="text-sm font-mono">{filter.color}</span>
                              </div>

                              <div>
                                <Badge variant="secondary">{filter.count} محتوى</Badge>
                              </div>

                              <div className="text-center">
                                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                  {filter.order}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={filter.visible}
                                  onCheckedChange={() => toggleFilterVisibility(filter.id)}
                                />
                                {filter.visible ? (
                                  <Eye className="w-4 h-4 text-green-600" />
                                ) : (
                                  <EyeOff className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingFilter(filter)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteFilter(filter.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Filter Preview */}
      <Card>
        <CardHeader>
          <CardTitle>معاينة الفلاتر في الموقع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" className="bg-gradient-primary text-white">
              الكل
              <Badge variant="secondary" className="mr-2 bg-white/20 text-current">
                45
              </Badge>
            </Button>
            {sortedCategories
              .filter(filter => filter.visible)
              .map((filter) => (
              <Button 
                key={filter.id}
                variant="outline" 
                style={{ 
                  borderColor: filter.color + '40',
                  color: filter.color,
                  backgroundColor: filter.color + '10'
                }}
                className="hover:shadow-md transition-shadow"
              >
                {filter.name}
                <Badge 
                  variant="secondary" 
                  className="mr-2 text-current"
                  style={{ backgroundColor: filter.color + '20' }}
                >
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}