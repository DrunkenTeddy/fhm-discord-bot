const query = require("./query");

module.exports = async (position) => {
  const results = await query(`
    SELECT *
    FROM trade_block
    LEFT JOIN player_ratings
    ON trade_block.PlayerID = player_ratings.PlayerID
    WHERE player_ratings.${position} >= 15 AND trade_block.Available=1
    ORDER BY player_ratings.${position} DESC, trade_block.ID ASC
    LIMIT 50;
  `);

  if (results.length === 0) {
    return null;
  }

  return results;
};
