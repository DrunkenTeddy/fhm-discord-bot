const query         = require("./query");
const getTeamInfo   = require("./getTeamInfo");
const getPlayerInfo = require("./getPlayerInfo");

module.exports = async (info) => {
  const playerID   = info.playerID;
  const playerName = info.playerName;
  const teamID     = info.teamID;
  const teamName   = info.teamName;

  const sql   = "SELECT * FROM player_skater_stats_rs WHERE ";
  const where = [];

  if (playerID !== undefined && playerID !== "") {
    where.push(`PlayerID='${playerID}'`);
  }

  if (playerName !== undefined && playerName !== "") {
    const playerInfo = await getPlayerInfo({ playerName });

    if (playerInfo.PlayerID !== undefined && playerInfo.PlayerID !== "") {
      where.push(`PlayerID='${playerInfo.PlayerID}'`);
    }
  }

  if (teamID !== undefined && teamID !== "") {
    where.push(`TeamID='${teamID}'`);
  }

  if (teamName !== undefined && teamName !== "") {
    const teamInfo = await getTeamInfo({ teamName });

    if (teamInfo.TeamID !== undefined && teamInfo.TeamID !== "") {
      where.push(`TeamID='${teamInfo.TeamID}'`);
    }
  }

  const results = await query(sql + where.join(" AND "));

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
