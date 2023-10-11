const {
  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");

module.exports = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("admin-draft-rollback")
    .setTitle("Rollback Draft Position".toTitleCase());

  const rollbackPosition = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("position")
      .setLabel("Position")
      .setStyle(TextInputStyle.Short),
  );

  modal.addComponents(rollbackPosition);

  await interaction.showModal(modal);
};
