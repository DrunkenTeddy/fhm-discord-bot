const query          = require("./query");
const getCurrentDate = require("./getCurrentDate");

module.exports = async (limit = 10) => {
  const currentDate = await getCurrentDate();
  const currentYear = currentDate.split("-")[0];

  const results = await query(`
    SELECT * FROM trade_block
    INNER JOIN player_master ON trade_block.PlayerID=player_master.PlayerID
    INNER JOIN player_ratings ON trade_block.PlayerID=player_ratings.PlayerID
    WHERE Available=1 AND substring(player_master.DOB, 1, 4) > ${currentYear - 25}
    ORDER BY player_ratings.Potential DESC, player_ratings.Ability DESC
    LIMIT ${limit};
  `);

  if (results.length === 0) {
    return null;
  }

  return results.reverse();
};
