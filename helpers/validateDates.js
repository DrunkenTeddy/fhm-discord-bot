module.exports = (startDate, endDate) => {
  const isStartDateFormatValid = /^\d{4}-\d{2}-\d{2}$/.test(startDate);
  const isEndDateFormatValid   = /^\d{4}-\d{2}-\d{2}$/.test(endDate);
  const start                  = new Date(startDate);
  const end                    = new Date(endDate);

  if (!isStartDateFormatValid || !isEndDateFormatValid) {
    return false;
  } if (start > end) {
    return false;
  }

  return true;
};
