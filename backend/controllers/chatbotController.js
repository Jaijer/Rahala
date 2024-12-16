// backend/controllers/chatbotController.js
const Travel = require('../models/Travel');
const OpenAI = require('openai');

class ChatbotController {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  isArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
  }

  async handleMessage(req, res) {
    try {
      console.log('Received message:', req.body);
      const { text, conversationHistory = [] } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // 1. Detect language
      const isArabicText = this.isArabic(text);
      console.log('Language detected:', isArabicText ? 'Arabic' : 'English');

      // 2. Check if the query is travel-related
      const relevanceCheck = await this.checkTravelRelevance(text, isArabicText, conversationHistory);
      console.log('Relevance check:', relevanceCheck);

      if (!relevanceCheck.isTravelRelated) {
        const response = {
          output: relevanceCheck.response,
          processDetails: {
            language: { isArabic: isArabicText },
            relevanceCheck: relevanceCheck,
            prompts: relevanceCheck.prompt
          }
        };
        return res.json(response);
      }

      // 3. Extract travel information
      const travelInfo = await this.extractTravelInfo(text, isArabicText, conversationHistory);
      console.log('Extracted travel info:', travelInfo);

      // 4. Generate response
      const response = await this.generateResponse(text, travelInfo, isArabicText, conversationHistory);

      return res.json(response);

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = this.isArabic(text) ?
        'عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.' :
        'Sorry, an error occurred. Please try again.';

      res.status(500).json({
        error: 'Processing error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async checkTravelRelevance(text, isArabicText, conversationHistory) {
    try {
      // Create a context string from conversation history
      const contextString = conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const relevancePrompt = isArabicText ?
        `أنت مساعد محترف في وكالة. تحقق مما إذا كان النص المدخل يتعلق بالسفر أو السياحة.
        
        سياق المحادثة السابقة:
        ${contextString}
        
        النص الجديد: "${text}"
        
        1. هل يسأل المستخدم عن السفر أو السياحة بشكل مباشر؟
        2. هل يذكر المستخدم موقعه فقط دون ذكر نية السفر؟
        3. هل يشير إلى معلومات سابقة في المحادثة؟
        
        قم بإرجاع رد مناسب:
        - إذا كان السؤال متعلق بالسفر، أجب: "نعم"
        - إذا كان يذكر موقعه فقط، اسأله إذا كان يريد السفر من هذا الموقع
        - إذا كان السؤال غير متعلق بالسفر، اقترح عليه كيف يمكن أن يستفيد من خدمات السفر لدينا` :

        `You are a professional assistant. Check if the input text is related to travel or tourism.
        
        Previous conversation context:
        ${contextString}
        
        New text: "${text}"
        
        1. Is the user asking about travel or tourism directly?
        2. Is the user only mentioning their location without travel intent?
        3. Are they referring to information from previous messages?
        
        Generate an appropriate response:
        - If the question is travel-related, respond with "YES"
        - If they're only mentioning location, ask if they want to travel from there
        - If the question is not travel-related, suggest how our travel services might be helpful`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: relevancePrompt },
          ...conversationHistory,
          { role: "user", content: text }
        ],
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;
      const isTravelRelated = response.toLowerCase().includes('yes') ||
        response.toLowerCase().includes('نعم');

      return {
        isTravelRelated,
        response,
        prompt: relevancePrompt
      };
    } catch (error) {
      console.error('Error in checkTravelRelevance:', error);
      throw error;
    }
  }

  async extractTravelInfo(text, isArabicText, conversationHistory) {
    try {
      // Create a context string from conversation history
      const contextString = conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const systemPrompt = isArabicText ?
        `أنت مساعد سفر محترف. حلل النص المدخل واستخرج:
        - مدينة المغادرة
        - مدينة الوصول
        - تفضيل السعر (رخيص، فاخر، افضل قيمة)
        
        سياق المحادثة السابقة:
        ${contextString}
        
        النص الجديد: "${text}"
        
        قم بإرجاع المعلومات بتنسيق JSON كالتالي:
        {
          "departureCity": "المدينة أو null",
          "destinationCity": "المدينة أو null",
          "preference": "رخيص" | "فاخر" | "افضل قيمة" | null
        }

        ملاحظات مهمة:
        - استخدم المعلومات من المحادثة السابقة إذا كانت ذات صلة
        - استخرج فقط المعلومات المذكورة صراحة
        - إذا لم يتم ذكر أي معلومات، أرجع null
        - لا تفترض أي معلومات` :

        `You are a professional travel assistant. Analyze the input text and extract:
        - Departure city (in arabic)
        - Destination city (in arabic)
        - Price preference (cheap, luxury, best value) (in arabic)
        
        Previous conversation context:
        ${contextString}
        
        New text: "${text}"
        
        Return the information in JSON format as:
        {
          "departureCity": "المدينة or null",
          "destinationCity": "المدينة or null",
          "preference": "رخيص" | "فاخر" | "افضل قيمة" | null
        }

        Important notes:
        - Use information from previous conversation if relevant
        - Only extract explicitly mentioned information
        - Return null for any missing information
        - Do not make assumptions`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: text }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('Error in extractTravelInfo:', error);
      throw error;
    }
  }

  async searchTravels(departureCity, destinationCity, preference) {
    try {
      let query = { isAvailable: true };

      if (departureCity) {
        query.from = new RegExp(departureCity, 'i');
      }

      if (destinationCity) {
        query.destination = new RegExp(destinationCity, 'i');
      }

      let travels = await Travel.find(query)
        .populate('agency', 'name')
        .select('-__v')
        .lean();

      if (preference) {
        travels = travels.filter(t =>
          t.packages.some(p => p.category === preference)
        );
      }

      return travels.slice(0, 5);
    } catch (error) {
      console.error('Error in searchTravels:', error);
      throw error;
    }
  }

  formatSearchResults(results) {
    return results.map((trip, index) => {
      const packages = trip.packages
        .map(pkg => `   - ${pkg.title}: ${pkg.price} ${pkg.category === 'رخيص' ? 'SAR' : 'ريال'} (${pkg.category})`)
        .join('\n');

      return `Trip ${index + 1}:
   Name: ${trip.travelName}
   From: ${trip.from}
   To: ${trip.destination}
   Packages:\n${packages}`;
    }).join('\n\n');
  }

  async generateResponse(originalText, travelInfo, isArabicText, conversationHistory) {
    try {
      // Handle case where no departure city but destination city exists
      if (!travelInfo.departureCity && travelInfo.destinationCity) {
        const destinationInfoPrompt = isArabicText ?
          `أنت مساعد سفر محترف ومتحمس. المستخدم سأل عن ${travelInfo.destinationCity} في المحادثة التالية:

          سياق المحادثة السابقة:
          ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
          
          الرسالة الجديدة: "${originalText}"
          
          قم بإنشاء رد:
          1. يبدي حماساً إيجابياً تجاه الوجهة ويذكر ميزة أو اثنتين عنها
          2. يذكر بلطف أننا نحتاج معرفة مدينة المغادرة لعرض الرحلات المتاحة
          3. يسأل عن مدينة المغادرة
          4. يحافظ على أسلوب ودي ومتحمس` :

          `You are an enthusiastic professional travel assistant. The user asked about ${travelInfo.destinationCity} in the following conversation:

          Previous conversation:
          ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
          
          New message: "${originalText}"
          
          Create a response that:
          1. Shows positive enthusiasm about the destination and mentions 1-2 key features
          2. Politely mentions that we need their departure city to show available trips
          3. Asks for their departure city
          4. Maintains a friendly and enthusiastic tone`;

        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: destinationInfoPrompt },
            ...conversationHistory,
            { role: "user", content: originalText }
          ],
          temperature: 0.7
        });

        return {
          output: completion.choices[0].message.content,
          searchResults: [],
          processDetails: {
            language: { isArabic: isArabicText },
            extractedInfo: travelInfo,
            prompts: destinationInfoPrompt
          }
        };
      }

      // Handle case where neither departure nor destination is specified
      if (!travelInfo.departureCity && !travelInfo.destinationCity) {
        const noLocationPrompt = isArabicText ?
          `أنت مساعد سفر محترف. راجع المحادثة التالية:

          سياق المحادثة السابقة:
          ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
          
          الرسالة الجديدة: "${originalText}"
          
          قم بإنشاء رد:
          1. يسأل عن مدينة المغادرة والوجهة المفضلة
          2. يقترح إمكانية مساعدتهم في اختيار وجهة مناسبة
          3. يحافظ على أسلوب ودي ومهني` :

          `You are a professional travel assistant. Review the following conversation:

          Previous conversation:
          ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
          
          New message: "${originalText}"
          
          Create a response that:
          1. Asks for both departure city and preferred destination
          2. Offers to help them choose a suitable destination
          3. Maintains a friendly and professional tone`;

        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: noLocationPrompt },
            ...conversationHistory,
            { role: "user", content: originalText }
          ],
          temperature: 0.7
        });

        return {
          output: completion.choices[0].message.content,
          searchResults: [],
          processDetails: {
            language: { isArabic: isArabicText },
            extractedInfo: travelInfo,
            prompts: noLocationPrompt
          }
        };
      }

      // Search for available trips
      const searchResults = await this.searchTravels(
        travelInfo.departureCity,
        travelInfo.destinationCity,
        travelInfo.preference
      );

