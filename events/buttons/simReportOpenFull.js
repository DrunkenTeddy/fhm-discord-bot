const { getTeamSimReportCard } = require("../../commands/simreportcard");

const getTeamInfo = require("../../helpers/getTeamInfo");

module.exports = async (interaction) => {
  const teamID   = interaction.customId.split("-")[4];
  const teamInfo = await getTeamInfo({ teamID });
  const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;

  const tradeBlockEmbed = await getTeamSimReportCard(interaction, teamName, true);

  await interaction.reply({
    embeds    : [tradeBlockEmbed],
    ephemeral : true,
  });
};
