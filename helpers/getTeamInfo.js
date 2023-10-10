const query = require("./query");

module.exports = async (info) => {
  const teamID    = info.teamID;
  const teamName  = info.teamName;
  const discordID = info.discordID;

  let results = [];

  if (teamID !== undefined && teamID !== "") {
    results = await query(`SELECT * FROM team_data WHERE TeamID='${teamID}'`);
  } else if (discordID !== undefined && discordID !== "") {
    const gmInfo = await query(`SELECT * FROM gm WHERE DiscordID='${discordID}'`);

    if (gmInfo.length === 0) {
      return null;
    }

    if (gmInfo.length === 1) {
      results = await query(`SELECT * FROM team_data WHERE Abbr='${gmInfo[0].Abbr}' AND LeagueID=0`);
    } else {
      results = await query("SELECT * FROM team_data WHERE Abbr='TBL' AND LeagueID=0");
    }
  } else {
    results = await query(`SELECT * FROM team_data WHERE CONCAT(LOWER(\`Name\`), ' ', LOWER(\`Nickname\`))=LOWER('${teamName.replace(/'/g, "\\'")}') AND LeagueID=0`);
  }

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
