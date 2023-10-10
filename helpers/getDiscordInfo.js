const query = require("./query");

module.exports = async (info) => {
  const teamName       = info.teamName;
  const teamID         = info.teamID;
  const teamNameSearch = info.teamNameSearch;
  const discordID      = info.discordID;
  let abbr             = info.abbr;
  let teamData         = null;

  if (discordID && discordID !== null) {
    const results = await query(`SELECT * FROM gm WHERE DiscordID='${discordID.replace(/'/g, "\\'")}'`);

    if (results.length === 0) {
      return null;
    }

    return results[0];
  }

  if (teamName && teamName !== null && teamName !== "") {
    teamData = await query(`SELECT * FROM team_data WHERE CONCAT(LOWER(\`Name\`), ' ', LOWER(\`Nickname\`))=LOWER('${teamName.replace(/'/g, "\\'")}')`);
    abbr     = teamData.length > 0 ? teamData[0].Abbr : "";
  } else if (teamNameSearch && teamNameSearch !== null && teamNameSearch !== "") {
    teamData = await query(`SELECT * FROM team_data WHERE CONCAT(LOWER(\`Name\`), ' ', LOWER(\`Nickname\`)) LIKE LOWER('%${teamNameSearch.replace(/'/g, "\\'")}%')`);
    abbr     = teamData.length > 0 ? teamData[0].Abbr : "";
  } else if (teamID && teamID !== null && teamID !== "") {
    teamData = await query(`SELECT * FROM team_data WHERE TeamID='${teamID.replace(/'/g, "\\'")}'`);
    abbr     = teamData.length > 0 ? teamData[0].Abbr : "";
  }

  if (abbr === null || abbr === "") {
    return null;
  }

  const results = await query(`SELECT * FROM gm WHERE Abbr='${abbr}'`);

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
