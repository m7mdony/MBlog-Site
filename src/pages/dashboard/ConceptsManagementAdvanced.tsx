import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  Search, 
  Filter, 
  Plus,
  GripVertical,
  Eye,
  EyeOff
} from "lucide-react";
import { Link } from "react-router-dom";
import { getConcepts, updateConcept, type Concept } from "@/lib/storage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ConceptsManagementAdvanced() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setConcepts(getConcepts());
    
    // استماع لتحديثات البيانات
    const handleConceptsUpdate = () => {
      setConcepts(getConcepts());
    };
    
    window.addEventListener('conceptsUpdated', handleConceptsUpdate);
    
    return () => {
      window.removeEventListener('conceptsUpdated', handleConceptsUpdate);
    };
  }, []);

  const categories = ["الكل", "نمو الأعمال", "التشغيل", "العقلية", "التقنية"];

  const filteredAndSortedConcepts = concepts
    .filter(concept => {
      const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           concept.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "الكل" || concept.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(filteredAndSortedConcepts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order in concepts array
    const updatedConcepts = concepts.map(concept => {
      const newIndex = items.findIndex(item => item.id === concept.id);
      if (newIndex !== -1) {
        return { ...concept, order: newIndex };
      }
      return concept;
    });

    setConcepts(updatedConcepts);
    
    // حفظ الترتيب الجديد في التخزين
    try {
      const { setConcepts: saveConcepts } = require("@/lib/storage");
      saveConcepts(updatedConcepts);
      console.log("✅ تم حفظ الترتيب الجديد بنجاح");
    } catch (error) {
      console.error("❌ خطأ في حفظ الترتيب:", error);
    }
  };

  const toggleVisibility = (id: number) => {
    const concept = concepts.find(c => c.id === id);
    if (concept) {
      const newStatus = concept.status === "مخفي" ? "منشور" : "مخفي";
      updateConcept(id, { status: newStatus });
      setConcepts(getConcepts());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "منشور":
        return "bg-green-100 text-green-800";
      case "مسودة":
        return "bg-yellow-100 text-yellow-800";
      case "مخفي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المفاهيم المتقدمة</h1>
          <p className="text-muted-foreground">إدارة وترتيب جميع المفاهيم والمقالات</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
          <Link to="/dashboard/concepts/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مفهوم جديد
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ابحث في المفاهيم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button
                variant={sortOrder === "desc" ? "default" : "outline"}
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                size="sm"
              >
                <ArrowUpDown className="w-4 h-4 ml-2" />
                {sortOrder === "desc" ? "الأحدث أولاً" : "الأقدم أولاً"}
              </Button>
              
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        عرض {filteredAndSortedConcepts.length} من أصل {concepts.length} مفهوم
      </div>

      {/* Draggable Concepts List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="concepts">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredAndSortedConcepts.map((concept, index) => (
                <Draggable
                  key={concept.id.toString()}
                  draggableId={concept.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow hover:shadow-lg ${
                        snapshot.isDragging ? "shadow-xl rotate-2" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-primary cursor-grab"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{concept.title}</h3>
                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                  {concept.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <Badge variant="secondary">{concept.category}</Badge>
                                  <span>{concept.createdAt}</span>
                                  <span>{concept.views} مشاهدة</span>
                                  <span>{concept.likes} إعجاب</span>
                                  {concept.hasVideo && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                      فيديو
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(concept.status)}>
                                  {concept.status}
                                </Badge>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleVisibility(concept.id)}
                                >
                                  {concept.status === "مخفي" ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredAndSortedConcepts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد مفاهيم مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
}