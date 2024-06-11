const fs = require("fs");

module.exports = (teamID) => {
  const teamFile     = `team_${teamID}.fhm`;
  const teamFilePath = `/home/inhl/teamfiles/${teamFile}`;

  if (fs.existsSync(teamFilePath)) {
    return true;
  }

  return false;
};
