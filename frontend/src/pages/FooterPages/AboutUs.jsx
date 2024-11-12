import React from 'react';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow font-sans text-right px-16 py-10 text-xl leading-relaxed" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">من نحن</h1>

        <p className="mb-8">
          مرحبا بكم في رحالة، المنصة التي يثق فيها كل من يريد أن يحجز رحلات سفر
          عبر أنحاء العالم. مهمتنا هي جعل السفر أكثر سهولة، أكثر متعة و متاح لأي أحد.
        </p>

        <h2 className="text-2xl font-bold mb-4">لماذا نحن ؟</h2>
        <ul className="mb-8 list-disc list-inside space-y-3 text-xl">
          <li>نقدم واجهة سهلة للمستخدم مع خيارات متنوعة</li>
          <li>شراكتنا مع جهات موثوقة لضمان جودة الرحلات</li>
          <li>نقدم أحدث المعلومات عن رحلاتنا</li>
          <li>جاهزون لتقديم خدمة عميل رائعة</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">فريق العمل</h2>
        <ul className="mb-8 list-disc list-inside space-y-3 text-xl">
          <li>أحمد حمادة</li>
          <li>عبد الله الجشي</li>
          <li>علي آل سليس</li>
          <li>مرتضى البيك</li>
          <li>حسن آل ناصر</li>
        </ul>

        <p className="text-xl">
          للمزيد من المعلومات يمكنك <Link to="/contact-us" className="text-blue-500 underline">التواصل معنا</Link>.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutUs;
