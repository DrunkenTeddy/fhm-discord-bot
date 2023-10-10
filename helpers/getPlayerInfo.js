const query       = require("./query");
const getTeamInfo = require("./getTeamInfo");

module.exports = async (info) => {
  const playerID         = info.playerID;
  const playerName       = info.playerName;
  const playerNameSearch = info.playerNameSearch;
  const teamID           = info.teamID;
  const teamName         = info.teamName;

  const baseSQL = "SELECT * FROM player_master";
  const where   = [];
  let orderBy   = "ORDER BY DOB DESC";

  if (
    playerID === undefined
    && playerName === undefined
    && playerNameSearch === undefined
    && teamID === undefined
    && teamName === undefined
  ) { return null; }

  if (playerID !== undefined && playerID !== "") {
    where.push(`PlayerID='${playerID}'`);
  }

  if (playerName !== undefined && playerName !== "") {
    where.push(`CONCAT(LOWER(\`First Name\`), ' ', LOWER(\`Last Name\`))=LOWER('${playerName.replace(/'/g, "\\'")}')`);
  }

  if (playerNameSearch !== undefined && playerNameSearch !== "") {
    where.push(`CONCAT(LOWER(\`First Name\`), ' ', LOWER(\`Last Name\`)) LIKE '%${playerNameSearch.replace(/'/g, "\\'")}%'`);
    orderBy = "ORDER BY `Last Name` ASC, DOB DESC";
  }

  if (teamID !== undefined && teamID !== "") {
    where.push(`player_master.TeamID='${teamID}'`);
  }

  if (teamName !== undefined && teamName !== "") {
    const teamInfo = await getTeamInfo({ teamName });

    if (teamInfo !== null && teamInfo.TeamID !== undefined && teamInfo.TeamID !== "") {
      where.push(`player_master.TeamID='${teamInfo.TeamID}'`);
    }
  }

  let sql = `${baseSQL} WHERE ${where.join(" AND ")} ${orderBy}`;

  const results = await query(sql);

  if (results.length === 0 && playerNameSearch === undefined) {
    // If no results, try to find the player without the teamID
    sql = `${baseSQL} WHERE ${where.filter((clause) => !clause.includes("TeamID")).join(" AND ")} ${orderBy}`;

    const resultsWithoutTeam = await query(sql);

    if (resultsWithoutTeam.length === 0) {
      return null;
    }

    return resultsWithoutTeam[0];
  }

  return results[0];
};
