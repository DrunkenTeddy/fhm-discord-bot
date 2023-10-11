const query = require("./query");

module.exports = async (teamInfo) => {
  let sql = "";

  if (teamInfo) {
    sql = `
      SELECT player_master.PlayerID, CONCAT(\`First Name\`, ' ', \`Last Name\`) as PlayerName
      FROM player_master
      LEFT JOIN trade_block
      ON trade_block.PlayerID = player_master.PlayerID
      WHERE trade_block.TeamID=${teamInfo.teamID} AND trade_block.Available=0
      ORDER BY \`Last Name\` ASC
      LIMIT 25
    `;
  } else {
    sql = `
      SELECT player_master.PlayerID, CONCAT(\`First Name\`, ' ', \`Last Name\`) as PlayerName
      FROM player_master
      LEFT JOIN trade_block
      ON trade_block.PlayerID = player_master.PlayerID
      WHERE trade_block.Available=0
      ORDER BY \`Last Name\` ASC
      LIMIT 5;
    `;
  }

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return results;
};
