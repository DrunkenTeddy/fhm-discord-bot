const { ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");
const getScheduledSims                              = require("./getScheduledSims");

module.exports = async (interaction, customId) => {
  const simulations = await getScheduledSims();

  if (simulations === null) {
    return null;
  }

  const options = simulations.map((sim) => ({
    label : `${sim.RealDate} (${sim.Simmer})`,
    value : `${sim.SimID}`,
  }));

  const simsSelect = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder("Select Scheduled Sim".toTitleCase())
      .addOptions(options),
  );

  return simsSelect;
};
