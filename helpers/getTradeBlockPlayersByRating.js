const query = require("./query");

module.exports = async (rating) => {
  const results = await query(`
    SELECT *, player_ratings.${rating} AS Rating
    FROM trade_block
    LEFT JOIN player_ratings
    ON trade_block.PlayerID = player_ratings.PlayerID
    WHERE player_ratings.${rating} >= 10 AND trade_block.Available=1
    ORDER BY player_ratings.${rating} DESC
    LIMIT 30;
  `);

  if (results.length === 0) {
    return null;
  }

  return results;
};
