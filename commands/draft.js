const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const autocomplete        = require("../helpers/autocomplete");
const getPlayerInfo       = require("../helpers/getPlayerInfo");
const getTeamInfo         = require("../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

const getPlayerRatings          = require("../helpers/getPlayerRatings");
const getLeagueInfo             = require("../helpers/getLeagueInfo");
const getPlayerStats            = require("../helpers/getPlayerStats");
const getDraftPlayerDescription = require("../helpers/getDraftPlayerDescription");
const logDraftedPlayer          = require("../helpers/logDraftedPlayer");
const getCurrentDate            = require("../helpers/getCurrentDate");
const getTeamIcon               = require("../helpers/getTeamIcon");
const postDraftMessage          = require("../helpers/postDraftMessage");
const query                     = require("../helpers/query");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("draft")
    .setDescription("Draft a player in the current draft.")
    .addStringOption((option) => option.setName("player")
      .setDescription("Player name.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("team")
      .setDescription("Team name.")
      .setRequired(true)
      .setAutocomplete(true)),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  async execute(interaction) {
    const playerName = interaction.options.getString("player");
    const teamName   = interaction.options.getString("team");

    const success = await this.draftPlayer(interaction, playerName, teamName);

    if (success) {
      await interaction.reply({
        content   : "Player successfully drafted",
        ephemeral : true,
      });
    } else {
      await interaction.reply({
        content   : "Player could not be drafted",
        ephemeral : true,
      });
    }
  },

  async draftPlayer(interaction, playerName, teamName) {
    const channel      = interaction.guild.channels.cache.find((c) => c.name === "draft-log");
    const messages     = await channel.messages.fetch({ limit: 1 });
    const draftMessage = messages.first();
    const draftEmbed   = new EmbedBuilder();

    if (draftMessage.size === 0 || draftMessage.embeds[0].title.includes("Pick on the clock:") === false) {
      await interaction.reply({
        content   : "No draft in progress",
        ephemeral : true,
      });
      return false;
    }

    const currentDate = await getCurrentDate();
    const currentYear = currentDate.split("-")[0];
    const currentPick = draftMessage.embeds[0].title.split("Pick on the clock: ")[1];
    const nextPick    = parseInt(currentPick, 10) + 1;

    const teamIcon         = getTeamIcon(teamName, interaction.client.emojis.cache);
    const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
    const teamInfo         = await getTeamInfo({ teamName });

    if (!teamInfo) {
      if (interaction.author) { await interaction.author.send(`Invalid team name (\`${teamName}\`).`); }
      else if (interaction.user) { await interaction.user.send(`Invalid team name (\`${teamName}\`).`); }
      return false;
    }

    const playerInfo = await getPlayerInfo({ playerName });

    if (!playerInfo) {
      if (interaction.author) { await interaction.author.send(`Invalid player name (\`${playerName}\`).`); }
      else if (interaction.user) { await interaction.user.send(`Invalid player name (\`${playerName}\`).`); }
      return false;
    }

    // Check if the player is already drafted
    const draftedPlayer = await query(`SELECT * FROM drafted_players WHERE PlayerID=${playerInfo.PlayerID}`);

    if (draftedPlayer.length > 0) {
      if (interaction.author) { await interaction.author.send(`**${playerName}** is already drafted.`); }
      else if (interaction.user) { await interaction.user.send(`**${playerName}** is already drafted.`); }
      return false;
    }

    const playerRatings   = await getPlayerRatings(playerInfo.PlayerID);
    const positions       = ["C", "LW", "RW", "LD", "RD", "G"];
    const playerPositions = positions.filter((p) => playerRatings[p] >= 15);
    const playerTeamInfo  = await getTeamInfo({ teamID: playerInfo.TeamID });

    let playerDraftMessage = "";

    if (playerTeamInfo === null) {
      playerDraftMessage = `${teamNameWithIcon} selects **${playerName}**`;
    } else {
      const playerTeamName         = `${playerTeamInfo.Name} ${playerTeamInfo.Nickname}`;
      const playerTeamLeagueInfo   = await getLeagueInfo({ leagueID: playerTeamInfo.LeagueID });
      const playerStats            = await getPlayerStats({ playerID: playerInfo.PlayerID });
      const playerDraftDescription = getDraftPlayerDescription(playerInfo, playerStats, playerRatings, teamInfo);

      playerDraftMessage = `${teamNameWithIcon} selects **${playerName}** from the ${playerTeamName} (${playerTeamLeagueInfo.Abbr}). ${playerDraftDescription}`;
    }

    draftEmbed.setColor(teamInfo.PrimaryColor)
      .setTitle(`${currentPick}. ${playerName} (${playerPositions.join("/")})`)
      .setDescription(playerDraftMessage);

    await logDraftedPlayer(playerInfo.PlayerID, teamInfo.TeamID, currentYear, currentPick);

    await draftMessage.delete();

    if (parseInt(currentPick, 10) <= 32) {
      await channel.send({ embeds: [draftEmbed] });
    } else {
      await channel.send({ content: `${currentPick}. **${teamIcon} ${playerName} (${playerPositions.join("/")})**` });
    }

    await postDraftMessage(interaction, nextPick);
    return true;
  },
};
