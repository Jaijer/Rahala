import React, { useState } from 'react';
import { Button, Input, RadioGroup, useRadio, VisuallyHidden, cn } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

// CustomRadio Component
const CustomRadio = (props) => {
  const {
    Component,
    children,
    isSelected,
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
        "bg-white", // Set background color to white
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

function BookTrip() {
  const [selectedOption, setSelectedOption] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRadioGroupValid, setIsRadioGroupValid] = useState(true);
  const [isContactInfoValid, setIsContactInfoValid] = useState(true);
  const navigate = useNavigate();

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setIsRadioGroupValid(true); // Reset validation on selection
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate radio group and contact fields
    const isValidRadio = !!selectedOption;
    const isValidContact = email !== '' && phone !== '';
    setIsRadioGroupValid(isValidRadio);
    setIsContactInfoValid(isValidContact);

    // Navigate if all validations pass
    if (isValidRadio && isValidContact) {
      navigate("/booking-checkout");
    }
  };

  return (
    <div className="p-8 font-inter">
      <div className="text-right space-y-6">
        {/* Travel Information */}
        <p className="text-lg text-[#757575]">
          رحلة ذهاب وإياب . تاريخ السفر يبدأ من 25 سبتمبر وينتهي في 29 سبتمبر
        </p>
        <p className="text-2xl text-[#1B4348] font-bold">
          من الظهران إلى المدينة المنورة
        </p>
        <p className="text-xl text-[#1B4348] font-bold">
          عدد المقاعد المتاحة: 10
        </p>

        {/* Travel Packages */}
        <div className="space-y-4">
          <p className="text-2xl font-semibold text-black">
            باقات السفر
            {!isRadioGroupValid && <span className="text-red-500"> - هذه الخانة مطلوبة</span>}
          </p>
          <p className="text-lg text-[#757575]">اختر البطاقة التي تناسب احتياجك</p>
          <RadioGroup
            orientation="horizontal"
            value={selectedOption}
            onValueChange={handleOptionChange}
          >
            {[
              { label: 'باقة رباعية', description: 'السعر: 625 ريال', value: 'باقة رباعية' },
              { label: 'باقة ثلاثية', description: 'السعر: 700 ريال', value: 'باقة ثلاثية' },
              { label: 'باقة ثنائية', description: 'السعر: 900 ريال', value: 'باقة ثنائية' },
              { label: 'باقة فردية', description: 'السعر: 1000 ريال', value: 'باقة فردية' }
            ].map((option) => (
              <CustomRadio
                key={option.value}
                value={option.value}
                description={option.description}
              >
                {option.label}
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
              onChange={(e) => {
                setEmail(e.target.value);
                setIsContactInfoValid(true); // Reset validation on input
              }}
              required
              className="bg-white" // Set background color to white
              variant='bordered'
            />
            <Input
              fullWidth
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsContactInfoValid(true); // Reset validation on input
              }}
              required
              className="bg-white" // Set background color to white
              variant='bordered'
            />
          </div>
        </div>

        {/* Submit Button and Link */}
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
}

export default BookTrip;
