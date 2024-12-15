import React, { useEffect, useState } from 'react';
import { Button, Input, RadioGroup, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import useTravelStore from '../../stores/travelStore';

const CustomRadio = (props) => {
  const {
    Component,
    children,
    description,
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
        "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "bg-white",
        "data-[selected=true]:border-primary",
        props.disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} disabled={props.disabled} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">{description}</span>
        )}
      </div>
    </Component>
  );
};

const BookTrip = () => {
  const navigate = useNavigate();
  const { travel, selectedPackage, selectedDate, setSelectedPackage, setSelectedDate } = useTravelStore();
  const [isRadioGroupValid, setIsRadioGroupValid] = useState(true);
  const [isDateValid, setIsDateValid] = useState(true);

  const handlePackageChange = (pkg) => {
    setSelectedPackage(pkg);
    setIsRadioGroupValid(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDateValid(true);
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

  return (
    <div className="py-8 px-12 font-inter">
      <div className="text-right space-y-6">
        <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">
                {travel.travelName}
              </h2>
              <h2 className="text-xl lg:text-2xl font-bold text-[#757575]">
                {travel.agency?.name}
              </h2>
            </div>

        <div className="flex items-center gap-4 text-2xl lg:text-3xl font-bold text-[#1B4348] py-2">
              <span>{travel.from}</span>
              <span className="text-[#757575]">←</span>
              <span>{travel.destination}</span>
            </div>

        <div className="space-y-4">
          <p className="text-2xl font-semibold text-black">
            باقات السفر
            {!isRadioGroupValid && <span className="text-red-500"> - هذه الخانة مطلوبة</span>}
          </p>
          <p className="text-lg text-[#757575]">اختر البطاقة التي تناسب احتياجك</p>
          <RadioGroup orientation="horizontal" onValueChange={(value) => handlePackageChange(value)}>
            {travel.packages.map((pkg) => (
              <CustomRadio
                key={pkg.title}
                value={pkg}
                description={`السعر: ${pkg.price} ريال`}
              >
                {pkg.title}
              </CustomRadio>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <p className="text-2xl font-semibold text-black">
            تواريخ الرحلة
            {!isDateValid && <span className="text-red-500"> - هذه الخانة مطلوبة</span>}
          </p>
          <RadioGroup orientation="vertical" onValueChange={(value) => handleDateChange(value)}>
            {sortedDates.map((date) => {
              const isPastDate = new Date(date.departure) < currentDate;
              return (
                <CustomRadio
                  key={date.departure}
                  value={date}
                  disabled={isPastDate}
                >
                  {`${new Date(date.departure).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })} - ${new Date(date.arrival).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}`}
                </CustomRadio>
              );
            })}
          </RadioGroup>
        </div>

        <div className="flex justify-center gap-6 pt-16">
          <Button
            className="font-bold text-lg px-8 bg-greeny"
            variant="solid"
            radius="full"
            size="lg"
            onClick={handleSubmit}
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
          >
            عودة&gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookTrip;
