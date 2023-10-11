const postDraftMessage = require("../../helpers/postDraftMessage");

module.exports = async (interaction) => {
  await postDraftMessage(interaction, 1);

  await interaction.reply({
    content   : "New draft started",
    ephemeral : true,
  });
};
