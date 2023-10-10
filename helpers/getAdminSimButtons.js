const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = () => {
  const primaryButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("admin-sim-run")
      .setLabel("Post Next Sim Results".toTitleCase())
      .setStyle(ButtonStyle.Success),
  );

  const secondaryButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("admin-sim-new")
      .setLabel("New Scheduled Sim".toTitleCase())
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("admin-sim-update")
      .setLabel("Update Scheduled Sim".toTitleCase())
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("admin-sim-generate")
      .setLabel("Auto Generate Sims".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("admin-sim-delete")
      .setLabel("Delete Scheduled Sim".toTitleCase())
      .setStyle(ButtonStyle.Danger),
  );

  const tertiaryButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("admin-sim-schedule")
      .setLabel("Refresh".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("admin-cancel")
      .setLabel("Return to Admin Panel".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  return [primaryButtons, secondaryButtons, tertiaryButtons];
};
