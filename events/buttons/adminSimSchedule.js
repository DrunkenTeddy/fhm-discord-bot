const getAdminSimButtons     = require("../../helpers/getAdminSimButtons");
const getScheduledSimsEmbeds = require("../../helpers/getScheduledSimsEmbeds");

module.exports = async (interaction) => {
  const scheduledSimEmbeds = await getScheduledSimsEmbeds();
  const adminSimButtons    = getAdminSimButtons();

  await interaction.update({
    embeds     : scheduledSimEmbeds,
    components : adminSimButtons,
    ephemeral  : true,
  });
};
