const query = require("./query");

module.exports = async (teamInfo) => {
  const results = await query(`SELECT * FROM trade_preference WHERE TeamID=${teamInfo.teamID}`);

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
