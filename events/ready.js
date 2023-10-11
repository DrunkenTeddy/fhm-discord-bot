const startMonitoringTeamFiles  = require("../helpers/startMonitoringTeamFiles");
const startMonitoringTradeBlock = require("../helpers/startMonitoringTradeBlock");

module.exports = {
  name : "ready",
  once : true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    startMonitoringTeamFiles(client);
    startMonitoringTradeBlock(client);
  },
};
