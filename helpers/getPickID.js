const teams = require("../static_data/teams.json");

const getTeamInfo = require("./getTeamInfo");

module.exports = async (pickString) => {
  const pickInfo = pickString.split(" ");
  const year     = parseInt(pickInfo[0], 10);
  const round    = parseInt(pickInfo[1].slice(0, 1), 10);
  const team     = pickInfo[pickInfo.length - 1].replace("(", "").replace(")", "");
  const teamName = teams.find((t) => t.abbreviation === team).name;
  const teamInfo = await getTeamInfo({ teamName });
  const teamID   = teamInfo.TeamID;

  return parseInt(`${round}${year}${teamID}`, 10);
};
