const getTeamInfo        = require("../../helpers/getTeamInfo");
const getTeamLinesEmbeds = require("../../helpers/getTeamLinesEmbeds");

module.exports = async (interaction) => {
  const discordID = interaction.user.id;
  const teamInfo  = await getTeamInfo({ discordID });

  if (!teamInfo) {
    await interaction.reply({
      content   : "You are not currently registered as a GM.",
      ephemeral : true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const teamID = teamInfo.TeamID;
  const embeds = await getTeamLinesEmbeds(interaction, teamID);

  await interaction.editReply({
    embeds,
    ephemeral: true,
  });
};
