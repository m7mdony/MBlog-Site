import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, RotateCcw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import DraggableContentCard from './DraggableContentCard';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isInfographic?: boolean;
  order: number;
}

interface DraggableContentListProps {
  title: string;
  items: ContentItem[];
  onOrderChange: (newOrder: ContentItem[]) => void;
  onItemClick?: (item: ContentItem) => void;
  onItemOptionsClick?: (item: ContentItem) => void;
  className?: string;
  showSaveButton?: boolean;
  showResetButton?: boolean;
  storageKey?: string;
}

const DraggableContentList: React.FC<DraggableContentListProps> = ({
  title,
  items,
  onOrderChange,
  onItemClick,
  onItemOptionsClick,
  className = '',
  showSaveButton = true,
  showResetButton = true,
  storageKey,
}) => {
  const [localItems, setLocalItems] = useState<ContentItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<ContentItem[]>([]);

  useEffect(() => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    setLocalItems(sortedItems);
    setOriginalOrder(sortedItems);
    setHasChanges(false);
  }, [items]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const newItems = Array.from(localItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    // تحديث ترتيب العناصر
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setLocalItems(updatedItems);
    setHasChanges(true);
  };

  const handleSaveOrder = () => {
    try {
      onOrderChange(localItems);
      
      // حفظ الترتيب في localStorage إذا تم توفير مفتاح
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(localItems));
      }
      
      setHasChanges(false);
      setOriginalOrder([...localItems]);
      toast.success('تم حفظ الترتيب الجديد بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الترتيب');
      console.error('Error saving order:', error);
    }
  };

  const handleResetOrder = () => {
    setLocalItems([...originalOrder]);
    setHasChanges(false);
    toast.info('تم إعادة الترتيب الأصلي');
  };

  const handleItemClick = (item: ContentItem) => {
    onItemClick?.(item);
  };

  const handleItemOptionsClick = (item: ContentItem) => {
    onItemOptionsClick?.(item);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <CardTitle className="text-xl font-bold text-gray-900">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {localItems.length} عنصر
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {showResetButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetOrder}
                disabled={!hasChanges || isDragging}
                className="text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            )}

            {showSaveButton && (
              <Button
                onClick={handleSaveOrder}
                disabled={!hasChanges || isDragging}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ الترتيب
              </Button>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-4 space-x-reverse text-sm">
          {hasChanges && (
            <div className="flex items-center space-x-2 space-x-reverse text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span>يوجد تغييرات في الترتيب</span>
            </div>
          )}
          
          {!hasChanges && hasChanges !== undefined && (
            <div className="flex items-center space-x-2 space-x-reverse text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>الترتيب محدث</span>
            </div>
          )}

          {isDragging && (
            <div className="flex items-center space-x-2 space-x-reverse text-blue-600">
              <Info className="w-4 h-4" />
              <span>اسحب العنصر إلى الموقع المطلوب</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {localItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">لا توجد عناصر لعرضها</p>
            <p className="text-sm">أضف بعض المحتوى لبدء استخدام هذه الميزة</p>
          </div>
        ) : (
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="content-list" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
                    min-h-[400px] p-1
                    ${snapshot.isDraggingOver ? 'bg-blue-50/50 rounded-lg' : ''}
                  `}
                >
                  {localItems.map((item, index) => (
                    <DraggableContentCard
                      key={item.id}
                      id={item.id}
                      index={index}
                      title={item.title}
                      imageUrl={item.imageUrl}
                      views={item.views}
                      likes={item.likes}
                      comments={item.comments}
                      isInfographic={item.isInfographic}
                      onClick={() => handleItemClick(item)}
                      onOptionsClick={() => handleItemOptionsClick(item)}
                      showDragHandle={true}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
};

export default DraggableContentList; 