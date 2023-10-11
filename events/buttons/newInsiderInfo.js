const {
  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");

module.exports = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("send-new-insider-info-modal")
    .setTitle("New Insider Info".toTitleCase());

  const insiderMessage = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("insider-message")
      .setLabel("Insider Message:")
      .setStyle(TextInputStyle.Paragraph),
  );

  modal.addComponents(insiderMessage);

  await interaction.showModal(modal);
};
