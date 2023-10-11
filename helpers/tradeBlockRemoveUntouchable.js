const query = require("./query");

module.exports = async (TeamID, PlayerID) => {
  const result = await query(`
    DELETE FROM trade_block WHERE TeamID=${TeamID} AND PlayerID=${PlayerID};
  `);

  return result;
};
