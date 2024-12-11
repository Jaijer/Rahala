const validateQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  if (query.length < 3) {
    throw new Error('Query must be at least 3 characters long');
  }

  if (query.length > 500) {
    throw new Error('Query is too long. Maximum 500 characters allowed');
  }

  return query.trim();
};

const validateJsonData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid JSON data format');
  }
  return true;
};

module.exports = {
  validateQuery,
  validateJsonData
};
