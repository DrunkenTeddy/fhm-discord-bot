module.exports = (pickID) => {
  const pickString = pickID.toString();
  const round      = parseInt(pickString.slice(0, 1), 10);
  const year       = parseInt(pickString.slice(1, 5), 10);
  const teamID     = parseInt(pickString.slice(5), 10);

  return { round, year, teamID };
};
