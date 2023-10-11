const postDraftMessage = require("../../helpers/postDraftMessage");

module.exports = async (interaction) => {
  const position = interaction.fields.getTextInputValue("position");

  await postDraftMessage(interaction, position);

  await interaction.reply({
    content   : "New draft started",
    ephemeral : true,
  });
};
