const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = () => {
  const actionButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("trade-block-update")
      .setLabel("Update My Team Needs".toTitleCase())
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("trade-block-team-refresh")
      .setLabel("Refresh".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  const playersButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("trade-block-add-players")
      .setLabel("Add Available Players".toTitleCase())
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("trade-block-remove-players")
      .setLabel("Remove Available Players".toTitleCase())
      .setStyle(ButtonStyle.Danger),
  );

  const untouchablesButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("trade-block-add-untouchables")
      .setLabel("Add Untouchable Players".toTitleCase())
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("trade-block-remove-untouchables")
      .setLabel("Remove Untouchable Players".toTitleCase())
      .setStyle(ButtonStyle.Danger),
  );

  const secondaryButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("return-gm-hub")
      .setLabel("Back to GM Hub".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  return [actionButtons, playersButtons, untouchablesButtons, secondaryButtons];
};
