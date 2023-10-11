const query = require("./query");

module.exports = async (teamID) => {
  const results = await query(`SELECT * FROM trade_block WHERE TeamID=${teamID} AND Available=1`);

  return results.length;
};
