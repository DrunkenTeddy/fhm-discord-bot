const getTeamInfoFromName = require("./getTeamInfoFromName");

module.exports = async (player, teamName) => {
  if (player.length > 1) {
    if (teamName !== "") {
      const teamId   = await getTeamInfoFromName(teamName).TeamID;
      const filtered = player.find((p) => p.TeamId === teamId);

      if (filtered) {
        player = filtered;
      }
    } else {
      player = player[0];
    }
  } else {
    player = player[0];
  }

  return player;
};
