import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import useTravelStore from '../../stores/travelStore';
import useUserStore from '../../stores/userDataStore';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';

const BookingCheckout = () => {
  const navigate = useNavigate();
  const { travel, selectedPackage, selectedDate } = useTravelStore();
  const { userData } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [remainingCapacity, setRemainingCapacity] = useState(0);

  useEffect(() => {
    if (!travel || !selectedDate) {
      const timeout = setTimeout(() => {
        navigate(-1);
      }, 500);
      return () => clearTimeout(timeout);
    }

    // Calculate remaining capacity for the selected date
    const dateInfo = travel.dates.find(d => 
      new Date(d.departure).getTime() === new Date(selectedDate.departure).getTime() &&
      new Date(d.arrival).getTime() === new Date(selectedDate.arrival).getTime()
    );

    if (dateInfo) {
      setRemainingCapacity(dateInfo.capacity - (dateInfo.bookedCount || 0));
    }
  }, [travel, selectedDate, navigate]);

  const handlePayment = async () => {
    if (!userData) {
      toast.error("يجب تسجيل الدخول للحجز", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (remainingCapacity <= 0) {
      toast.error("عذراً، لا توجد مقاعد متاحة لهذا التاريخ", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      // Format the dates to match the backend's expected format
      const formattedDate = {
        departure: new Date(selectedDate.departure).toISOString(),
        arrival: new Date(selectedDate.arrival).toISOString()
      };

      const response = await api.post(
        `/api/users/${userData._id}/add-travel`,
        {
          travelId: travel._id,
          package: selectedPackage.title,
          date: formattedDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("تم الحجز بنجاح!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Clear any previous timeouts
        if (window.navigationTimeout) {
          clearTimeout(window.navigationTimeout);
        }
        
        // Set a new timeout for navigation
        window.navigationTimeout = setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء الحجز";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!travel || !selectedPackage || !selectedDate) {
    return null;
  }

  return (
    <div className="p-4 lg:p-8 flex flex-col items-center">
      <h2 className="text-4xl text-[#1b4348] text-center mb-8">
        تأكيد الطلب والدفع
      </h2>
      <div className="bg-white/80 w-full max-w-4xl p-8 rounded-lg shadow-lg text-right border-2 border-black">
        <div className="text-center font-bold text-[#1b4348] text-3xl mb-6">
          من {travel.from} إلى {travel.destination}
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">باقة السفر</h3>
          <p className="text-lg text-[#6c757d]">
            {selectedPackage?.title || "غير معروف"}
          </p>
        </div>

        {/* Dates Section Replaces Contact Information */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">تاريخ الرحلة</h3>
          <div className="flex gap-1 text-lg text-[#6c757d]">
            <p>
              {selectedDate
                ? new Date(selectedDate.departure).toLocaleDateString("ar-GB", {
                    day: "numeric",
                    month: "long",
                  })
                : "غير معروف"}
            </p>
            -
            <p>
              {selectedDate
                ? new Date(selectedDate.arrival).toLocaleDateString("ar-GB", {
                    day: "numeric",
                    month: "long",
                  })
                : "غير معروف"}
            </p>
          </div>
        </div>

        <div className="flex flex-col text-lg text-[#6c757d] mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">المقاعد المتبقية:</h3>
          <p>{remainingCapacity}</p>
        </div>

        <div className="flex flex-col text-lg text-[#6c757d] mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">قيمة الدفع</h3>
          <p>{selectedPackage?.price || "0"} ريال</p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8 lg:mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-8 py-2 rounded-full font-bold text-lg hover:bg-gray-400 transition"
          >
            عودة
          </button>
          <button
            onClick={handlePayment}
            className="bg-[#76fc8f] text-black px-8 py-2 rounded-full font-bold text-lg hover:bg-[#5ecc71] transition"
            disabled={loading}
          >
            {loading ? "جاري الحجز..." : "حجز"}
          </button>
        </div>

        <p className="text-sm text-[#6c757d] text-center mt-6">
          من خلال الضغط على "دفع" فإنك توافق على{" "}
          <a href="/terms-of-service" className="text-[#2a9d8f] hover:underline">
            الشروط والأحكام
          </a>{" "}
          الخاصة بمنصة رحلة
        </p>
      </div>
    </div>
  );
};

export default BookingCheckout;
