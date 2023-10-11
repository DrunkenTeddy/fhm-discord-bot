const query = require("./query");

module.exports = async (teamInfo) => {
  let sql = "";

  if (teamInfo) {
    sql = `
      SELECT *, (player_skater_stats_rs.G + player_skater_stats_rs.A) AS PTS
      FROM trade_block
      INNER JOIN player_skater_stats_rs
      ON trade_block.PlayerID = player_skater_stats_rs.PlayerID
      WHERE trade_block.TeamID=${teamInfo.teamID} AND trade_block.Available=0
      ORDER BY PTS DESC, G DESC, GR DESC
    `;
  } else {
    sql = `
      SELECT *, (player_skater_stats_rs.G + player_skater_stats_rs.A) AS PTS
      FROM trade_block
      INNER JOIN player_skater_stats_rs
      ON trade_block.PlayerID = player_skater_stats_rs.PlayerID
      WHERE trade_block.Available=0
      ORDER BY PTS DESC, G DESC, GR DESC
      LIMIT 5;
    `;
  }

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return results;
};
