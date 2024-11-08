import React from 'react';
import TravelCard from './TravelCard';

function PreviousTravels({ travels }) {
  return (
    <div className="flex flex-col gap-6">
      <div className='text-xl md:text-2xl font-semibold'>حجوزات سابقة</div>
        <div className='flex flex-col gap-6'>
          {travels.map((travel) => {
            return <TravelCard key={travel.travel.travelName} travel={travel} />;
          })}
        </div>
    </div>
  );
}

export default PreviousTravels;
