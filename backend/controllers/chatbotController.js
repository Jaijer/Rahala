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

  async handleMessage(req, res) {
    try {
      console.log('Received message:', req.body);
      const { text, conversationHistory = [] } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Detect language
      const isArabic = /[\u0600-\u06FF]/.test(text);
      console.log('Language detected:', isArabic ? 'Arabic' : 'English');

      try {
        console.log('Checking relevance...');
        const relevantResponse = await this.checkRelevance(text, isArabic);
        console.log('Relevance response:', relevantResponse);

        console.log('Checking relevance...');
        const relevanceResult = await this.checkRelevance(text, isArabic);
        console.log('Relevance response:', relevanceResult);
      
        if (!relevanceResult.relevant) {
          // Use the custom response from GPT
          return res.json({
            output: relevanceResult.response
          });
        }
      
          // Continue with travel search...
        console.log('Extracting and translating travel info...');
        const travelInfo = await this.extractTravelInfo(text, isArabic, conversationHistory);
        console.log('Processed travel info:', travelInfo);

        console.log('Searching travels...');
        const searchResults = await this.searchTravels(travelInfo);
        console.log('Search results:', searchResults);

        console.log('Generating response...');
        const response = await this.generateResponse(text, searchResults, isArabic, conversationHistory);
        console.log('Generated response:', response);

        return res.json({ 
          output: response,
          searchResults: searchResults 
        });

      } catch (error) {
        console.error('Error in processing:', error);
        throw error;
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = 'عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.' ;
 
      
      res.status(500).json({
        error: 'Processing error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async checkRelevance(text, isArabic) {
    try {
      // First, check if it's travel related
      const relevanceCheck = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: isArabic ?
              "تحقق إذا كان السؤال متعلق بالسفر أو رحلات أو الإجازة أو أي شي قريب. أجب بـ نعم أو لا فقط." :
              "Check if query is related to travel, trips, or vacation. Reply only with yes or no."
          },
          { role: "user", content: text }
        ],
        temperature: 0
      });
  
      const isRelevant = relevanceCheck.choices[0].message.content.toLowerCase().includes('yes') || 
                        relevanceCheck.choices[0].message.content.toLowerCase().includes('نعم');
  
      // If not relevant, generate a friendly redirection response
      if (!isRelevant) {
        const friendlyResponse = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: isArabic ?
                `أنت مساعد سفر ودود. قم بإنشاء رد:
                - يظهر اهتمامك بموضوع المستخدم
                - يربط موضوع المستخدم بفكرة سفر مناسبة
                - يقترح رحلة أو نشاط سفر متعلق باهتمامهم
                - يكون الرد قصير وموجه` :
                `You are a friendly travel assistant. Create a response that:
                - Shows interest in user's topic
                - Connects their topic to a relevant travel idea
                - Suggests a trip or travel activity related to their interest
                - Keep it concise and focused`
            },
            { 
              role: "user", 
              content: `User's message: ${text}. Generate a friendly response connecting their interest to travel.`
            }
          ],
          temperature: 0.7
        });
  
        return {
          relevant: false,
          response: friendlyResponse.choices[0].message.content
        };
      }
  
      return {
        relevant: true
      };
  
    } catch (error) {
      console.error('Error in checkRelevance:', error);
      throw error;
    }
  }

  async translateToArabic(text) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a translator. Translate the given text to Arabic. Respond ONLY with the translation."
          },
          { role: "user", content: text }
        ],
        temperature: 0
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async extractTravelInfo(text, isArabic) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: isArabic ?
              `أنت مساعد سفر. قم بتحليل النص واستخراج:
              - مدينة المغادرة
              - مدينة الوصول
              - تفضيلات السفر (إن وجدت) مثل رخيص، فاخر، أفضل قيمة
              
              قم بإرجاع المعلومات بتنسيق JSON كالتالي:
              {
                "departureCity": "المدينة أو null",
                "destinationCity": "المدينة أو null",
                "preference": "رخيص" | "فاخر" | "افضل قيمة" | null
              }` :
              `You are a travel assistant. Analyze the text and extract:
              - Departure city
              - Destination city
              - Travel preferences (if any) such as cheap, luxury, or best value
              
              Return the information in JSON format as:
              {
                "departureCity": "city or null",
                "destinationCity": "city or null",
                "preference": "cheap" | "luxury" | "best_value" | null
              }`
          },
          { role: "user", content: text }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      });
  
      const extractedInfo = JSON.parse(completion.choices[0].message.content);
  
      // If query was in English, translate everything to Arabic
      if (!isArabic) {
        // Translate cities to Arabic if they exist
        if (extractedInfo.departureCity) {
          extractedInfo.departureCity = await this.translateToArabic(extractedInfo.departureCity);
        }
        if (extractedInfo.destinationCity) {
          extractedInfo.destinationCity = await this.translateToArabic(extractedInfo.destinationCity);
        }
  
        // Map English preferences to Arabic
        const prefMap = {
          'cheap': 'رخيص',
          'luxury': 'فاخر',
          'best_value': 'افضل قيمة'
        };
        if (extractedInfo.preference) {
          extractedInfo.preference = prefMap[extractedInfo.preference.toLowerCase()] || extractedInfo.preference;
        }
      }
  
      return extractedInfo;
    } catch (error) {
      console.error('Error in extractTravelInfo:', error);
      throw error;
    }
  }

  async searchTravels({ departureCity, destinationCity, preference }) {
    try {
      let query = { isAvailable: true };
      
      if (departureCity) {
        query.from = new RegExp(departureCity, 'i');
      }
      
      if (destinationCity) {
        query.destination = new RegExp(destinationCity, 'i');
      }

      console.log('Search query:', JSON.stringify(query, null, 2));

      let travels = await Travel.find(query)
        .populate('agency', 'name')
        .select('-__v')
        .lean();

      console.log(`Found ${travels.length} travels before filtering`);

      const prefMap = {
        'رخيص': 'economy',
        'فاخر': 'luxury',
        'افضل قيمة': 'best_value'
      };

      if (preference && prefMap[preference]) {
        travels = travels.filter(t => 
          t.packages.some(p => p.category === prefMap[preference])
        );
      }

      // Sort based on preference
      switch(preference) {
        case 'رخيص':
          travels.sort((a, b) => 
            Math.min(...a.packages.map(p => p.price)) - 
            Math.min(...b.packages.map(p => p.price))
          );
          break;
        case 'فاخر':
          travels = travels.filter(t => 
            t.packages.some(p => p.category === 'luxury')
          );
          break;
        case 'افضل قيمة':
          travels.sort((a, b) => 
            (Math.min(...a.packages.map(p => p.price)) / a.rating) -
            (Math.min(...b.packages.map(p => p.price)) / b.rating)
          );
          break;
      }

      return travels.slice(0, 5);
    } catch (error) {
      console.error('Error in searchTravels:', error);
      throw error;
    }
  }

  async generateResponse(text, searchResults, isArabic, conversationHistory) {
    // Format search results in the same way as the ChatBot component
    const formatSearchResults = (results) => {
      if (!results?.length) return '';

      const resultsText = results.map((result, index) => {
        const packagesInfo = result.packages.map(pkg => 
          `   • ${pkg.title} (${pkg.category}): ${pkg.price} ريال`
        ).join('\n');

        return `
${index + 1}. ${result.travelName}
   من: ${result.from}
   إلى: ${result.destination}
   
   الباقات:
${packagesInfo}`.trim();
      }).join('\n\n');

      return `الرحلات المتوفرة:\n${resultsText}`;
    };

    const formattedResults = formatSearchResults(searchResults);

    const messages = [
      {
        role: "system",
        content: isArabic ?
          `أنت مساعد سفر محترف. اتبع هذه التعليمات:
          1. قدم إجابات باللغة العربية فقط
          2. استخدم البيانات المتوفرة لتقديم رد مباشر وواضح
          3. استخدم المعلومات الموجودة في قائمة الرحلات المتوفرة
          4. كن ودوداً ومهنياً
          5. حافظ على إيجاز وتركيز الرد` :
          `You are a professional travel assistant. Follow these guidelines:
          1. Provide responses in English only
          2. Use available data to provide a direct and clear response
          3. Use the information provided in the available trips list
          4. Be friendly and professional
          5. Keep responses concise and focused`
      },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: "user",
        content: `استفسار المستخدم: ${text}\n\n${formattedResults}`
      }
    ];

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
}
}

module.exports = new ChatbotController();