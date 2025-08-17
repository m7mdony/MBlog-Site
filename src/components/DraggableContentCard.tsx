import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Eye, Heart, MessageCircle, MoreVertical, GripVertical } from 'lucide-react';

interface DraggableContentCardProps {
  id: string;
  index: number;
  title: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isInfographic?: boolean;
  onClick?: () => void;
  onOptionsClick?: () => void;
  className?: string;
  showDragHandle?: boolean;
}

const DraggableContentCard: React.FC<DraggableContentCardProps> = ({
  id,
  index,
  title,
  imageUrl,
  views,
  likes,
  comments,
  isInfographic = false,
  onClick,
  onOptionsClick,
  className = '',
  showDragHandle = true,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            group relative bg-white rounded-2xl shadow-sm hover:shadow-md 
            transition-all duration-300 ease-in-out cursor-pointer
            overflow-hidden border border-gray-100
            ${onClick ? 'hover:-translate-y-1' : ''}
            ${snapshot.isDragging ? 'shadow-xl scale-105 rotate-2' : ''}
            ${className}
          `}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.();
            }
          }}
          aria-label={onClick ? `انقر لعرض ${title}` : undefined}
        >
          {/* Drag Handle */}
          {showDragHandle && (
            <div
              {...provided.dragHandleProps}
              className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors duration-200"
            >
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-center justify-between p-4 pb-3">
            <h3 
              className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 pr-3"
              title={title}
            >
              {title}
            </h3>
            
            {isInfographic && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  إنفوجرافيك
                </span>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="px-4 pb-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200">
              <img
                src={imageUrl}
                alt={`صورة غلاف لـ ${title}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Loading State Overlay */}
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Views */}
                <div className="flex items-center space-x-1 space-x-reverse text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatNumber(views)}</span>
                </div>

                {/* Likes */}
                <div className="flex items-center space-x-1 space-x-reverse text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatNumber(likes)}</span>
                </div>

                {/* Comments */}
                <div className="flex items-center space-x-1 space-x-reverse text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatNumber(comments)}</span>
                </div>
              </div>

              {/* Options Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOptionsClick?.();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="خيارات إضافية"
                title="خيارات إضافية"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Drag Overlay Effect */}
          {snapshot.isDragging && (
            <div className="absolute inset-0 bg-blue-50/50 border-2 border-blue-300 rounded-2xl" />
          )}

          {/* Focus Ring for Keyboard Navigation */}
          {onClick && (
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent focus-within:ring-blue-500 focus-within:ring-offset-2 pointer-events-none" />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableContentCard; 