const query = require("./query");

module.exports = async (abbr) => {
  if (!abbr) {
    return null;
  }
  const results = await query(`SELECT * FROM team_data WHERE Abbr='${abbr}' AND LeagueID=0`);

  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};
