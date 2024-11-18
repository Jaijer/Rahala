import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Button, Spinner } from "@nextui-org/react";
import api from '../../api/axios';
import useTravelStore from '../../stores/travelStore';

const ViewTravels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { travel, setTravel } = useTravelStore();

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await api.get(`api/travels/${id}`);
        setTravel(response.data); // Store travel data in Zustand
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
  }, [id, setTravel]);

  if (loading) {
    return <div className="flex justify-center items-center h-full flex-grow">
      <Spinner />
    </div>;
  }

  if (!travel) {
    return <div className="text-center flex justify-center items-center h-full flex-grow">لم يتم العثور على الرحلة</div>;
  }

  return (
    <div className="font-inter">
      <div className="container mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Agency Info */}
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-[#1B4348]">
                عدد المقاعد: {travel.capacity}
              </h2>
              <h2 className="text-xl lg:text-2xl font-bold text-[#1B4348]">
                {travel.agency?.name}
              </h2>
            </div>

            {/* Route with Arrow */}
            <div className="flex items-center gap-4 text-2xl lg:text-3xl font-bold text-[#1B4348] py-2">
              <span>{travel.from}</span>
              <span className="text-[#757575]">←</span>
              <span>{travel.destination}</span>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">وصف الرحلة</h2>
              <p className="text-lg lg:text-xl text-[#757575] max-w-2xl">
                {travel.description}
              </p>
            </div>

            {/* Date Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">تواريخ الرحلة</h2>
              <ul className="text-lg lg:text-xl text-[#757575]">
                {travel.dates.map((date) => (
                  <li key={date._id}>
                    {new Date(date.departure).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    -
                    {new Date(date.arrival).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">سعر الرحلة للفرد</h2>
              <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <p className="text-lg lg:text-xl text-[#757575]">
                  يبدأ من <span className='text-[#1B4348] font-semibold'>{travel.packages[0]?.price} ريال</span>
                </p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Image
                isBlurred
                src={travel.image}
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
