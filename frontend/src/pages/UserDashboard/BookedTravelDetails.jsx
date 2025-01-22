import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Button, Spinner } from "@nextui-org/react";
import { 
  FaRoute, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaLongArrowAltLeft,
  FaBuilding,
  FaPhone,
  FaBox,
  FaChevronLeft
} from "react-icons/fa";
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../../api/axios';

function BookedTravelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user) return;
      
      try {
        const token = await user.getIdToken();
        const response = await api.get(`/api/users/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBooking(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookingDetails();
    }
  }, [id, user]);

  const handleCancel = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await api.delete(`/api/users/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        لم يتم العثور على الحجز
      </div>
    );
  }

  const { travel, date, package: selectedPackage } = booking;

  return (
    <div className="font-inter">
      <div className="container mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Agency Info */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaRoute size={24} className="text-[#1B4348] ml-2" />
                {travel.travelName}
              </h2>
              <h2 className="text-xl lg:text-2xl font-bold text-[#757575] flex items-center gap-4">
                <FaBuilding size={20} className="text-[#757575] ml-2" />
                {travel.agency?.name}
              </h2>
            </div>

            {/* Route with Arrow */}
            <div className="flex items-center gap-6 text-2xl lg:text-3xl font-bold text-[#1B4348] py-2">
              <span>{travel.from}</span>
              <FaLongArrowAltLeft size={24} className="text-[#757575] mx-2" />
              <span>{travel.destination}</span>
            </div>

            {/* Description Section */}
            <div className="space-y-4 bg-white/60 border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaInfoCircle size={24} className="text-[#1B4348] ml-2" />
                وصف الرحلة
              </h2>
              <p className="text-lg lg:text-xl text-[#757575] max-w-2xl">
                {travel.description}
              </p>
            </div>

            {/* Selected Date Section */}
            <div className="space-y-4 bg-white/60 border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaCalendarAlt size={24} className="text-[#1B4348] ml-2" />
                تاريخ الحجز
              </h2>
              <div className="text-lg lg:text-xl text-[#757575] flex items-center gap-4">
                <span>
                  {new Date(date.departure).toLocaleDateString('ar-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <FaLongArrowAltLeft size={16} className="text-[#757575] mx-2" />
                <span>
                  {new Date(date.arrival).toLocaleDateString('ar-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Package Section */}
            <div className="space-y-4 bg-white/60 border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaBox size={24} className="text-[#1B4348] ml-2" />
                الباقة المختارة
              </h2>
              <p className="text-lg lg:text-xl text-[#757575]">
                {selectedPackage}
              </p>
            </div>

            {/* Agency Contact */}
            <div className="space-y-4 bg-white/60 border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaPhone size={24} className="text-[#1B4348] ml-2" />
                معلومات التواصل
              </h2>
              <div className="text-lg lg:text-xl text-[#757575] space-y-2">
                <p>اسم الحملة: {travel.agency?.name}</p>
                <p>رقم الهاتف: {travel.agency?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-4 flex items-start justify-center">
            <div className="w-full max-w-md">
              <Image
                isBlurred
                src={travel.image}
                alt={travel.travelName}
                classNames={{
                  wrapper: "flex items-center justify-center",
                  img: "object-cover rounded-xl shadow-lg",
                }}
                radius="lg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-12 flex justify-center items-center gap-6">
          {/* <Button
            color="danger"
            className="font-bold text-lg px-8"
            variant="solid"
            radius="full"
            size="lg"
            onClick={handleCancel}
          >
            إلغاء الحجز
          </Button> */}
          <Button
            className="font-bold text-lg px-8 bg-greeny"
            variant="solid"
            radius="full"
            size="lg"
            onClick={() => navigate('/dashboard')}
            startContent={<FaChevronLeft size={18} />}
          >
            العودة للوحة التحكم
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookedTravelDetails;
