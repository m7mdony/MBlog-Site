import React from 'react';
import { Eye, Heart, MessageCircle, MoreVertical, GripVertical } from 'lucide-react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

interface ContentCardProps {
  id?: string;
  index?: number;
  title: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isInfographic?: boolean;
  isDraggable?: boolean;
  onClick?: () => void;
  onOptionsClick?: () => void;
  className?: string;
  showDragHandle?: boolean;
  compactMode?: boolean; // وضع مضغوط للوحة التحكم
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  index = 0,
  title,
  imageUrl,
  views,
  likes,
  comments,
  isInfographic = false,
  isDraggable = false,
  onClick,
  onOptionsClick,
  className = '',
  showDragHandle = true,
  compactMode = false,
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // منع النقر على زر الخيارات أو مقبض السحب من تفعيل النقر على البطاقة
    if ((e.target as HTMLElement).closest('[data-options-button], [data-drag-handle]')) {
      return;
    }
    onClick?.();
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOptionsClick?.();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderCardContent = (provided?: DraggableProvided, snapshot?: DraggableStateSnapshot) => (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={`
        group relative bg-white rounded-2xl shadow-sm hover:shadow-md 
        transition-all duration-300 ease-in-out cursor-pointer
        overflow-hidden border border-gray-100
        ${onClick ? 'hover:-translate-y-1' : ''}
        ${snapshot?.isDragging ? 'shadow-xl scale-105 rotate-2' : ''}
        ${className}
      `}
      onClick={handleCardClick}
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
      {isDraggable && showDragHandle && (
        <div
          {...provided?.dragHandleProps}
          data-drag-handle
          className={`absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors duration-200 ${compactMode ? 'p-1' : 'p-2'}`}
        >
          <GripVertical className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
        </div>
      )}

      {/* Header Row */}
      <div className={`flex items-center justify-between ${compactMode ? 'p-3 pb-2' : 'p-4 pb-3'}`}>
        <h3 
          className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 line-clamp-2 flex-1 pr-3`}
          title={title}
        >
          {title}
        </h3>
        
        {isInfographic && (
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 ${compactMode ? 'text-xs px-2 py-0.5' : ''}`}>
              إنفوجرافيك
            </span>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className={`${compactMode ? 'px-3 pb-2' : 'px-4 pb-3'}`}>
        <div className={`relative ${compactMode ? 'aspect-[4/3]' : 'aspect-video'} rounded-2xl overflow-hidden bg-gray-200`}>
          <img
            src={imageUrl}
            alt={`صورة غلاف لـ ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className={`${compactMode ? 'px-3 pb-3' : 'px-4 pb-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Views */}
            <div className="flex items-center space-x-1 space-x-reverse text-gray-600">
              <Eye className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium`}>{formatNumber(views)}</span>
            </div>

            {/* Likes */}
            <div className="flex items-center space-x-1 space-x-reverse text-gray-600">
              <Heart className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium`}>{formatNumber(likes)}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center space-x-1 space-x-reverse text-gray-600">
              <MessageCircle className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium`}>{formatNumber(comments)}</span>
            </div>
          </div>

          {/* Options Button */}
          <button
            data-options-button
            onClick={handleOptionsClick}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${compactMode ? 'p-1' : ''}`}
            aria-label="خيارات إضافية"
            title="خيارات إضافية"
          >
            <MoreVertical className={`${compactMode ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
          </button>
        </div>
      </div>

      {/* Focus Ring for Keyboard Navigation */}
      {onClick && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent focus-within:ring-blue-500 focus-within:ring-offset-2 pointer-events-none" />
      )}
    </div>
  );

  // إذا كان المكون قابل للسحب، استخدم Draggable
  if (isDraggable && id) {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => renderCardContent(provided, snapshot)}
      </Draggable>
    );
  }

  // وإلا، اعرض البطاقة العادية
  return renderCardContent();
};

export default ContentCard; 