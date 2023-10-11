const getTeamInfo         = require("../../helpers/getTeamInfo");
const getTeamLeadersEmbed = require("../../helpers/getTeamLeadersEmbed");

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
  const embed  = await getTeamLeadersEmbed(interaction, teamID);

  await interaction.editReply({
    embeds    : [embed],
    ephemeral : true,
  });
};
