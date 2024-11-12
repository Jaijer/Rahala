import React from 'react';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow font-sans text-right px-16 py-10 text-xl leading-relaxed" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">سياسة الخصوصية</h1>

        <p className="mb-6">
          في رحالة، خصوصيتك مهمة لنا. لذا سنخبرك كيف نحصل، نستخدم، ننشر، نحمي
          معلوماتك عندما تستعمل منصتنا.
        </p>

        <h2 className="text-2xl font-bold mb-4">البيانات التي نجمعها</h2>
        <ul className="mb-6 list-disc list-inside space-y-3 text-xl">
          <li>
            <span className="font-semibold">المعلومات الشخصية:</span> عندما تحجز رحلة أو تنشئ حساب جديد، سنجمع
            معلوماتك الشخصية التي تتضمن اسمك، رقمك، بريدك الإلكتروني.
          </li>
          <li>ملفات تعريف الارتباط</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">لماذا نستخدم بياناتك؟</h2>
        <ul className="mb-6 list-disc list-inside space-y-3 text-xl">
          <li>لكي نحسن تجربتك الشخصية في استخدام منصتنا</li>
          <li>لكي نعرض لك رحلات مناسبة</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">مع من ننشر بياناتك؟</h2>
        <p className="mb-6 text-xl">
          نحن ننشر بياناتك فقط مع صاحب الحملة و ربما طرف ثالث كالفنادق. نحن لا
          نبيع بياناتك الشخصية لأي أحد.
        </p>

        <h2 className="text-2xl font-bold mb-4">هل بياناتك آمنة؟</h2>
        <p className="mb-6 text-xl">
          نحن نستخدم معايير عالية الجودة لكي نمنع تسرب بياناتك الشخصية.
        </p>

        <p className="text-xl">
          للمزيد من المعلومات يمكنك <Link to="/contact-us" className="text-blue-500 underline">التواصل معنا</Link>.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;


