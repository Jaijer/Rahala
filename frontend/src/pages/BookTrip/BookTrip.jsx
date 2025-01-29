import React, { useEffect, useState } from 'react';
import { Button, RadioGroup, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import { 
  FaRoute, 
  FaBuilding, 
  FaChevronLeft, 
  FaBoxOpen,
  FaCalendarAlt,
  FaChevronRight,
  FaExclamationCircle,
  FaPlus,
  FaMinus,
  FaUsers
} from "react-icons/fa";
import useTravelStore from '../../stores/travelStore';


const CustomRadio = (props) => {
  const {
    Component,
    children,
    description,
    extraInfo,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "w-full cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "bg-white",
        "data-[selected=true]:border-[#1b4348]",
        props.disabled && "opacity-50 cursor-not-allowed"
      )}
      dir="rtl"
    >
      <VisuallyHidden>
        <input {...getInputProps()} disabled={props.disabled} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()} className="w-full">
        <div className="flex justify-between items-center">
          <span {...getLabelProps()} className="block text-lg">{children}</span>
          {extraInfo && (
            <span className={cn(
              "text-sm",
              props.disabled && props.noSeats ? "text-red-500" : "text-[#6c757d]"
            )}>
              {props.disabled && props.noSeats ? "لا توجد مقاعد متاحة" : extraInfo}
            </span>
          )}
        </div>
        {description && (
          <span className="text-[#6c757d] block mt-1">{description}</span>
        )}
      </div>
    </Component>
  );
};

const ErrorMessage = ({ message }) => (
  <div className="flex items-center gap-2 text-red-500 bg-red-50 p-2 rounded-lg" dir="rtl">
    <FaExclamationCircle size={16} />
    <span className="text-sm">{message}</span>
  </div>
);

const TravelersCounter = ({ availableSeats, numberOfTravelers, setNumberOfTravelers }) => (
  <div className="bg-white/80 p-4 rounded-lg shadow-lg border mt-6 max-w-md mx-auto">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FaUsers size={20} className="text-[#1b4348]" />
        <h2 className="text-lg font-bold text-[#1b4348]">عدد المسافرين</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          className="rounded-full w-8 h-8 min-w-0"
          onClick={() => setNumberOfTravelers(Math.min(numberOfTravelers + 1, availableSeats))}
          disabled={numberOfTravelers >= availableSeats}
        >
          <FaPlus size={12} />
        </Button>
        
        <span className="text-lg font-bold w-8 text-center">{numberOfTravelers}</span>
        
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          className="rounded-full w-8 h-8 min-w-0"
          onClick={() => setNumberOfTravelers(Math.max(numberOfTravelers - 1, 1))}
          disabled={numberOfTravelers <= 1}
        >
          <FaMinus size={12} />
        </Button>
      </div>
    </div>
    
    <p className="text-sm text-[#6c757d] mt-2 text-left">
      المقاعد المتاحة: {availableSeats??0}
    </p>
  </div>
);