// Continue from previous code...
const contextString = conversationHistory
.map(msg => `${msg.role}: ${msg.content}`)
.join('\n');

const resultsPrompt = isArabicText ?
(searchResults.length > 0 ? 
  `أنت مساعد سفر محترف. قم بالرد على استفسار المستخدم مع مراعاة سياق المحادثة:
  
  سياق المحادثة السابقة:
  ${contextString}
  
  الرسالة الجديدة: "${originalText}"

  الرحلات المتوفرة:
  ${this.formatSearchResults(searchResults)}

  قم بإنشاء رد:
  - يراعي سياق المحادثة السابقة
  - يتضمن معلومات عن الرحلات المتوفرة
  - يذكر التفاصيل المهمة مثل الأسعار والوجهات
  - يكون مفيد وودود
  - يحافظ على إيجاز وتركيز الرد` :
  
  `أنت مساعد سفر محترف. قم بالرد على استفسار المستخدم:
  
  سياق المحادثة السابقة:
  ${contextString}
  
  الرسالة الجديدة: "${originalText}"

  للأسف، لا توجد رحلات متاحة حاليًا بين ${travelInfo.departureCity} و ${travelInfo.destinationCity}.

  قم بإنشاء رد:
  - يراعي سياق المحادثة السابقة
  - يعتذر بأدب عن عدم وجود رحلات
  - يقترح بدائل محتملة
  - يكون مفيد وودود
  - يحافظ على إيجاز وتركيز الرد`) :

