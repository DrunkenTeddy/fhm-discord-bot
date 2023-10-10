const { EmbedBuilder } = require("discord.js");

const getCurrentDate      = require("./getCurrentDate");
const getStandings        = require("./getStandings");
const getTeamInfo         = require("./getTeamInfo");
const getTeamNameWithIcon = require("./getTeamNameWithIcon");
const sortTeams           = require("./sortTeams");

module.exports = async (interaction, postInChannel = false) => {
  if (!interaction.deferred) {
    await interaction.deferReply({ ephemeral: true });
  }

  const standings     = await getStandings();
  const date          = await getCurrentDate();
  const dateYear      = parseInt(date.split("-")[0], 10).pad(4);
  const dateMonth     = parseInt(date.split("-")[1], 10).pad(2);
  const dateDay       = parseInt(date.split("-")[2], 10).pad(2);
  const dateFormatted = `${dateYear}-${dateMonth}-${dateDay}`;

  const easternConferenceStandings = standings.filter((s) => s.ConferenceID === 0).sort(sortTeams);
  const westernConferenceStandings = standings.filter((s) => s.ConferenceID === 1).sort(sortTeams);

  const easternEmbed = new EmbedBuilder().setTitle(`Eastern Conference (${dateFormatted})`.toTitleCase());
  const westernEmbed = new EmbedBuilder().setTitle(`Western Conference (${dateFormatted})`.toTitleCase());

  for (let i = 0; i < easternConferenceStandings.length; i += 1) {
    const team     = easternConferenceStandings[i];
    const teamInfo = await getTeamInfo({ teamID: team.TeamID });
    const teamName = getTeamNameWithIcon(`${teamInfo.Name} ${teamInfo.Nickname}`, interaction.client.emojis.cache);

    if (i === 8) {
      easternEmbed.addFields({ name: "------------------------------------", value: " " });
    }

    easternEmbed.addFields({
      name  : `${i + 1}. ${teamName} (${team.Points} pts)`,
      value : `Record: ${team.Wins}-${team.Losses}-${team.OTL + team.SOL} (${team.Wins + team.Losses + team.OTL + team.SOL} GP)`,
    });
  }

  for (let i = 0; i < westernConferenceStandings.length; i += 1) {
    const team     = westernConferenceStandings[i];
    const teamInfo = await getTeamInfo({ teamID: team.TeamID });
    const teamName = getTeamNameWithIcon(`${teamInfo.Name} ${teamInfo.Nickname}`, interaction.client.emojis.cache);

    if (i === 8) {
      westernEmbed.addFields({ name: "------------------------------------", value: " " });
    }

    westernEmbed.addFields({
      name  : `${i + 1}. ${teamName} (${team.Points} pts)`,
      value : `Record: ${team.Wins}-${team.Losses}-${team.OTL + team.SOL} (${team.Wins + team.Losses + team.OTL + team.SOL} GP)`,
    });
  }

  if (postInChannel) {
    const standingsChannel = interaction.client.channels.cache.find((c) => c.name === "standings");
    await standingsChannel.send({ embeds: [easternEmbed, westernEmbed] });
  } else {
    await interaction.editReply({
      embeds    : [easternEmbed, westernEmbed],
      ephemeral : true,
    });
  }
};
