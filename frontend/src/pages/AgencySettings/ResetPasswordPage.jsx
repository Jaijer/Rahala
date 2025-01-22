// pages/AgencySettings/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [validationState, setValidationState] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false
  });
  const [message, setMessage] = useState('');

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
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        reauthenticateWithCredential(user, credential).then(() => {
          updatePassword(user, password).then(() => {
            setMessage(<span className="text-green-500">تم تحديث كلمة المرور بنجاح</span>);
          }).catch((error) => {
            console.error('خطأ أثناء تحديث كلمة المرور:', error);
            setMessage(<span className="text-red-500">حدث خطأ أثناء تحديث كلمة المرور</span>);
          });
        }).catch((error) => {
          console.error('خطأ أثناء تحديث كلمة المرور:', error);
          setMessage(<span className="text-red-500">كلمة المرور الحالية غير صحيحة.</span>);
        });
      } else {
        console.error('No user is currently signed in.');
      }
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
            label="كلمة المرور الحالية"
            type="password"
            placeholder="أدخل كلمة المرور الحالية"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              label: "text-lg mb-2",
              input: "text-lg py-2",
            }}
          />

          <Input
            label="كلمة المرور الجديدة"
            type="password"
            placeholder="أدخل كلمة المرور الجديدة"
            value={password}
            onChange={handlePasswordChange}
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              label: "text-lg mb-2",
              input: "text-lg py-2",
            }}
          />

          <div className="space-y-2 text-sm">
            <p className={getValidationColor(validationState.isLongEnough)}>
              • يجب أن تحتوي على 8 أحرف على الأقل
            </p>
            <p className={getValidationColor(validationState.hasLowerCase)}>
              • يجب أن تحتوي على حرف صغير واحد على الأقل
            </p>
            <p className={getValidationColor(validationState.hasUpperCase)}>
              • يجب أن تحتوي على حرف كبير واحد على الأقل
            </p>
            <p className={getValidationColor(validationState.hasNumber)}>
              • يجب أن تحتوي على رقم واحد على الأقل
            </p>
            <p className={getValidationColor(validationState.hasSpecialChar)}>
              • يجب أن تحتوي على رمز خاص واحد على الأقل (*&^%$#@!)
            </p>
          </div>

          {message && <div className="text-center">{message}</div>}

          <Button 
            type="submit" 
            color="primary"
            className="w-full h-12 text-lg"
            disabled={!Object.values(validationState).every(value => value)}
          >
            تحديث كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
