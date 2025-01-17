import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTravelStore from "../../stores/travelStore";
import api from "../../api/axios";
import useUserStore from "../../stores/userDataStore";
import { toast } from "react-toastify";
import { getAuth } from 'firebase/auth';

const BookingCheckout = () => {
  const navigate = useNavigate();
  const { travel, selectedPackage, selectedDate } = useTravelStore();
  const { userData } = useUserStore();  // Get the authenticated user

  useEffect(() => {
    if (!travel) {
      // Delay before going back
      const timeout = setTimeout(() => {
        window.history.back();
      }, 500); // 500ms delay

      return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
    }
  }, [travel, navigate]);

  if (!travel) {
    return (
      <div className="text-center flex justify-center items-center h-full flex-grow">
        يتم تحميل البيانات أو لم يتم العثور على الرحلة.
      </div>
    );
  }
  console.log(userData)

  const { from, destination } = travel;

  // Handle the "دفع" button click
  const handlePayment = async () => {
    if (!userData) {
      // Show an error or handle the case where user, package, or date are not selected
      toast.error("يجب أن تسجل الدخول");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) {
        console.error('User not authenticated');
        return;
      }
    
      const token = await user.getIdToken();

      // Send the travel data to the backend
      const response = await api.post(
        `/api/users/${userData._id}/add-travel`, 
        {
            travelId: travel._id,
            package: selectedPackage.title,
            date: selectedDate,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        }
    );
    

      // After successful registration, navigate to the payment page or another page
      console.log("Travel added to user:", response.data);
      toast.success("تم حجز الرحلة بنجاح");
      navigate("/");
    } catch (err) {
      console.error("Error adding travel:", err);
      toast.error("فشل الحجز، حاول مرة أخرى");
    }
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col items-center">
      <h2 className="text-4xl text-[#1b4348] text-center mb-8">
        تأكيد الطلب والدفع
      </h2>
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg text-right border-2 border-black">
        <div className="text-center font-bold text-[#1b4348] text-3xl mb-6">
          من {from} إلى {destination}
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
          <h3 className="text-2xl font-bold text-black mb-2">قيمة الدفع</h3>
          <p>{selectedPackage?.price || "0"} ريال</p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8 lg:mt-4">
          <button
            onClick={handlePayment}
            className="bg-[#76fc8f] text-black px-8 py-2 rounded-full font-bold text-lg hover:bg-[#5ecc71] transition"
          >
            دفع
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 text-black px-8 py-2 rounded-full font-bold text-lg hover:bg-gray-400 transition"
          >
            عودة
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
