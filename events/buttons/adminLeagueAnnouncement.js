const {
  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");

module.exports = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("admin-league-announcement")
    .setTitle("Send a League Announcement".toTitleCase());

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-league-announcement-message")
        .setLabel("Message")
        .setStyle(TextInputStyle.Paragraph),
    ),
  );

  await interaction.showModal(modal);
};
