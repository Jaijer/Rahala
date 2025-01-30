import React, { useState, useEffect, useRef } from 'react';
import { FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";  // Add this import
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSearchStore from '../stores/searchStore';
import AutocompleteInput from './AutocompleteInput';

const mockLocations = [
  // المدن السعودية الرئيسية
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", 
  "الخبر", "الطائف", "تبوك", "أبها", "الباحة", "القطيف",
  "الأحساء", "حائل", "الجبيل", "ينبع", "نجران", "جازان",
  "بريدة", "الخرج", "المجمعة", "عرعر", "سكاكا", "الجوف",
  "بيشة", "الظهران", "خميس مشيط", "القريات", "رفحاء", "عنيزة", "المملكة العربية السعودية",

  // دول الخليج والشرق الأوسط
  "البحرين", "الإمارات", "قطر", "عمان", "الكويت",
  "دبي", "أبو ظبي", "الشارقة", "مسقط", "صلالة",
  "الدوحة", "المنامة", "مدينة الكويت",

  // دول عربية سياحية
  "مصر", "لبنان", "الأردن", "المغرب", "تونس",
  "القاهرة", "الإسكندرية", "شرم الشيخ", "الغردقة",
  "بيروت", "جونية", "عمّان", "البتراء", "الدار البيضاء",
  "مراكش", "فاس", "الحمامات", "جربة", "سوسة",

  // آسيا
  "تركيا", "ماليزيا", "إندونيسيا", "تايلند", "جورجيا",
  "أذربيجان", "المالديف", "سيريلانكا", "اليابان", "كوريا الجنوبية",
  "سنغافورة", "الفلبين", "فيتنام", "كمبوديا",
  "اسطنبول", "أنطاليا", "كوالالمبور", "بالي", "بانكوك",
  "تبليسي", "باكو", "طوكيو", "سيول", "مانيلا",
  "هانوي", "بنوم بنه", "بوكيت",

  // أوروبا
  "بريطانيا", "فرنسا", "إيطاليا", "إسبانيا", "النمسا",
  "سويسرا", "ألمانيا", "هولندا", "بلجيكا", "اليونان",
  "البرتغال", "التشيك", "المجر", "كرواتيا", "أيرلندا",
  "لندن", "باريس", "روما", "مدريد", "برشلونة",
  "فيينا", "زيورخ", "برلين", "أمستردام", "بروكسل",
  "أثينا", "لشبونة", "براغ", "بودابست", "دبلن",
  "ميلانو", "ميونخ", "هامبورج", "جنيف", "سالزبورغ",

  // الأمريكتين
  "الولايات المتحدة", "كندا", "البرازيل", "الأرجنتين", 
  "نيويورك", "لوس أنجلوس", "ميامي", "لاس فيغاس",
  "تورنتو", "فانكوفر", "مونتريال", "ريو دي جانيرو",
  "بوينس آيرس", "سان فرانسيسكو", "شيكاغو"
];

const CustomDatePickerInput = React.forwardRef(({ value, onClick, placeholder, onClear }, ref) => (
  <div className="relative w-full flex items-center cursor-pointer">
    <input 
      readOnly 
      value={value} 
      ref={ref} 
      placeholder={placeholder} 
      className="w-full bg-transparent text-right text-white text-lg lg:text-xl placeholder-white border-none focus:outline-none pr-12 pl-4 cursor-pointer" 
      onClick={onClick}
    />
    {value && (
      <IoCloseCircle 
        className="absolute left-20 sm:left-5 text-white text-3xl cursor-pointer hover:scale-110 transition-all" 
        onClick={onClear}
      />
    )}
    <FaCalendarAlt className="absolute right-4 text-white text-2xl" onClick={onClick} />
  </div>
));

export default function SearchBar() {
  const navigate = useNavigate();
  const { 
    departure, 
    destination, 
    date, 
    setDeparture, 
    setDestination, 
    setDate, 
    setAlterSearch 
  } = useSearchStore();
  
  const [selectedDate, setSelectedDate] = useState();
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (date instanceof Date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  }, [date]);

  const handleDateChange = (newDate) => {
    if (newDate instanceof Date) {
      setSelectedDate(newDate);
      setDate(newDate);
    }
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    setDate(null);
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
          placeholderText='تاريخ الذهاب'
          selected={selectedDate}
          onChange={handleDateChange}
          customInput={
            <CustomDatePickerInput 
              placeholder="تاريخ الذهاب" 
              onClear={handleClearDate} 
            />
          }
          dateFormat="dd/MM/yyyy"
          showYearDropdown 
          scrollableYearDropdown 
          yearDropdownItemNumber={15}
        />
      </div>
      <button 
        className="bg-greeny rounded-2xl lg:rounded-full p-0.5 lg:p-2 text-darkGreen flex items-center justify-center hover:bg-opacity-90" 
        onClick={() => {
          navigate('/search');
          setAlterSearch(prev => !prev);
        }}
      >
        <IoSearch className='w-9 h-9 lg:h-10 lg:w-10'/>
      </button>
    </div>
  );
}