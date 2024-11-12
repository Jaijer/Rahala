import React from 'react';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function TermsAndConditions() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-grow font-sans text-right px-16 py-10 text-2xl" dir="rtl">
          <h1 className="text-4xl font-bold mb-8">الشروط و الأحكام</h1>

          <ol className="list-decimal list-inside space-y-8 text-2xl leading-loose">
            <li>
              <span className="font-bold text-blue-700">استخدام الموقع:</span> توافق على استخدام موقعنا بشكل مسؤول وبطريقة لا تعطل تشغيله أو تؤثر سلباً على تجربة المستخدمين الآخرين.
            </li>
            <li>
              <span className="font-bold text-blue-700">الحساب:</span> إذا قمت بإنشاء حساب، فأنت مسؤول عن الحفاظ على تفاصيل تسجيل الدخول آمنة وعن جميع الأنشطة التي تتم عبر حسابك.
            </li>
            <li>
              <span className="font-bold text-blue-700">الحجوزات والمدفوعات:</span> عند حجز رحلة من خلال موقعنا، توافق على تقديم معلومات دقيقة. المدفوعات غير قابلة للاسترداد ما لم يُنص على خلاف ذلك من قبل وكالة السفر.
            </li>
            <li>
              <span className="font-bold text-blue-700">الروابط الخارجية:</span> قد نقوم بإضافة روابط إلى خدمات أطراف ثالثة. نحن غير مسؤولين عن محتواهم أو خدماتهم.
            </li>
            <li>
              <span className="font-bold text-blue-700">الحظر:</span> يمكننا تعليق أو إنهاء وصولك إلى موقعنا إذا انتهكت هذه الشروط.
            </li>
            <li>
              <span className="font-bold text-blue-700">عدم وجود ضمانات:</span> نقدم الموقع كما هو، دون تقديم أي وعود بأنه سيكون متاحاً دائماً أو خالياً من الأخطاء.
            </li>
            <li>
              <span className="font-bold text-blue-700">التغييرات على الشروط و الأحكام:</span> قد نقوم بتحديث هذه الشروط. يرجى مراجعة هذه الصفحة لمعرفة أي تغييرات.
            </li>
          </ol>

          <p className="mt-10 text-2xl">
            للمزيد من المعلومات يمكنك <Link to="/contact-us" className="text-blue-500 underline">التواصل معنا</Link>.
          </p>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default TermsAndConditions;
