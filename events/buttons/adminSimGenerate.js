const addNewSim              = require("../../helpers/addNewSim");
const generateNextSimInfo    = require("../../helpers/generateNextSimInfo");
const getLastScheduledSim    = require("../../helpers/getLastScheduledSim");
const getScheduledSimsEmbeds = require("../../helpers/getScheduledSimsEmbeds");

module.exports = async (interaction) => {
  const lastScheduleSim = await getLastScheduledSim();

  let nextSims = new Array(5).fill(lastScheduleSim);

  if (lastScheduleSim) {
    nextSims = nextSims.reduce((sims) => {
      const lastSim     = sims[sims.length - 1];
      const nextSimInfo = generateNextSimInfo(lastSim);

      return [...sims, nextSimInfo];
    }, [lastScheduleSim]);
  }

  nextSims = nextSims.slice(1);

  for (const sim of nextSims) {
    const {
      DateStart, DateEnd, RealDate, Simmer, Notes,
    } = sim;

    await addNewSim(DateStart, DateEnd, RealDate, Simmer, Notes);
  }

  const scheduledSimEmbeds = await getScheduledSimsEmbeds();

  await interaction.update({
    embeds: scheduledSimEmbeds,
  });
};
