const getNewTradeBlockPlayers             = require("./getNewTradeBlockPlayers");
const query                               = require("./query");
const sendTradeBlockAddPlayerNotification = require("./sendTradeBlockAddPlayerNotification");

const monitorTradeBlock = async (client) => {
  const tradeBlockPlayers = await getNewTradeBlockPlayers(null, "name", 1000);

  if (tradeBlockPlayers === null) {
    console.log("No new players added to the trade block");
    return;
  }

  await sendTradeBlockAddPlayerNotification(client, tradeBlockPlayers);

  for (const player of tradeBlockPlayers) {
    await query(`UPDATE trade_block SET Notified=1 WHERE PlayerID=${player.PlayerID}`);
  }
};

module.exports = (client) => {
  const interval = 12 * 60 * 60 * 1000; // 12 hours

  monitorTradeBlock(client);
  setInterval(() => monitorTradeBlock(client), interval);
};
