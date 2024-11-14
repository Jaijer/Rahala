import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const BookingCheckout = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Navigate to /payment when the button is clicked
  const handlePaymentClick = () => {
    navigate("/payment");
  };

  return (
    <div className="p-4 lg:p-8 flex flex-col items-center ">
      <h2 className="text-4xl text-[#1b4348] text-center mb-8">تأكيد الطلب والدفع</h2>
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg text-right border-2 border-black">
        <p className="text-lg text-[#6c757d] text-center mb-4">
          رحلة ذهاب وإياب. تاريخ السفر يبدأ من 25 سبتمبر وينتهي في 29 سبتمبر
        </p>
        <div className="text-center font-bold text-[#1b4348] text-3xl mb-6">
          من الظهران إلى المدينة المنورة
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">باقات السفر</h3>
          <p className="text-lg text-[#6c757d]">باقة فردية</p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">معلومات التواصل</h3>
          <div className="flex justify-between lg:justify-center lg:gap-16">
            <div className="flex flex-col items-center text-lg text-[#6c757d]">
              <p className="font-bold text-black">رقم الهاتف</p>
              <p>05XXXXXXXX</p>
            </div>
            <div className="flex flex-col items-center text-lg text-[#6c757d]">
              <p className="font-bold text-black">البريد الإلكتروني</p>
              <p>example@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col text-lg text-[#6c757d] mb-6">
          <h3 className="text-2xl font-bold text-black mb-2">قيمة الدفع</h3>
          <p>1000 ريال</p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8 lg:mt-4">
          <button
            onClick={handlePaymentClick}
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
