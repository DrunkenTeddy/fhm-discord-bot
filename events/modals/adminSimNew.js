const addNewSim              = require("../../helpers/addNewSim");
const getScheduledSimsEmbeds = require("../../helpers/getScheduledSimsEmbeds");

module.exports = async (interaction) => {
  const realDate  = interaction.fields.getTextInputValue("admin-sim-new-real-date");
  const dateStart = interaction.fields.getTextInputValue("admin-sim-new-date-start");
  const dateEnd   = interaction.fields.getTextInputValue("admin-sim-new-date-end");
  const simmer    = interaction.fields.getTextInputValue("admin-sim-new-simmer");
  const notes     = interaction.fields.getTextInputValue("admin-sim-new-notes");

  await addNewSim(dateStart, dateEnd, realDate, simmer, notes);

  const scheduledSimEmbeds = await getScheduledSimsEmbeds();

  await interaction.update({
    embeds: scheduledSimEmbeds,
  });
};