const BookTrip = () => {
  const navigate = useNavigate();
  const { 
    travel, 
    selectedPackage, 
    selectedDate, 
    numberOfTravelers,
    setSelectedPackage, 
    setSelectedDate,
    setNumberOfTravelers 
  } = useTravelStore();
  
  const [isRadioGroupValid, setIsRadioGroupValid] = useState(true);
  const [isDateValid, setIsDateValid] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [selectedDateId, setSelectedDateId] = useState("");

  const handlePackageChange = (value) => {
    const pkg = travel.packages.find(p => p._id === value);
    setSelectedPackage(pkg);
    setSelectedPackageId(value);
    setIsRadioGroupValid(true);
  };

  const handleDateChange = (value) => {
    const date = travel.dates.find(d => d._id === value);
    setSelectedDate(date);
    setSelectedDateId(value);
    setIsDateValid(true);
    // Reset number of travelers when date changes
    setNumberOfTravelers(1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValidRadio = !!selectedPackage;
    const isValidDate = !!selectedDate;
    setIsRadioGroupValid(isValidRadio);
    setIsDateValid(isValidDate);

    if (isValidRadio && isValidDate) {
      navigate('/booking-checkout');
    }
  };

  useEffect(() => {
    if (!travel) {
      const timeout = setTimeout(() => {
        window.history.back();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [travel, navigate]);

  if (!travel) return null;

  // Sort dates and disable past dates
  const sortedDates = travel.dates.slice().sort((a, b) => new Date(a.departure) - new Date(b.departure));
  const currentDate = new Date();

  const getAvailableSeats = (date) => {
    if(!date) {
      return null
    }
    return date.capacity - date.bookedCount;
  };

  return (
    <div className="font-inter" dir="rtl">
      <div className="container mx-auto px-8 lg:px-16 py-8">
        {/* Agency Info */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4 mb-4">
            <FaRoute size={24} className="text-[#1B4348]" />
            {travel.travelName}
          </h2>
          <h2 className="text-xl lg:text-2xl font-bold text-[#757575] flex items-center gap-4">
            <FaBuilding size={20} className="text-[#757575]" />
            {travel.agency?.name}
          </h2>
        </div>

        {/* Packages and Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Packages Section */}
          <div className="bg-white/80 p-5 sm:p-8 rounded-lg shadow-lg border">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <FaBoxOpen size={24} className="text-[#1b4348]" />
                <h2 className="text-2xl font-bold text-[#1b4348]">باقات السفر</h2>
              </div>
              {!isRadioGroupValid && (
                <ErrorMessage message="يرجى اختيار باقة السفر" />
              )}
              <p className="text-lg text-[#6c757d] mb-4">اختر البطاقة التي تناسب احتياجك</p>
              <RadioGroup 
                value={selectedPackageId}
                onValueChange={handlePackageChange}
                className="space-y-4"
              >
                {travel.packages.map((pkg) => (
                  <CustomRadio
                    key={pkg._id}
                    value={pkg._id}
                    description={`السعر: ${pkg.price} ريال`}
                  >
                    {pkg.title}
                  </CustomRadio>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Dates Section */}
          <div className="bg-white/80 p-5 sm:p-8 rounded-lg shadow-lg border">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <FaCalendarAlt size={24} className="text-[#1b4348]" />
                <h2 className="text-2xl font-bold text-[#1b4348]">تواريخ الرحلة</h2>
              </div>
              {!isDateValid && (
                <ErrorMessage message="يرجى اختيار تاريخ الرحلة" />
              )}
              <p className="text-lg text-[#6c757d] mb-4">اختر التاريخ المناسب</p>
              <RadioGroup 
                value={selectedDateId}
                onValueChange={handleDateChange}
                className="space-y-4"
              >
                {sortedDates.map((date) => {
                  const isPastDate = new Date(date.departure) < currentDate;
                  const availableSeats = getAvailableSeats(date);
                  const isFullyBooked = availableSeats === 0;
                  
                  return (
                    <CustomRadio
                      key={date._id}
                      value={date._id}
                      disabled={isPastDate || isFullyBooked}
                      extraInfo={`${availableSeats} مقعد متاح`}
                    >
                      {`${new Date(date.departure).toLocaleDateString('ar-GB', { day: 'numeric', month: 'long' })} - ${new Date(date.arrival).toLocaleDateString('ar-GB', { day: 'numeric', month: 'long' })}`}
                    </CustomRadio>
                  );
                })}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Travelers Counter Section - Only show when both package and date are selected */}
        <TravelersCounter
          availableSeats={getAvailableSeats(selectedDate)}
          numberOfTravelers={numberOfTravelers}
          setNumberOfTravelers={setNumberOfTravelers}
        />

        {/* Buttons Container */}
        <div className="pt-12 flex justify-center items-center gap-6">
          <Button
            className="font-bold text-lg px-8 bg-greeny"
            variant="solid"
            radius="full"
            size="lg"
            onClick={handleSubmit}
            startContent={<FaChevronRight size={18} />}
          >
            تقدم
          </Button>
          <Button
            className="font-bold text-lg"
            variant="light"
            color="primary"
            radius="full"
            size="lg"
            onClick={() => window.history.back()}
            endContent={<FaChevronLeft size={18} />}
          >
            عودة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookTrip;