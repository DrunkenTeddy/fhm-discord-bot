const query = require("./query");

module.exports = async (playerID) => {
  const results = await query(`SELECT * FROM player_ratings WHERE PlayerId=${playerID}`);

  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};
