const { ActionRowBuilder }                         = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

const getSimsSelect = require("../../helpers/getSimsSelect");

module.exports = async (interaction) => {
  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("admin-sim-cancel")
      .setLabel("Cancel".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  const simsSelect = await getSimsSelect(interaction, "admin-sim-update");

  if (!simsSelect) {
    const embed = new EmbedBuilder()
      .setTitle("Sim Schedule".toTitleCase())
      .setDescription("There are no scheduled sims to update.");

    await interaction.update({
      embeds     : [embed],
      components : [buttons],
      ephemeral  : true,
    });

    return;
  }

  await interaction.update({
    components : [simsSelect, buttons],
    ephemeral  : true,
  });
};
