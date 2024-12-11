const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const formatDuration = (duration) => {
  if (typeof duration === 'number') {
    return `${duration} days`;
  }
  return duration;
};

const formatDateRange = (startDate, endDate) => {
  return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
};

module.exports = {
  formatPrice,
  formatDuration,
  formatDateRange
};
