const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = (discordInfo) => {
  const settingsButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("notification-settings-update-NotifSimRecaps")
      .setLabel(discordInfo.NotifSimRecaps ? "Simulation Recaps (ON)".toTitleCase() : "Simulation Recaps (OFF)".toTitleCase())
      .setStyle(discordInfo.NotifSimRecaps ? ButtonStyle.Success : ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("notification-settings-update-NotifTradeBlock")
      .setLabel(discordInfo.NotifTradeBlock ? "Trade Block Updates (ON)".toTitleCase() : "Trade Block Updates (OFF)".toTitleCase())
      .setStyle(discordInfo.NotifTradeBlock ? ButtonStyle.Success : ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("notification-settings-update-NotifTeamFile")
      .setLabel(discordInfo.NotifTeamFile ? "Missing Team File (ON)".toTitleCase() : "Missing Team File (OFF)".toTitleCase())
      .setStyle(discordInfo.NotifTeamFile ? ButtonStyle.Success : ButtonStyle.Danger),
  );

  const secondaryButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("return-gm-hub")
      .setLabel("Back to GM Hub".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  return [settingsButtons, secondaryButtons];
};
