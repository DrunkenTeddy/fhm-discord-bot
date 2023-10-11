const { processSim } = require("../../commands/simresults");

const getScheduledSims = require("../../helpers/getScheduledSims");

module.exports = async (interaction) => {
  const simulations = await getScheduledSims();
  const nextSim     = simulations[0];
  const start       = nextSim.DateStart;
  const end         = nextSim.DateEnd;

  await processSim(interaction, start, end);
};
