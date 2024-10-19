import React, { useState, useEffect, useRef } from 'react';
import { FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSearchStore from '../stores/searchStore';
import AutocompleteInput from './AutocompleteInput';

const mockLocations = [
  "القطيف", "صفوى", "سيهات", "المدينة", "أبها", "الطايف", "حائل", "تبوك", "تركيا", "ماليزيا", "اتلانتا", "شرم الشيخ", "الأحساء", "البحرين"
];


const CustomDatePickerInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="relative w-full flex items-center cursor-pointer" onClick={onClick}>
    <input
      readOnly
      value={value}
      ref={ref}
      placeholder={placeholder}
      className="w-full bg-transparent text-right text-white text-lg lg:text-xl placeholder-white border-none focus:outline-none pr-12 pl-4 cursor-pointer"
    />
    <FaCalendarAlt className="absolute right-4 text-white text-2xl" />
  </div>
));

export default function SearchBar() {
  const navigate = useNavigate();
  const { departure, destination, date, setDeparture, setDestination, setDate } = useSearchStore();
  const [selectedDate, setSelectedDate] = useState(date instanceof Date ? date : new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (date instanceof Date) {
      setSelectedDate(date);
    }
  }, [date]);

  const handleDateChange = (newDate) => {
    if (newDate instanceof Date) {
      setSelectedDate(newDate);
      setDate(newDate);
    }
  };

  return (
    <div className='bg-darkGreen text-white text-3xl w-full rounded-3xl lg:rounded-full flex flex-col lg:flex-row justify-between p-2 gap-3'>
      <AutocompleteInput
        value={departure}
        onChange={setDeparture}
        placeholder="الخروج من"
        icon={FaHome}
        suggestions={mockLocations}
      />
      <AutocompleteInput
        value={destination}
        onChange={setDestination}
        placeholder="الوجهة"
        icon={FaLocationDot}
        suggestions={mockLocations}
      />
      <div className="flex items-center -mt-1 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-3xl" ref={datePickerRef}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          customInput={<CustomDatePickerInput placeholder="تاريخ الذهاب" />}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={15}
        />
      </div>
      <button 
        className="bg-greeny rounded-2xl lg:rounded-full p-0.5 lg:p-2 text-darkGreen flex items-center justify-center"
        onClick={() => navigate('/search')}
      >
        <IoSearch className='w-9 h-9 lg:h-10 lg:w-10'/>
      </button>
    </div>
  );
}