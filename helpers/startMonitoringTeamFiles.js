const checkForMissingTeamFiles = require("./checkForMissingTeamFiles");
const getScheduledSims         = require("./getScheduledSims");
const query                    = require("./query");

const monitorTeamFiles = async (client) => {
  const simulations = await getScheduledSims();

  if (simulations === null) {
    console.error("No scheduled sims found.");
    return;
  }

  const nextSim          = simulations[0];
  const nextSimCountdown = new Date(nextSim.RealDate) - new Date();
  const nextSimHours     = Math.floor(nextSimCountdown / 1000 / 60 / 60);

  if (parseInt(nextSim.ReminderSent, 10) === 0 && nextSimHours <= 12) {
    checkForMissingTeamFiles(client);
    await query(`UPDATE simulations SET ReminderSent=1 WHERE SimID=${nextSim.SimID}`);
  }
};

module.exports = (client) => {
  const interval = 60 * 1000; // 1 minute

  monitorTeamFiles(client);
  setInterval(() => monitorTeamFiles(client), interval);
};
