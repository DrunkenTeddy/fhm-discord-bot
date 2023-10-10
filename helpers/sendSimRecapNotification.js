const query                           = require("./query");
const getLastSimInfo                  = require("./getLastSimInfo");
const getTeamInfo                     = require("./getTeamInfo");
const getTeamLeadersForDateRangeEmbed = require("./getTeamLeadersForDateRangeEmbed");
const { getTeamSimReportCard }        = require("./getTeamSimReportCard");

module.exports = async (interaction) => {
  const results    = await query("SELECT DiscordID FROM gm WHERE NotifSimRecaps=1");
  const discordIDs = [];

  for (const result of results) {
    if (!discordIDs.includes(result.DiscordID)) {
      discordIDs.push(result.DiscordID);
    }
  }

  // Send a notification to each GM
  await Promise.all(discordIDs.map(async (discordID) => {
    try {
      const content         = "**A new iNHL simulation has been completed.**";
      const teamInfo        = await getTeamInfo({ discordID });
      const teamID          = teamInfo.TeamID;
      const teamName        = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const latestSim       = await getLastSimInfo();
      const reportCardEmbed = await getTeamSimReportCard(interaction, teamName, true);
      const statsEmbed      = await getTeamLeadersForDateRangeEmbed(interaction, teamID, latestSim.DateStart, latestSim.DateEnd);

      const DM = await interaction.client.users.fetch(discordID);

      if (DM) {
        await DM.send({ content, embeds: [reportCardEmbed, statsEmbed] });
      }
    } catch (err) {
      console.error(`Failed to send DM to user ${discordID}: `, err);
    }
  }));

  return discordIDs;
};
