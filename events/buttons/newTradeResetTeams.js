const getTeamsSelect = require("../../helpers/getTeamsSelect");

module.exports = async (interaction) => {
  const teamsSelect = await getTeamsSelect(interaction, "new-trade-add-teams", true);

  await interaction.update({
    components : [...teamsSelect],
    ephemeral  : true,
  });
};
