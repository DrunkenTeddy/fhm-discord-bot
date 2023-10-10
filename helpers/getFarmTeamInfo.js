const query = require("./query");

module.exports = async (teamID) => {
  const results = await query(`SELECT * FROM team_data WHERE ParentTeam1=${teamID} AND LeagueID=1`);

  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};
