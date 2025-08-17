import React from 'react';
import ContentCard from './ContentCard';

const ContentCardExample: React.FC = () => {
  const handleCardClick = (title: string) => {
    console.log(`تم النقر على: ${title}`);
  };

  const handleOptionsClick = (title: string) => {
    console.log(`خيارات ${title}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">أمثلة على بطاقات المحتوى</h2>
      
      {/* بطاقات عادية */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">البطاقات العادية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            title="كيفية بناء استراتيجية تسويق رقمية ناجحة"
            imageUrl="/src/assets/hero-bg.jpg"
            views={1250}
            likes={89}
            comments={23}
            onClick={() => handleCardClick("كيفية بناء استراتيجية تسويق رقمية ناجحة")}
            onOptionsClick={() => handleOptionsClick("كيفية بناء استراتيجية تسويق رقمية ناجحة")}
          />

          <ContentCard
            title="أساسيات إدارة المشاريع"
            imageUrl="/src/assets/hero-bg.jpg"
            views={890}
            likes={45}
            comments={12}
          />

          <ContentCard
            title="نصائح عملية لتحسين الإنتاجية"
            imageUrl="/src/assets/hero-profile.jpg"
            views={234}
            likes={18}
            comments={5}
            onClick={() => handleCardClick("نصائح عملية لتحسين الإنتاجية")}
          />
        </div>
      </div>

      {/* بطاقات إنفوجرافيك */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">بطاقات الإنفوجرافيك</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            title="دليل شامل لريادة الأعمال"
            imageUrl="/src/assets/hero-profile.jpg"
            views={3420}
            likes={156}
            comments={67}
            isInfographic={true}
            onClick={() => handleCardClick("دليل شامل لريادة الأعمال")}
            onOptionsClick={() => handleOptionsClick("دليل شامل لريادة الأعمال")}
          />

          <ContentCard
            title="خريطة طريق النجاح في ريادة الأعمال"
            imageUrl="/src/assets/hero-bg.jpg"
            views={56700}
            likes={3200}
            comments={890}
            isInfographic={true}
            onClick={() => handleCardClick("خريطة طريق النجاح في ريادة الأعمال")}
            onOptionsClick={() => handleOptionsClick("خريطة طريق النجاح في ريادة الأعمال")}
          />

          <ContentCard
            title="أدوات التسويق الرقمي الأساسية"
            imageUrl="/src/assets/hero-profile.jpg"
            views={8900}
            likes={567}
            comments={123}
            isInfographic={true}
            onClick={() => handleCardClick("أدوات التسويق الرقمي الأساسية")}
          />
        </div>
      </div>

      {/* بطاقات بأرقام كبيرة */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">بطاقات بأرقام كبيرة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContentCard
            title="التقنيات الحديثة في التسويق الرقمي"
            imageUrl="/src/assets/hero-profile.jpg"
            views={1250000}
            likes={89000}
            comments={4500}
            onClick={() => handleCardClick("التقنيات الحديثة في التسويق الرقمي")}
            onOptionsClick={() => handleOptionsClick("التقنيات الحديثة في التسويق الرقمي")}
          />

          <ContentCard
            title="استراتيجيات النمو في العصر الرقمي"
            imageUrl="/src/assets/hero-bg.jpg"
            views={890000}
            likes={67000}
            comments={3200}
            isInfographic={true}
            onClick={() => handleCardClick("استراتيجيات النمو في العصر الرقمي")}
            onOptionsClick={() => handleOptionsClick("استراتيجيات النمو في العصر الرقمي")}
          />
        </div>
      </div>

      {/* بطاقات قابلة للسحب والإفلات */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">بطاقات قابلة للسحب والإفلات</h3>
        <p className="text-gray-600 text-sm">هذه البطاقات تدعم السحب والإفلات مع مقبض السحب</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            id="draggable-1"
            index={0}
            title="مفهوم قابل للسحب 1"
            imageUrl="/src/assets/hero-bg.jpg"
            views={1500}
            likes={120}
            comments={45}
            isDraggable={true}
            onClick={() => handleCardClick("مفهوم قابل للسحب 1")}
            onOptionsClick={() => handleOptionsClick("مفهوم قابل للسحب 1")}
          />

          <ContentCard
            id="draggable-2"
            index={1}
            title="مفهوم قابل للسحب 2"
            imageUrl="/src/assets/hero-profile.jpg"
            views={2300}
            likes={180}
            comments={67}
            isDraggable={true}
            isInfographic={true}
            onClick={() => handleCardClick("مفهوم قابل للسحب 2")}
            onOptionsClick={() => handleOptionsClick("مفهوم قابل للسحب 2")}
          />

          <ContentCard
            id="draggable-3"
            index={2}
            title="مفهوم قابل للسحب 3"
            imageUrl="/src/assets/hero-bg.jpg"
            views={890}
            likes={67}
            comments={23}
            isDraggable={true}
            onClick={() => handleCardClick("مفهوم قابل للسحب 3")}
          />
        </div>
      </div>

      {/* بطاقات بدون مقبض سحب */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">بطاقات قابلة للسحب بدون مقبض</h3>
        <p className="text-gray-600 text-sm">هذه البطاقات قابلة للسحب ولكن بدون مقبض مرئي</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContentCard
            id="draggable-no-handle-1"
            index={3}
            title="مفهوم قابل للسحب بدون مقبض"
            imageUrl="/src/assets/hero-profile.jpg"
            views={1200}
            likes={89}
            comments={34}
            isDraggable={true}
            showDragHandle={false}
            onClick={() => handleCardClick("مفهوم قابل للسحب بدون مقبض")}
            onOptionsClick={() => handleOptionsClick("مفهوم قابل للسحب بدون مقبض")}
          />

          <ContentCard
            id="draggable-no-handle-2"
            index={4}
            title="إنفوجرافيك قابل للسحب بدون مقبض"
            imageUrl="/src/assets/hero-bg.jpg"
            views={3400}
            likes={234}
            comments={89}
            isDraggable={true}
            isInfographic={true}
            showDragHandle={false}
            onClick={() => handleCardClick("إنفوجرافيك قابل للسحب بدون مقبض")}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentCardExample; 