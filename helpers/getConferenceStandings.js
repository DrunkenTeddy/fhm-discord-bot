const query = require("./query");

module.exports = async (ConferenceID) => {
  const results = await query(`SELECT * FROM team_records WHERE LeagueID='0' AND ConferenceID='${ConferenceID}'`);

  if (results.length === 0) {
    return null;
  }

  return results;
};
