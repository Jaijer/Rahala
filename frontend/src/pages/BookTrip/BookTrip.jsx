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
        "data-[selected=true]:border-primary"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRadioGroupValid, setIsRadioGroupValid] = useState(true);
  const [isDateValid, setIsDateValid] = useState(true);
  const [isContactInfoValid, setIsContactInfoValid] = useState(true);

  const handlePackageChange = (pkg) => {
    setSelectedPackage(pkg); // Now passing the entire package object
    setIsRadioGroupValid(true); // Reset validation
  };

  const handleDateChange = (date) => {
    setSelectedDate(date); // Now passing the entire date object
    setIsDateValid(true); // Reset validation
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate inputs
    const isValidRadio = !!selectedPackage;
    const isValidDate = !!selectedDate;
    const isValidContact = email !== '' && phone !== '';
    setIsRadioGroupValid(isValidRadio);
    setIsDateValid(isValidDate);
    setIsContactInfoValid(isValidContact);

    if (isValidRadio && isValidDate && isValidContact) {
      navigate('/booking-checkout');
    }
  };

  useEffect(() => {
    if (!travel) {
      // Delay before going back
      const timeout = setTimeout(() => {
        window.history.back();
      }, 500); // 500ms delay

      return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
    }
  }, [travel, navigate]);

  if (!travel) return null;

  return (
    <div className="p-8 font-inter">
      <div className="text-right space-y-6">
        {/* Travel Details */}
        <div className='space-y-3'>
          <p className="text-2xl text-[#1B4348] font-bold">
            من {travel.from} إلى {travel.destination}
          </p>
          <p className="text-xl text-[#1B4348] font-bold">
            عدد المقاعد المتاحة: {travel.capacity}
          </p>
        </div>

        {/* Travel Packages */}
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
                value={pkg} // Pass the entire package object
                description={`السعر: ${pkg.price} ريال`}
              >
                {pkg.title}
              </CustomRadio>
            ))}
          </RadioGroup>
        </div>

        {/* Travel Dates */}
        <div className="space-y-4">
          <p className="text-2xl font-semibold text-black">
            تواريخ الرحلة
            {!isDateValid && <span className="text-red-500"> - هذه الخانة مطلوبة</span>}
          </p>
          <RadioGroup orientation="vertical" onValueChange={(value) => handleDateChange(value)}>
            {travel.dates.map((date) => (
              <CustomRadio
                key={date.departure}
                value={date} // Pass the entire date object
              >
                {`${new Date(date.departure).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })} - ${new Date(date.arrival).toLocaleDateString('ar-GB', { day: 'numeric', month: 'short' })}`}
              </CustomRadio>
            ))}
          </RadioGroup>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <p className="text-2xl font-semibold text-black">
            معلومات التواصل
            {!isContactInfoValid && <span className="text-red-500"> - هذه الخانة مطلوبة</span>}
          </p>
          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              fullWidth
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white"
              variant="bordered"
            />
            <Input
              fullWidth
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-white"
              variant="bordered"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-6 pt-8">
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
