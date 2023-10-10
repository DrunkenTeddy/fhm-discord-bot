module.exports = (lastSim) => {
  const lastRealSimDate  = new Date(lastSim.RealDate);
  const nextRealSimDate  = new Date(lastSim.RealDate);
  const nextSimStartDate = new Date(lastSim.DateEnd);
  const lastSimDateEnd   = new Date(`${lastSim.DateEnd} 00:00`);
  const nextSimEndDate   = new Date(`${lastSim.DateEnd} 00:00`);

  // Check the day of the week of the last real sim date
  // Sims are done on Sundays, Tuesdays, and Thursdays
  const lastRealSimDay = lastRealSimDate.getDay();

  if (lastRealSimDay === 0) {
    nextRealSimDate.setDate(lastRealSimDate.getDate() + 2);
  } else if (lastRealSimDay === 2) {
    nextRealSimDate.setDate(lastRealSimDate.getDate() + 2);
  } else if (lastRealSimDay === 4) {
    nextRealSimDate.setDate(lastRealSimDate.getDate() + 3);
  }

  nextSimStartDate.setDate(lastSimDateEnd.getDate() + 1);
  nextSimEndDate.setDate(nextSimEndDate.getDate() + 7);

  const nextRealYear  = nextRealSimDate.getFullYear();
  const nextRealMonth = (`0${nextRealSimDate.getMonth() + 1}`).slice(-2);
  const nextRealDay   = (`0${nextRealSimDate.getDate()}`).slice(-2);

  const nextSimYear  = nextSimStartDate.getFullYear();
  const nextSimMonth = (`0${nextSimStartDate.getMonth() + 1}`).slice(-2);
  const nextSimDay   = (`0${nextSimStartDate.getDate()}`).slice(-2);

  const nextSimYearEnd  = nextSimEndDate.getFullYear();
  const nextSimMonthEnd = (`0${nextSimEndDate.getMonth() + 1}`).slice(-2);
  const nextSimDayEnd   = (`0${nextSimEndDate.getDate()}`).slice(-2);

  return {
    DateStart : `${nextSimYear}-${nextSimMonth}-${nextSimDay}`,
    DateEnd   : `${nextSimYearEnd}-${nextSimMonthEnd}-${nextSimDayEnd}`,
    RealDate  : `${nextRealYear}-${nextRealMonth}-${nextRealDay} 04:00`,
    Simmer    : "Björn",
    Notes     : "None",
  };
};
