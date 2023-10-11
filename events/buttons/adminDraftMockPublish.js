const { EmbedBuilder } = require("discord.js");

const draftProfiles = require("../../static_data/draftProfiles.json");

const getTeamInfo             = require("../../helpers/getTeamInfo");
const getPlayerInfo           = require("../../helpers/getPlayerInfo");
const getLeagueInfo           = require("../../helpers/getLeagueInfo");
const getFlagEmoji            = require("../../helpers/getFlagEmoji");
const getNextDraftYear        = require("../../helpers/getNextDraftYear");
const getDraftEligiblePlayers = require("../../helpers/getDraftEligiblePlayers");
const getPlayerRatings        = require("../../helpers/getPlayerRatings");

module.exports = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const draftProfileIndex = interaction.customId.split("-")[4];
  const draftProfile      = draftProfiles[draftProfileIndex];
  const draftYear         = await getNextDraftYear();
  const ranking           = await getDraftEligiblePlayers(draftYear, draftProfile);
  const channel           = interaction.guild.channels.cache.find((c) => c.name === "central-scouting");

  const positions = ["C", "LW", "RW", "LD", "RD", "G"];
  const promises  = ranking.map(async (player, index) => {
    const playerName           = `${player["First Name"]} ${player["Last Name"]}`;
    const playerInfo           = await getPlayerInfo({ playerID: player.PlayerID });
    const playerRatings        = await getPlayerRatings(player.PlayerID);
    const playerPositions      = positions.filter((p) => playerRatings[p] >= 15);
    const playerTeamInfo       = await getTeamInfo({ teamID: playerInfo.TeamID });
    const playerTeamName       = `${playerTeamInfo.Name} ${playerTeamInfo.Nickname}`;
    const playerTeamLeagueInfo = await getLeagueInfo({ leagueID: playerTeamInfo.LeagueID });
    const playerFlag           = getFlagEmoji(playerInfo.Nationality_One);

    return `${index}. ${playerFlag} **${playerName} (${playerPositions.join("/")})** - ${playerTeamName} (${playerTeamLeagueInfo.Abbr})`;
  });

  const messages = await Promise.all(promises);
  const message  = messages.join("\n");

  const rankingEmbed = new EmbedBuilder()
    .setTitle(`Draft Ranking - ${draftProfile.name}`)
    .setDescription(message)
    .setFooter({ text: `This ranking reflects the draft preferences of ${draftProfile.name} and is not intended to be a definitive prediction of the final draft outcome. Your own scouting may yield more accurate and personalized results, potentially providing a better representation of the draft.` });

  await channel.send({ embeds: [rankingEmbed] });

  await interaction.editReply({ content: "Draft ranking published." });
};
