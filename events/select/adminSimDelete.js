const deleteSim              = require("../../helpers/deleteSim");
const getAdminSimButtons     = require("../../helpers/getAdminSimButtons");
const getScheduledSimsEmbeds = require("../../helpers/getScheduledSimsEmbeds");

module.exports = async (interaction) => {
  const simID = interaction.values[0];

  await deleteSim(simID);

  const scheduledSimEmbeds = await getScheduledSimsEmbeds();
  const adminSimButtons    = getAdminSimButtons();

  await interaction.update({
    embeds     : scheduledSimEmbeds,
    components : adminSimButtons,
  });
};
