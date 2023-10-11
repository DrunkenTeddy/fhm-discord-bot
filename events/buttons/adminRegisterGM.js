const { ActionRowBuilder }           = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle } = require("discord.js");

const getTeamsSelect = require("../../helpers/getTeamsSelect");

module.exports = async (interaction) => {
  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("admin-cancel")
      .setLabel("Cancel".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  const teamsSelect = await getTeamsSelect(interaction, "admin-register-gm");

  await interaction.update({
    components : [...teamsSelect, buttons],
    ephemeral  : true,
  });
};
