const query = require("./query");

module.exports = async () => {
  const results = await query("SELECT * FROM team_records WHERE LeagueID='0'");

  if (results.length === 0) {
    return null;
  }

  return results;
};
