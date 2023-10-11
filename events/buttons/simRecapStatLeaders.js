const {
  getSimGoalsLeadersEmbed, getSimAssistsLeadersEmbed, getSimPointsLeadersEmbed, getSimRecapCard,
} = require("../../helpers/getSimRecapCard");

module.exports = async (interaction, stat) => {
  if (stat === "goals" || stat === "assists" || stat === "points") {
    let embed;

    if (stat === "goals") {
      embed = await getSimGoalsLeadersEmbed(interaction);
    } if (stat === "assists") {
      embed = await getSimAssistsLeadersEmbed(interaction);
    } if (stat === "points") {
      embed = await getSimPointsLeadersEmbed(interaction);
    }

    const { components } = await getSimRecapCard(interaction);

    // Check if original message was ephemeral
    if (interaction.message && interaction.message.flags.has(64)) {
      return interaction.update({ embeds: [embed], components });
    }

    return interaction.reply({ embeds: [embed], components, ephemeral: true });
  }

  // Check if original message was ephemeral
  if (interaction.message && interaction.message.flags.has(64)) {
    return interaction.update({ content: "Something went wrong." });
  }

  return interaction.reply({ content: "Something went wrong.", ephemeral: true });
};
