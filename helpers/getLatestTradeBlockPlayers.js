const query = require("./query");

module.exports = async (limit = 10) => {
  const results = await query(`
    SELECT * FROM trade_block
    INNER JOIN player_ratings ON trade_block.PlayerID=player_ratings.PlayerID
    WHERE Available=1
    ORDER BY trade_block.ID DESC
    LIMIT ${limit};
  `);

  if (results.length === 0) {
    return null;
  }

  return results.reverse();
};