(searchResults.length > 0 ?
  `You are a professional travel assistant. Respond to the user's query considering the conversation context:
  
  Previous conversation:
  ${contextString}
  
  New message: "${originalText}"

  Available trips:
  ${this.formatSearchResults(searchResults)}

  Create a response that:
  - Considers the previous conversation context
  - Includes information about available trips
  - Mentions important details like prices and destinations
  - Is helpful and friendly
  - Keeps the response concise and focused` :
  
  `You are a professional travel assistant. Respond to the user's query:
  
  Previous conversation:
  ${contextString}
  
  New message: "${originalText}"

  Unfortunately, no trips are currently available between ${travelInfo.departureCity} and ${travelInfo.destinationCity}.

  Create a response that:
  - Considers the previous conversation context
  - Politely apologizes for the lack of available trips
  - Suggests possible alternatives
  - Is helpful and friendly
  - Keeps the response concise and focused`);

const completion = await this.openai.chat.completions.create({
model: "gpt-3.5-turbo",
messages: [
  { role: "system", content: resultsPrompt },
  ...conversationHistory,
  { role: "user", content: originalText }
],
temperature: 0.7
});

return {
output: completion.choices[0].message.content,
searchResults: searchResults,
processDetails: {
  language: { isArabic: isArabicText },
  extractedInfo: travelInfo,
  prompts: resultsPrompt
}
};

} catch (error) {
console.error('Error in generateResponse:', error);
throw error;
}
}
}

module.exports = new ChatbotController();