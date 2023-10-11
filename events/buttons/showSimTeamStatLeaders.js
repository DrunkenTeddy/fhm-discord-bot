const getLastSimInfo                  = require("../../helpers/getLastSimInfo");
const getTeamLeadersForDateRangeEmbed = require("../../helpers/getTeamLeadersForDateRangeEmbed");

module.exports = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const teamID     = interaction.customId.split("-")[5];
  const latestSim  = await getLastSimInfo();
  const statsEmbed = await getTeamLeadersForDateRangeEmbed(interaction, teamID, latestSim.DateStart, latestSim.DateEnd);

  await interaction.editReply({
    embeds    : [statsEmbed],
    ephemeral : true,
  });
};
