const {
  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");

module.exports = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("prediction-new")
    .setTitle("Create New Prediction".toTitleCase());

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("prediction-question")
        .setLabel("Question:")
        .setStyle(TextInputStyle.Paragraph),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("prediction-option-1")
        .setLabel("Option 1:")
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("prediction-option-2")
        .setLabel("Option 2:")
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("prediction-option-3")
        .setLabel("Option 3:")
        .setValue("None")
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("prediction-option-4")
        .setLabel("Option 4:")
        .setValue("None")
        .setStyle(TextInputStyle.Short),
    ),
  );

  await interaction.showModal(modal);
};
