const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = (interaction, showAddPickButton = null, showRemovePickButton = null) => {
  const embeds               = interaction.message.embeds;
  const pickConditionsEmbeds = embeds.find((embed) => embed.title === "Pick Conditions");

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("new-trade-confirm-offer")
      .setLabel("Confirm Trade Offer".toTitleCase())
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("new-trade-edit")
      .setLabel("Edit Trade Offer".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  if (showAddPickButton) {
    buttons.addComponents(
      new ButtonBuilder()
        .setCustomId("new-trade-add-pick-condition")
        .setLabel("Add Pick Condition".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );
  }

  if (showRemovePickButton || (showRemovePickButton !== false && pickConditionsEmbeds)) {
    buttons.addComponents(
      new ButtonBuilder()
        .setCustomId("new-trade-remove-pick-condition")
        .setLabel("Remove Pick Condition".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );
  }

  return buttons;
};
