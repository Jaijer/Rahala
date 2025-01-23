import React from 'react';
import { Image } from '@nextui-org/image'; // Import Image component from NextUI
import { useNavigate } from 'react-router-dom';

function TravelCard({ travel }) {
  const navigate = useNavigate();
  
  // Log the travel object to see its structure
  console.log('Travel object:', travel);
  
  // Destructuring the props
  const { travelName, from, destination, image } = travel.travel;
  const { _id, package: selectedPackage, date } = travel;
  
  // Log the selectedPackage to see its structure
  console.log('Selected package:', selectedPackage);
  
  // Extracting departure and arrival dates
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
      <div className="flex flex-col justify-center flex-wrap w-full md:w-3/5 p-4 md:p-6 gap-1.5 py-4">
        {/* Travel Name */}
        <h3 className="text-xl font-semibold">{travelName}</h3>
        
        {/* Destination */}
        <div className="text-lg text-darkGreen flex gap-1 flex-wrap mt-1">
          <span>{from}</span>
          <span>←</span>
          <span>{destination}</span>
        </div>

        {/* Date Label */}
        <div className='mt-2'>
          <span className='text-lg font-medium'>التاريخ:</span>
          <span className='flex gap-2 text-md font-medium text-gray-600'>
            <span>
              {new Date(departureDate).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}
            </span>
            -
            <span>
              {new Date(arrivalDate).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}
            </span>
          </span>
        </div>

        {/* Package */}
        <div className='mt-2'>
          <span className='text-lg font-medium'>الباقة:</span>
          <div className='flex gap-2 text-md font-medium text-gray-600'>
            <span>{selectedPackage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelCard;
