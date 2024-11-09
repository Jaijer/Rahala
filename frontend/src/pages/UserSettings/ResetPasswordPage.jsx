// pages/UserSettings/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [validationState, setValidationState] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false
  });

  function handlePasswordChange(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Update validation state
    setValidationState({
      hasLowerCase: /[a-z]/.test(newPassword),
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[*&^%$#@!]/.test(newPassword),
      isLongEnough: newPassword.length >= 8
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Check if all validation criteria are met
    const isValid = Object.values(validationState).every(value => value);
    
    if (isValid) {
      // Proceed with password reset
      console.log('Password reset request submitted');
    } else {
      console.log('Please meet all password requirements');
    }
  }

  // Helper function to get text color based on validation
  function getValidationColor(isValid) {
    return isValid ? 'text-green-600' : 'text-gray-600';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="Rahala Logo" className="h-14 w-14" />
        <h1 className="text-3xl font-bold mr-2">رحالة</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
          <Input
            label="البريد الإلكتروني"
            defaultValue="Example@gmail.com"
            isDisabled
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              label: "text-lg mb-2",
              input: "text-lg py-2 bg-gray-100",
            }}
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={handlePasswordChange}
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              label: "text-lg mb-2",
              input: "text-lg py-2",
            }}
          />

          <div className="text-sm space-y-2">
            <p className="text-gray-600">• يجب أن تحتوي كلمة المرور الخاصة بك على:</p>
            <p className={getValidationColor(validationState.isLongEnough)}>
              • 8 أحرف على الأقل
            </p>
            <p className="text-gray-600">• على الأقل من العناصر التالية:</p>
            <ul className="list-disc list-inside pr-4 space-y-1">
              <li className={getValidationColor(validationState.hasLowerCase)}>
                أحرف صغيرة (a-z)
              </li>
              <li className={getValidationColor(validationState.hasUpperCase)}>
                أحرف كبيرة (A-Z)
              </li>
              <li className={getValidationColor(validationState.hasNumber)}>
                أرقام (0-9)
              </li>
              <li className={getValidationColor(validationState.hasSpecialChar)}>
                أحرف خاصة (مثل *&^%$#@!)
              </li>
            </ul>
          </div>

          <Button 
            color="primary"
            className="w-full h-14 text-lg rounded-xl"
            type="submit"
            isDisabled={!Object.values(validationState).every(value => value)}
          >
            إعادة تعيين كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;