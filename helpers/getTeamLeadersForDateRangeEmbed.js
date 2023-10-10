const { EmbedBuilder } = require("@discordjs/builders");

const getStatLeadersForDateRange = require("./getStatLeadersForDateRange");
const getTeamInfo                = require("./getTeamInfo");

module.exports = async (interaction, teamID, start, end) => {
  const teamInfo    = await getTeamInfo({ teamID });
  const teamLeaders = await getStatLeadersForDateRange(start, end, teamID);

  const goalLeadersString   = teamLeaders.goalLeaders.map((g) => `**${g.goals}**- ${g.playerName}`).join("\n");
  const assistLeadersString = teamLeaders.assistLeaders.map((a) => `**${a.assists}**- ${a.playerName}`).join("\n");
  const pointLeadersString  = teamLeaders.pointLeaders.map((p) => `**${p.points}**- ${p.playerName}`).join("\n");

  const teamLeadersEmbed = new EmbedBuilder()
    .setColor(parseInt(teamInfo.PrimaryColor.replace("#", ""), 16))
    .setTitle("Team Leaders");

  teamLeadersEmbed.addFields(
    { name: "Points", value: pointLeadersString !== "" ? pointLeadersString : "No points scored", inline: true },
    { name: "Goals", value: goalLeadersString !== "" ? goalLeadersString : "No goals scored", inline: true },
    { name: "Assists", value: assistLeadersString !== "" ? assistLeadersString : "No assists scored", inline: true },
  );

  return teamLeadersEmbed;
};
