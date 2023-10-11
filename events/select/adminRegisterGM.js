const {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");

const teams = require("../../static_data/teams.json");

module.exports = async (interaction) => {
  const teamAbbr = interaction.values[0];
  const teamName = teams.find((team) => team.abbreviation === teamAbbr).name;

  const modal = new ModalBuilder()
    .setCustomId(`admin-register-gm-${teamAbbr}`)
    .setTitle(`Register GM for ${teamName}`);

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-register-gm-id")
        .setLabel("Discord ID")
        .setStyle(TextInputStyle.Short),
    ),
  );

  await interaction.showModal(modal);
};
