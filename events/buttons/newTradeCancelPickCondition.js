const getNewTradeButtons = require("../../helpers/getNewTradeButtons");

module.exports = async (interaction) => {
  const buttons = getNewTradeButtons(interaction, true);

  await interaction.update({
    components : [buttons],
    ephemeral  : true,
  });
};
