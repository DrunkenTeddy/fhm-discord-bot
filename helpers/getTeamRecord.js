const query = require("./query");

module.exports = async (info) => {
  const teamID = info.teamID;

  const results = await query(`SELECT * FROM team_records WHERE TeamID='${teamID}'`);

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
