import React from 'react';
import { Image } from '@nextui-org/image'; // Import Image component from NextUI

function TravelCard({ travel }) {
  // Destructuring the props
  const { travelName, from, destination, image } = travel.travel;
  const { package: selectedPackage, date } = travel;
  
  // Extracting departure and arrival dates
  const departureDate = date.departure.toLocaleDateString();
  const arrivalDate = date.arrival.toLocaleDateString();

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-3xl w-full h-full transform transition-all duration-300 hover:shadow-2xl hover:cursor-pointer">
      {/* Image */}
      <div className="w-full md:w-2/5 h-48 md:h-64 rounded-t-3xl md:rounded-l-3xl overflow-hidden">
        <Image 
          src={image} 
          alt={travelName} 
          objectFit="cover" 
          className="w-full h-full"
        />
      </div>

      {/* Information Section */}
      <div className="flex flex-col justify-center w-full md:w-3/5 p-4 md:p-6 gap-2 py-4">
        {/* Travel Name */}
        <h3 className="text-xl font-semibold">{travelName}</h3>
        
        {/* Destination */}
        <div className="text-lg text-darkGreen flex gap-1 flex-wrap">
          <span>{from}</span>
          <span>-</span>
          <span>{destination}</span>
        </div>

        {/* Date Label */}
        <div className='mt-2'>
          <span className='text-lg font-medium'>التاريخ:</span>
          <span className='flex gap-2 text-md font-medium text-gray-600 mt-2'>
            <span>
                {new Date(departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
            -
            <span>
                {new Date(arrivalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </span>
        </div>

        {/* Package */}
        <div>
          <div className="text-lg font-medium">الباقة:</div>
          <div className="text-md text-gray-600">{selectedPackage}</div>
        </div>
      </div>
    </div>
  );
}

export default TravelCard;
