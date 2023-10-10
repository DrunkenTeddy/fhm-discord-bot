module.exports = (salaryNumber, yearsNumber, teamLogo) => {
  const compensation = {
    1415740  : "No Compensation",
    2145061  : `${teamLogo} 3rd round pick`,
    4290125  : `${teamLogo} 2nd round pick`,
    6435186  : `${teamLogo} 1st round pick\n${teamLogo} 3rd round pick`,
    8580250  : `${teamLogo} 1st round pick\n${teamLogo} 2nd pound pick\n${teamLogo} 3rd round pick`,
    10725314 : `${teamLogo} 1st round pick\n${teamLogo} 1st round pick\n${teamLogo} 2nd pound pick\n${teamLogo} 3rd round pick`,
    20000000 : `${teamLogo} 1st round pick\n${teamLogo} 1st round pick\n${teamLogo} 1st round pick\n${teamLogo} 1st round pick`,
  };

  // Calculate the compensation AAV, if the contract is longer than 5 years, the compensation AAV is calculated as if it was a 5 year contract.
  const compensationAAV = (salaryNumber * yearsNumber) / (yearsNumber > 5 ? 5 : yearsNumber);

  const compensationKeys   = Object.keys(compensation);
  const compensationValues = Object.values(compensation);

  const compensationIndex = compensationKeys.findIndex((key) => compensationAAV < key);
  const compensationText  = compensationValues[compensationIndex];

  return { compensationText, compensationIndex };
};
