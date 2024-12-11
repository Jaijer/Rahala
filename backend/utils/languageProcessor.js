// src/utils/languageProcessor.js

class LanguageProcessor {
    isArabic(text) {
        // Arabic Unicode range for more accurate detection
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return arabicPattern.test(text);
    }

    getSystemPrompt(isArabic) {
        if (isArabic) {
            return `أنت مساعد سفر محترف. قم بتحليل طلب المستخدم وفهم:
- مدينة المغادرة 
- مدينة الوصول
- أي تفضيلات إضافية مثل السعر أو مستوى الخدمة
استخدم هذه المعلومات للبحث عن أفضل الخيارات المتاحة.`;
        }
        
        return `You are a professional travel assistant. Analyze the user request to understand:
- Departure city
- Destination city 
- Any additional preferences like price or service level
Use this information to search for the best available options.`;
    }
}

module.exports = new LanguageProcessor();