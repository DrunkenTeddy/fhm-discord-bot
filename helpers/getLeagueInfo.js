const query = require("./query");

module.exports = async (info) => {
  const leagueID = info.leagueID;

  const results = await query(`SELECT * FROM league_data WHERE LeagueID='${leagueID}'`);

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
