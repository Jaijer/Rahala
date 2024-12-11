const stripSpecialChars = (text) => {
  return text.replace(/[^\w\s]/gi, '').toLowerCase();
};

const normalizeText = (text) => {
  return text.trim().toLowerCase();
};

const calculateRelevanceScore = (item, query) => {
  const normalizedQuery = normalizeText(query);
  let score = 0;

  Object.values(item).forEach(value => {
    if (typeof value === 'string') {
      const normalizedValue = normalizeText(value);
      if (normalizedValue.includes(normalizedQuery)) {
        score += 1;
      }
    } else if (Array.isArray(value)) {
      value.forEach(v => {
        if (typeof v === 'string' && normalizeText(v).includes(normalizedQuery)) {
          score += 0.5;
        }
      });
    }
  });

  return score;
};

module.exports = {
  stripSpecialChars,
  normalizeText,
  calculateRelevanceScore
};
