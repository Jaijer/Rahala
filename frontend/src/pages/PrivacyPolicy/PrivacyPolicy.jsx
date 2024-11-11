import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="font-sans text-right px-16 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">سياسة الخصوصية</h1>
      <p className="mb-6">
        في رحالة، خصوصيتك مهمة لنا. لذا سنخبرك كيف نحصل، نستخدم، ننشر، نحمي
        معلوماتك عندما تستعمل منصتنا.
      </p>

      <h2 className="text-xl font-bold mb-3">البيانات التي نجمعها</h2>
      <ul className="mb-6 list-disc list-inside space-y-2">
        <li>
          <span className="font-semibold">المعلومات الشخصية:</span> عندما تحجز رحلة أو تنشئ حساب جديد، سنجمع
          معلوماتك الشخصية التي تتضمن اسمك، رقمك، بريدك الإلكتروني.
        </li>
        <li>ملفات تعريف الارتباط</li>
      </ul>

      <h2 className="text-xl font-bold mb-3">لماذا نستخدم بياناتك؟</h2>
      <ul className="mb-6 list-disc list-inside space-y-2">
        <li>لكي نحسن تجربتك الشخصية في استخدام منصتنا</li>
        <li>لكي نعرض لك رحلات مناسبة</li>
      </ul>

      <h2 className="text-xl font-bold mb-3">مع من ننشر بياناتك؟</h2>
      <p className="mb-6">
        نحن ننشر بياناتك فقط مع صاحب الحملة و ربما طرف ثالث كالفنانين. نحن لا
        نبيع بياناتك الشخصية لأي أحد.
      </p>

      <h2 className="text-xl font-bold mb-3">هل بياناتك آمنة؟</h2>
      <p className="mb-6">
        نحن نستخدم معايير عالية الجودة لكي نمنع تسرب بياناتك الشخصية.
      </p>

      <p>
        للمزيد من المعلومات يمكنك <a href="#contact" className="text-blue-500 underline">التواصل معنا</a>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
