import React from 'react';
import { Image, Button } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

const ViewTravels = () => {
  const navigate = useNavigate();

  return (
    <div className="font-inter">
      <div className="container mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Agency Info */}
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-[#1B4348]">عدد المقاعد: 10</h2>
              <h2 className="text-xl lg:text-2xl font-bold text-[#1B4348]">حملة أبو علوة</h2>
            </div>

            {/* Route with Arrow */}
            <div className="flex items-center gap-4 text-2xl lg:text-3xl font-bold text-[#1B4348] py-2">
              <span>الظهران</span>
              <span className="text-[#757575]">←</span>
              <span>المدينة المنورة</span>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">وصف الرحلة</h2>
              <p className="text-lg lg:text-xl text-[#757575] max-w-2xl">
                الرحلة تتضمن وجبة الغداء في أول يوم من الوصول (فقط)، كما تقوم الحملة بترتيب رحلات لزيارة عدة معالم في المدينة المنورة ومنها: مسجد قباء، ومسجد القبلتين، والمساجد السبعة.
              </p>
            </div>

            {/* Date Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">تواريخ الرحلة</h2>
              <p className="text-lg lg:text-xl text-[#757575]">
                29 Sep - 5 Oct
              </p>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">سعر الرحلة للفرد</h2>
              <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <p className="text-lg lg:text-xl text-[#757575]">يبدأ من <span className='text-[#1B4348] font-semibold'>1000 ريال</span></p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Image
                isBlurred
                src="https://i.ibb.co/DDn1SwT/hazeem.jpg"
                alt="Travel Image"
                classNames={{
                  wrapper: "flex items-center justify-center",
                  img: "object-cover"
                }}
                radius="lg"
              />
            </div>
          </div>
        </div>

        {/* Buttons Container */}
        <div className="pt-12 flex justify-center items-center gap-6">
          <Button
            className="font-bold text-lg px-8 bg-greeny"
            variant="solid"
            radius="full"
            size="lg"
            onClick={() => navigate('/book-trip')}
          >
            حجز
          </Button>
          <Button 
            className="font-bold text-lg"
            variant="light"
            color="primary"
            radius="full"
            size="lg"
            onClick={() => window.history.back()}
          >
            عودة&gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewTravels;