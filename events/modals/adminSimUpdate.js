const updateSim              = require("../../helpers/updateSim");
const getScheduledSimsEmbeds = require("../../helpers/getScheduledSimsEmbeds");
const getAdminSimButtons     = require("../../helpers/getAdminSimButtons");

module.exports = async (interaction) => {
  const simID     = interaction.customId.split("-")[3];
  const realDate  = interaction.fields.getTextInputValue("admin-sim-new-real-date");
  const dateStart = interaction.fields.getTextInputValue("admin-sim-new-date-start");
  const dateEnd   = interaction.fields.getTextInputValue("admin-sim-new-date-end");
  const simmer    = interaction.fields.getTextInputValue("admin-sim-new-simmer");
  const notes     = interaction.fields.getTextInputValue("admin-sim-new-notes");

  await updateSim(simID, dateStart, dateEnd, realDate, simmer, notes);

  const scheduledSimEmbeds = await getScheduledSimsEmbeds();
  const adminSimButtons    = getAdminSimButtons();

  await interaction.update({
    embeds     : scheduledSimEmbeds,
    components : adminSimButtons,
  });
};
