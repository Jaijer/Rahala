import { Accordion, AccordionItem } from "@nextui-org/react";

export default function FAQsSection() {
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-semibold text-darkGreen text-xl", // Dark green and larger title
    content: "text-lg px-2",
  };

  return (
    <div className="px-8 md:px-32 mb-24">
      <h3 className="text-grayish text-center lg:text-start text-lg">اعرف أكثر مع</h3>
      <h2 className="text-darkGreen font-semibold text-center lg:text-start text-3xl lg:text-4xl">الأسئلة الشائعة</h2>

      <Accordion selectionMode="multiple" className="mt-6" itemClasses={itemClasses} variant="light">
        <AccordionItem
          key="1"
          aria-label="هل تأخذون فلوس زيادة؟"
          title="هل تأخذون فلوس زيادة؟"
          className="data-[open=true]:bg-lightGreen p-4 rounded-2xl transition-all" // Apply light green background when opened
        >
          لا والعياذ بالله، احنا مجرد ممر بسيط بينك وبين الحملة ولا ناخذ رسوم.
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="هل الموقع موثق من هيئة سوق المال؟"
          title="هل الموقع موثق من هيئة سوق المال؟"
          className="data-[open=true]:bg-lightGreen p-4 rounded-2xl transition-all"
        >
          نعم، الموقع موثق ومتابع من هيئة سوق المال.
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="هل عندكم رحلات طيران؟"
          title="هل عندكم رحلات طيران؟"
          className="data-[open=true]:bg-lightGreen p-4 rounded-2xl transition-all"
        >
          نعم، نقدم خدمات حجز رحلات طيران بأسعار تنافسية.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
