import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { EditIcon } from '@nextui-org/shared-icons';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import useUserStore from '../../../stores/userDataStore';
import { getAuth } from 'firebase/auth';
import { Spinner } from "@nextui-org/spinner";

function AccountForm() {
  const { userData } = useUserStore();
  const userId = userData?._id; // Access user ID from store

  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: ''
  });

  const validatePhoneNumber = (inputPhoneNumber) => {
    if (!inputPhoneNumber) return 'رقم الهاتف مطلوب';
    
    const saudiPhoneRegex = /^05\d{8}$/;
    
    if (!saudiPhoneRegex.test(inputPhoneNumber)) {
      return 'يرجى التأكد من صحة تطابق رقم الهاتف مع الصيغة المطلوبة';
    }
    
    return '';
  };

  function handleSubmit(e) {
    e.preventDefault();
    
    const phoneNumberError = validatePhoneNumber(phoneNumber);
    setErrors({ phoneNumber: phoneNumberError });
    
    if (phoneNumberError) {
      return;
    }

    const updateUserInfo = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
      
        if (!user) {
          console.error('User not authenticated');
          return;
        }
      
        const token = await user.getIdToken();

        await api.put(`/api/users/user-settings/${userId}`, {
          name,
          phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("تم تحديث المعلومات بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث المعلومات");
        console.error("Error updating user info:", error);
      }
    };

    updateUserInfo();
  }

  function handlePhoneChange(e) {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d]/g, '');
    setPhoneNumber(cleaned);
    setErrors(prev => ({
      ...prev,
      phoneNumber: validatePhoneNumber(cleaned)
    }));
  }

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        const userData = response.data;
        setName(userData.name);
        setPhoneNumber(userData.phoneNumber);
        setEmail(userData.email);
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("حدث خطأ أثناء تحميل المعلومات");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center h-screen" style={{ marginTop: '-25%', marginLeft: '-20%'}}>
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="الاسم"
              value={name}
              variant="bordered"
              labelPlacement="outside"
              onChange={(e) => setName(e.target.value)}
              classNames={{
                label: "text-lg mb-3",
                input: "text-lg py-2",
                base: "mb-6",
              }}
            />
          </div>
          <div className="space-y-12">
            <div className="relative">
              <Input
                label="كلمة المرور"
                type={"password"}
                defaultValue="SWE363.com"
                variant="bordered"
                labelPlacement="outside"
                isReadOnly
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
            <Input
              label="البريد الإلكتروني"
              value={email}
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
            <div className="flex flex-col gap-1">
              <Input
                label="الجوال"
                value={phoneNumber}
                maxLength={10}
                variant="bordered"
                labelPlacement="outside"
                type="tel"
                placeholder="05XXXXXXXX"
                onChange={handlePhoneChange}
                classNames={{
                  label: "text-lg mb-3",
                  input: "text-lg py-2",
                  base: "mb-6",
                }}
                isInvalid={!!errors.phoneNumber}
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
              )}
            </div>
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
      )}
    </>
  );
}

export default AccountForm;
