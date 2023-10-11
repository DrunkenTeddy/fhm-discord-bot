const { getSimRecapCard, getBestTeamRecordsEmbed } = require("../../helpers/getSimRecapCard");

module.exports = async (interaction) => {
  const { components } = await getSimRecapCard(interaction);
  const embed          = await getBestTeamRecordsEmbed(interaction);

  // Check if original message was ephemeral
  if (interaction.message && interaction.message.flags.has(64)) {
    return interaction.update({ embeds: [embed], components });
  }

  return interaction.reply({ embeds: [embed], components, ephemeral: true });
};
