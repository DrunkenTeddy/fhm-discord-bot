const { getSimRecapCard } = require("../../helpers/getSimRecapCard");

module.exports = async (interaction) => {
  const { embeds, components } = await getSimRecapCard(interaction);

  // Check if original message was ephemeral
  if (interaction.message && interaction.message.flags.has(64)) {
    return interaction.update({ embeds, components });
  }

  return interaction.reply({ embeds, components, ephemeral: true });
};
