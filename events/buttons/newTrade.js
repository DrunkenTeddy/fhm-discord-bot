const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} = require("discord.js");

const getTeamsSelect = require("../../helpers/getTeamsSelect");

module.exports = async (interaction) => {
  const tradeEmbed = new EmbedBuilder()
    .setTitle("New Trade".toTitleCase())
    .setDescription(`Please select the teams involved in the trade.
You can select up to 3 teams.
You can select multiple teams from the same dropdown.`);

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("new-trade-confirm-teams")
      .setLabel("Confirm Teams")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("new-trade-reset-teams")
      .setLabel("Reset Teams")
      .setStyle(ButtonStyle.Secondary),
  );

  const teamsSelect = await getTeamsSelect(interaction, "new-trade-add-teams", true);

  await interaction.reply({
    embeds     : [tradeEmbed],
    components : [...teamsSelect, buttons],
    ephemeral  : true,
  });
};
