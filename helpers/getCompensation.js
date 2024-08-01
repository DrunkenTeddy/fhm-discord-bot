module.exports = (salaryNumber, yearsNumber, teamLogo) => {
  const compensation = {
    1511701  : "No Compensation",
    2290457  : `${teamLogo} 3rd round pick`,
    4580917  : `${teamLogo} 2nd round pick`,
    6871374  : `${teamLogo} 1st round pick\n${teamLogo} 3rd round pick`,
    9161834  : `${teamLogo} 1st round pick\n${teamLogo} 2nd pound pick\n${teamLogo} 3rd round pick`,
    11452294 : `${teamLogo} 1st round pick\n${teamLogo} 1st round pick\n${teamLogo} 2nd pound pick\n${teamLogo} 3rd round pick`,
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
