import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { EditIcon } from '@nextui-org/shared-icons';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import useUserStore from '../../../stores/userDataStore';
import { getAuth } from 'firebase/auth';

function AccountForm() {
  const { userData } = useUserStore();
  const userId = userData?._id; // Access user ID from store

  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
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
        toast.success("User info updated successfully");
      } catch (error) {
        toast.error("Error updating user info");
        console.error("Error updating user info:", error);
      }
    };

    updateUserInfo();
  }

  function handlePhoneChange(e) {
    const value = e.target.value;
    // Allow only one '+' at the start and numbers
    const cleaned = value.replace(/\+/g, '').replace(/[^\d]/g, '');
    setPhoneNumber(cleaned ? `+${cleaned}` : cleaned);
  }

  useEffect(() => {
    if (!userId) return;
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        const userData = response.data;
        setName(userData.name);
        setPhoneNumber(userData.phoneNumber);
        setEmail(userData.email);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <>
      <ToastContainer />
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
          <Input
            label="الجوال"
            value={phoneNumber}
            maxLength={13}
            minLength={13}
            variant="bordered"
            labelPlacement="outside"
            type="tel"
            onChange={handlePhoneChange}
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
    </>
  );
}

export default AccountForm;
