const query = require("./query");

const getCurrentDate = require("./getCurrentDate");

module.exports = async (teamIDs, tradeItems) => {
  let sql         = "";
  const tradeDate = await getCurrentDate();

  if (teamIDs.length === 3) {
    sql = `INSERT INTO trades (Team1ID, Team2ID, Team3ID, TradeDate) VALUES (${teamIDs[0]}, ${teamIDs[1]}, ${teamIDs[2]}, "${tradeDate}");`;
  } else {
    sql = `INSERT INTO trades (Team1ID, Team2ID, TradeDate) VALUES (${teamIDs[0]}, ${teamIDs[1]}, "${tradeDate}");`;
  }

  const result  = await query(sql);
  const tradeID = result.insertId;

  for (let i = 0; i < tradeItems.length; i++) {
    const tradeItem = tradeItems[i];
    const player    = tradeItem.playerID ? tradeItem.playerID : "NULL";
    const pick      = tradeItem.pickID ? tradeItem.pickID : "NULL";
    sql             = `INSERT INTO trade_items (TradeID, TeamID, PlayerID, PickID) VALUES (${tradeID}, ${tradeItem.teamID}, ${player}, ${pick});`;

    await query(sql);
  }

  return result;
};
