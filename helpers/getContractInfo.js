const query = require("./query");

module.exports = async (info) => {
  const playerID = info.playerID;
  const teamID   = info.teamID;

  const baseSQL = "SELECT * FROM player_contract";

  const where = [];

  if (playerID !== undefined && playerID !== "") {
    where.push(`PlayerID='${playerID}'`);
  }

  if (teamID !== undefined && teamID !== "") {
    where.push(`Team='${teamID}'`);
  }

  const sql     = `${baseSQL} WHERE ${where.join(" AND ")}`;
  const results = await query(sql);

  if (results.length === 0) {
    // If there are no results, try again with only the playerID
    const altresults = await query(`${baseSQL} WHERE PlayerID='${playerID}'`);

    if (altresults.length === 0) {
      return null;
    }

    return altresults[0];
  }

  return results[0];
};
