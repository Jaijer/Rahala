import React from 'react';
import { Image } from "@nextui-org/image";
import { useNavigate } from 'react-router-dom';

function TravelCard({ travel }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 bg-white rounded-3xl w-full h-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:cursor-pointer"
    onClick={() => navigate(`/view-travels/${travel._id}`)}
>
      {/* Image at the top */}
      <div className="w-full h-48 rounded-t-3xl overflow-hidden">
        <Image
          alt="صورة الاعلان"
          src={travel.image}
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Information at the bottom */}
      <div className="flex flex-col gap-2 px-4 pb-3">
        {/* Price */}
        <div className="px-4 py-1 flex gap-1 rounded-full bg-beige text-darkGreen w-fit">
          <span>{travel.packages[0].price}</span> 
          <span>ريال</span>
        </div>

        {/* Destination */}
        <div className="flex gap-1 text-darkGreen text-lg lg:text-xl flex-wrap">
          <span>
            {travel.from}
          </span>
          <span>←</span>
          <span>
            {travel.destination}
          </span>
        </div>

        {/* Agency */}
        <span className="text-grayish">{travel.agency?.name}</span>

        {/* Dates */}
        <div className="flex gap-1 text-grayish">
          <span>
            {new Date(travel.dates[0].departure).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}
          </span>
          -
          <span>
            {new Date(travel.dates[0].arrival).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TravelCard;
