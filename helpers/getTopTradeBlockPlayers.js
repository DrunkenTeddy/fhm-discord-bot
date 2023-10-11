const query = require("./query");

module.exports = async (limit = 10) => {
  const results = await query(`
    SELECT * FROM trade_block
    INNER JOIN player_ratings ON trade_block.PlayerID=player_ratings.PlayerID
    WHERE Available=1
    ORDER BY player_ratings.Ability DESC, player_ratings.Potential DESC
    LIMIT ${limit};
  `);

  if (results.length === 0) {
    return null;
  }

  return results.reverse();
};
