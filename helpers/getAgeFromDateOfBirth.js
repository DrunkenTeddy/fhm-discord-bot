module.exports = (dateOfBirth) => {
  const today     = new Date();
  const birthDate = new Date(dateOfBirth);
  let age         = today.getFullYear() - birthDate.getFullYear();
  const m         = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age.toString();
};
