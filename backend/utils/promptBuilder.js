// src/utils/promptBuilder.js
const buildSystemPrompt = (context) => {
  return `Based on the following travel data, please provide a detailed response:

${context}

Please ensure your response:
1. Mentions specific prices and compares costs when relevant
2. Includes details about amenities, inclusions, and features
3. Mentions seasonal considerations if available
4. Compares multiple options when they exist
5. Clearly states if no exact matches are found and suggests alternatives

Focus on providing accurate information from the data provided.`;
};

module.exports = {
  buildSystemPrompt
};