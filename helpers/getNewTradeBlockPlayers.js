const query = require("./query");

module.exports = async (teamInfo, orderBy = "pts", limit) => {
  let sql = "";

  if (teamInfo) {
    sql = `
      SELECT *,
      (player_skater_stats_rs.G + player_skater_stats_rs.A) AS PTS,
      trade_block.PlayerID AS PlayerID,
      trade_block.TeamID AS TeamID,
      IFNULL(player_skater_stats_rs.GP, player_goalie_stats_rs.GP) AS GP
      FROM trade_block
      LEFT JOIN player_skater_stats_rs
      ON trade_block.PlayerID = player_skater_stats_rs.PlayerID
      LEFT JOIN player_goalie_stats_rs
      ON trade_block.PlayerID = player_goalie_stats_rs.PlayerID
      LEFT JOIN player_master
      ON trade_block.PlayerID = player_master.PlayerID
      WHERE trade_block.TeamID=${teamInfo.teamID} AND trade_block.Available=1 AND player_master.Retired=0 AND trade_block.Notified=0
    `;

    if (orderBy === "pts") {
      sql += `
      ORDER BY PTS DESC, G DESC, GR DESC
      LIMIT ${limit || 25}
      `;
    } else if (orderBy === "name") {
      sql += `
      ORDER BY \`Last Name\` ASC
      LIMIT ${limit || 25}`;
    }
  } else {
    sql = `
      SELECT *,
      (player_skater_stats_rs.G + player_skater_stats_rs.A) AS PTS,
      trade_block.PlayerID AS PlayerID,
      trade_block.TeamID AS TeamID,
      IFNULL(player_skater_stats_rs.GP, player_goalie_stats_rs.GP) AS GP
      FROM trade_block
      LEFT JOIN player_skater_stats_rs
      ON trade_block.PlayerID = player_skater_stats_rs.PlayerID
      LEFT JOIN player_goalie_stats_rs
      ON trade_block.PlayerID = player_goalie_stats_rs.PlayerID
      LEFT JOIN team_data
      ON trade_block.TeamID = team_data.TeamID
      LEFT JOIN player_master
      ON trade_block.PlayerID = player_master.PlayerID
      WHERE trade_block.Available=1 AND team_data.LeagueID=0 AND player_master.Retired=0 AND trade_block.Notified=0
    `;

    if (orderBy === "pts") {
      sql += `ORDER BY PTS DESC, G DESC, GR DESC LIMIT ${limit || 5};`;
    } else if (orderBy === "name") {
      sql += `ORDER BY \`Last Name\` ASC LIMIT ${limit || 5};`;
    }
  }

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return results;
};
