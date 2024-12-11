// src/services/promptAnalyzer.js
const OpenAI = require('../config/openai');

class PromptAnalyzer {
    constructor() {
        this.systemPromptArabic = `أنت مساعد حجز السفر يساعد في تحديد المكونات الرئيسية من استفسارات المستخدم.
مهمتك هي استخراج وإرجاع فقط:
1. مدينة المغادرة
2. مدينة الوصول
3. تفضيلات البحث (مثل: رخيص، فاخر، أفضل قيمة)

قم بإرجاع البيانات بتنسيق JSON بالضبط كما يلي:
{
    "departureCity": "string or null",
    "destinationCity": "string or null",
    "searchPreference": "string or null"
}

استخرج فقط المعلومات المذكورة صراحة. إذا كانت أي معلومات مفقودة، أرجع null لذلك الحقل.
لا تقم بوضع افتراضات أو إضافة معلومات غير موجودة في الاستفسار.`;

        this.systemPromptEnglish = `You are a travel booking assistant that helps identify key components from user queries.
Your task is to extract and return ONLY:
1. Departure city
2. Destination city
3. Search preferences (e.g., cheap, luxury, best value)

Return the data in this exact JSON format:
{
    "departureCity": "string or null",
    "destinationCity": "string or null",
    "searchPreference": "string or null"
}

Only extract information that is explicitly mentioned. If any information is missing, return null for that field.
Do not make assumptions or add information that isn't in the query.`;

        // Define search preference mappings
        this.preferenceMap = {
            // Arabic preferences
            'رخيص': 'cheap',
            'اقتصادي': 'cheap',
            'فاخر': 'luxury',
            'راقي': 'luxury',
            'افضل قيمة': 'best value',
            'افضل سعر': 'best value',
            
            // English preferences
            'cheap': 'cheap',
            'budget': 'cheap',
            'luxury': 'luxury',
            'premium': 'luxury',
            'best value': 'best value',
            'best price': 'best value'
        };
    }

    isArabic(text) {
        // Arabic Unicode range
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return arabicPattern.test(text);
    }

    async analyzePrompt(userQuery) {
        try {
            const isArabicText = this.isArabic(userQuery);
            const systemPrompt = isArabicText ? this.systemPromptArabic : this.systemPromptEnglish;

            const completion = await OpenAI.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userQuery }
                ],
                model: "gpt-3.5-turbo",
                temperature: 0,
                response_format: { type: "json_object" }
            });

            let result = JSON.parse(completion.choices[0].message.content);

            // Normalize the search preference to English
            if (result.searchPreference) {
                const normalizedPreference = this.preferenceMap[result.searchPreference.toLowerCase()];
                if (normalizedPreference) {
                    result.searchPreference = normalizedPreference;
                }
            }

            // Store the original language for response generation
            result.originalLanguage = isArabicText ? 'ar' : 'en';

            console.log('Analyzed prompt result:', result);
            return result;
        } catch (error) {
            console.error('Error analyzing prompt:', error);
            throw new Error('Failed to analyze travel query');
        }
    }

    normalizePreference(preference) {
        if (!preference) return null;
        return this.preferenceMap[preference.toLowerCase()] || preference;
    }
}

module.exports = new PromptAnalyzer();