import React from 'react';
import { Image } from '@nextui-org/image';
import { useNavigate } from 'react-router-dom';

function TravelCard({ travel }) {
  const navigate = useNavigate();
  
  const { travelName, from, destination, image } = travel.travel;
  const { _id, package: selectedPackage, date, numberOfTravelers } = travel;
  
  const departureDate = date.departure;
  const arrivalDate = date.arrival;

  const handleClick = () => {
    navigate(`/dashboard/bookings/${_id}`);
  };

  return (
    <div 
      className="flex flex-row lg:h-64 bg-white/80 shadow-lg rounded-3xl w-full transform transition-all duration-300 hover:shadow-2xl hover:cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="w-full md:w-1/4 h-64 md:rounded-bl-none rounded-r-3xl overflow-hidden">
        <Image 
          src={image} 
          alt={travelName} 
          width={300}
          height={300}
          className="w-full h-full object-cover rounded-none"
        />
      </div>

      {/* Information Section */}
      <div className="flex flex-col justify-center flex-wrap w-full md:w-3/5 p-4 md:p-6 gap-4 py-4">
        {/* Travel Name */}
        <h3 className="text-xl font-semibold">{travelName}</h3>
        
        {/* Destination */}
        <div className="text-lg text-darkGreen flex gap-1 flex-wrap">
          <span>{from}</span>
          <span>←</span>
          <span>{destination}</span>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col gap-3">
          {/* Date */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">التاريخ:</span>
            <span className="text-md text-gray-600">
              {new Date(departureDate).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}
              {' - '}
              {new Date(arrivalDate).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          {/* Package */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">الباقة:</span>
            <span className="text-md text-gray-600">{selectedPackage}</span>
          </div>

          {/* Number of Travelers */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">عدد المسافرين:</span>
            <span className="text-md text-gray-600">{numberOfTravelers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelCard;