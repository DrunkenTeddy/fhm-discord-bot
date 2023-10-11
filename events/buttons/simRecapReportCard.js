const { EmbedBuilder }                = require("discord.js");
const getTeamInfo                     = require("../../helpers/getTeamInfo");
const getTeamLeadersForDateRangeEmbed = require("../../helpers/getTeamLeadersForDateRangeEmbed");
const getLastSimInfo                  = require("../../helpers/getLastSimInfo");
const { getSimRecapCard }             = require("../../helpers/getSimRecapCard");
const { getTeamSimReportCard }        = require("../../helpers/getTeamSimReportCard");

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

  // Check if original message was ephemeral
  if (interaction.message && interaction.message.flags.has(64)) {
    await interaction.deferUpdate();
  } else {
    await interaction.deferReply({ ephemeral: true });
  }

  const teamID          = teamInfo.TeamID;
  const teamName        = `${teamInfo.Name} ${teamInfo.Nickname}`;
  const latestSim       = await getLastSimInfo();
  const reportCardEmbed = await getTeamSimReportCard(interaction, teamName, true);
  const statsEmbed      = await getTeamLeadersForDateRangeEmbed(interaction, teamID, latestSim.DateStart, latestSim.DateEnd);
  const { components }  = await getSimRecapCard(interaction);

  // Check if original message was ephemeral
  if (interaction.message && interaction.message.flags.has(64)) {
    await interaction.editReply({ embeds: [reportCardEmbed, statsEmbed], components });
  } else {
    await interaction.reply({ embeds: [reportCardEmbed, statsEmbed], components, ephemeral: true });
  }
};
