const query = require("./query");

module.exports = async (info) => {
  const { teamID, franchiseID } = info;
  let sql                       = "";

  if (teamID !== undefined && teamID !== "") {
    sql = `
      SELECT player_master.PlayerID, CONCAT(\`First Name\`, ' ', \`Last Name\`) as PlayerName
      FROM player_master
      LEFT JOIN trade_block
      ON player_master.PlayerID = trade_block.PlayerID
      WHERE player_master.TeamID=${teamID} AND trade_block.ID IS NULL
      ORDER BY \`Last Name\` ASC LIMIT 25
    `;
  } else {
    sql = `
      SELECT player_master.PlayerID, CONCAT(\`First Name\`, ' ', \`Last Name\`) as PlayerName
      FROM player_master
      LEFT JOIN trade_block
      ON player_master.PlayerID = trade_block.PlayerID
      WHERE player_master.FranchiseID=${franchiseID} AND player_master.TeamID!=${franchiseID} AND trade_block.ID IS NULL
      ORDER BY \`Last Name\` ASC LIMIT 25
    `;
  }

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return results;
};
