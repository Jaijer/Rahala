import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { EditIcon } from '@nextui-org/shared-icons';
import { Link } from 'react-router-dom';

function AccountForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+966000000");
  const [isModified, setIsModified] = useState({
    name: false,
    phone: false
  });

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleInputChange(field) {
    return () => {
      setIsModified(prev => ({...prev, [field]: true}));
    };
  }

  function handlePhoneChange(e) {
    const value = e.target.value;
    // Allow only one '+' at the start and numbers
    const cleaned = value.replace(/\+/g, '').replace(/[^\d]/g, '');
    setPhoneNumber(cleaned ? `+${cleaned}` : cleaned);
  }

  const highlightClass = "bg-blue-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="الأول"
          defaultValue="محمد"
          variant="bordered"
          labelPlacement="outside"
          className={isModified.name ? highlightClass : ""}
          onInput={handleInputChange('name')}
          classNames={{
            label: "text-lg mb-3",
            input: "text-lg py-2",
            base: "mb-6",
          }}
        />

      </div>
      
      <div className="space-y-12">
        {/* Password field with hold-to-show functionality */}
        <div className="relative">
          <Input
            label="كلمة المرور"
            type={isPasswordVisible ? "text" : "password"}
            defaultValue="SWE363.com"
            variant="bordered"
            labelPlacement="outside"
            isReadOnly
            onMouseDown={() => setIsPasswordVisible(true)}
            onMouseUp={() => setIsPasswordVisible(false)}
            onMouseLeave={() => setIsPasswordVisible(false)}
            onTouchStart={() => setIsPasswordVisible(true)}
            onTouchEnd={() => setIsPasswordVisible(false)}
            endContent={
              <Link to="/user-settings/reset-password">
                <EditIcon className="w-6 h-6 text-blue-500 hover:text-blue-600" />
              </Link>
            }
            classNames={{
              label: "text-lg mb-3",
              input: "text-lg py-2",
              base: "mb-6",
            }}
          />
        </div>
        
        {/* Read-only email field */}
        <Input
          label="البريد الإلكتروني"
          defaultValue="example@gmail.com"
          variant="bordered"
          labelPlacement="outside"
          isReadOnly
          isDisabled
          classNames={{
            label: "text-lg mb-3",
            input: "text-lg py-2 bg-gray-100",
            base: "mb-6",
          }}
        />
        
        {/* Phone field with single '+' */}
        <Input
          label="الجوال"
          value={phoneNumber}
          variant="bordered"
          labelPlacement="outside"
          type="tel"
          className={isModified.phone ? highlightClass : ""}
          onChange={handlePhoneChange}
          onInput={handleInputChange('phone')}
          classNames={{
            label: "text-lg mb-3",
            input: "text-lg py-2",
            base: "mb-6",
          }}
        />
      </div>
      
      <div className="flex justify-center pt-6">
        <Button 
          color="primary" 
          type="submit" 
          className="w-40 h-14 text-lg"
        >
          حفظ
        </Button>
      </div>
    </form>
  );
}

export default AccountForm;
