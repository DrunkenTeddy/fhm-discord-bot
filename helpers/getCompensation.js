module.exports = (salaryNumber, yearsNumber, teamLogo) => {
  const compensation = {
    1544424  : "No Compensation",
    2340037  : `${teamLogo} 3rd round pick`,
    4680076  : `${teamLogo} 2nd round pick`,
    7020113  : `${teamLogo} 1st round pick\n${teamLogo} 3rd round pick`,
    9360153  : `${teamLogo} 1st round pick\n${teamLogo} 2nd pound pick\n${teamLogo} 3rd round pick`,
    11700192 : `${teamLogo} 1st round pick\n${teamLogo} 1st round pick\n${teamLogo} 2nd pound pick\n${teamLogo} 3rd round pick`,
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
