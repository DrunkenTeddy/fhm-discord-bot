const query = require("./query");

module.exports = async () => {
  const sql = "SELECT DraftYear FROM drafted_players ORDER BY DraftYear DESC LIMIT 1";

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return parseInt(results[0].DraftYear, 10) + 1;
};
