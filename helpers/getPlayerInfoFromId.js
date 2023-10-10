const query = require("./query");

module.exports = async (id) => {
  const results = await query(`SELECT * FROM player_master WHERE PlayerID='${id}'`);

  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};
