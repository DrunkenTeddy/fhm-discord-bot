const {
  ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder,
} = require("discord.js");

const getPickNameFromID = require("../../helpers/getPickNameFromID");

module.exports = async (interaction, pickID = null) => {
  if (pickID === null) {
    pickID = interaction.values[0];
  }

  const pick = await getPickNameFromID(pickID);

  const modal = new ModalBuilder()
    .setCustomId(`new-trade-add-pick-condition-${pickID}`)
    .setTitle("Add Pick Condition");

  const input = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("pick-condition")
      .setLabel(pick)
      .setStyle(TextInputStyle.Paragraph),
  );

  modal.addComponents(input);

  await interaction.showModal(modal);
};
