const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

const getTeamsSelect = require("../../helpers/getTeamsSelect");

module.exports = async (interaction) => {
  const easternTeamsSelect = interaction.message.components[0].components[0];
  const westernTeamsSelect = interaction.message.components[1].components[0];
  const selectedTeams      = [];

  const isEastern = interaction.customId.split("-")[4] === "1";

  if (isEastern) {
    selectedTeams.push(...[
      ...interaction.values,
      ...westernTeamsSelect.options.filter((option) => option.default).map((option) => option.value),
    ]);
  } else {
    selectedTeams.push(...[
      ...easternTeamsSelect.options.filter((option) => option.default).map((option) => option.value),
      ...interaction.values,
    ]);
  }

  const teamsSelect = await getTeamsSelect(interaction, "new-trade-add-teams", true, selectedTeams);

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

  await interaction.update({
    components : [...teamsSelect, buttons],
    ephemeral  : true,
  });
};
