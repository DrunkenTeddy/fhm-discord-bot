const getTeamInfo = require("./getTeamInfo");

module.exports = async (pickID) => {
  const pickString  = pickID.toString();
  const roundNumber = parseInt(pickString.slice(0, 1), 10);
  const year        = parseInt(pickString.slice(1, 5), 10);
  const teamID      = parseInt(pickString.slice(5), 10);
  const teamInfo    = await getTeamInfo({ teamID });
  const teamAbbr    = teamInfo.Abbr;
  let round         = `${roundNumber}`;

  if (roundNumber === 1) {
    round += "st";
  } else if (roundNumber === 2) {
    round += "nd";
  } else if (roundNumber === 3) {
    round += "rd";
  } else {
    round += "th";
  }

  return `${year} ${round} Round Pick (${teamAbbr})`;
};
