import React from 'react';
import { FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { Input } from "@nextui-org/react";
import useSearchStore from '../stores/searchStore';

export default function SearchBar() {
  const navigate = useNavigate();

  // Use Zustand store to get and set search variables
  const { departure, destination, date, setDeparture, setDestination, setDate } = useSearchStore();

  const commonInputProps = {
    classNames: {
      base: "max-w-full",
      mainWrapper: "h-full",
      input: "text-right text-white text-xl placeholder:text-white",
      inputWrapper: "h-full bg-transparent rounded-full border-none",
    },
    variant: 'bordered'
  };

  return (
    <div className='bg-darkGreen text-white text-3xl w-full rounded-3xl lg:rounded-full flex flex-col lg:flex-row justify-between'>
      <Input
        {...commonInputProps}
        placeholder="الخروج من"
        startContent={<FaHome className="text-white" />}
        value={departure}
        onChange={(e) => setDeparture(e.target.value)} // Update departure in the store
      />
      <Input
        {...commonInputProps}
        placeholder="الوجهة"
        startContent={<FaLocationDot className="text-white" />}
        value={destination}
        onChange={(e) => setDestination(e.target.value)} // Update destination in the store
      />
      <Input
        type='date'
        {...commonInputProps}
        placeholder="تاريخ الذهاب"
        startContent={<FaCalendarAlt className="text-white" />}
        value={date}
        onChange={(e) => setDate(e.target.value)} // Update date in the store
      />
      <button 
        className="bg-greeny rounded-2xl lg:rounded-full m-2 p-1 lg:p-2 text-darkGreen flex items-center justify-center"
        onClick={() => navigate('/search')}
      >
        <IoSearch className='w-10 h-10'/>
      </button>
    </div>
  );
}
