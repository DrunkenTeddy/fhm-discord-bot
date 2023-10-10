const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const autocomplete        = require("../helpers/autocomplete");
const getPlayerInfo       = require("../helpers/getPlayerInfo");
const getPlayerStats      = require("../helpers/getPlayerStats");
const getTeamInfo         = require("../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playerstats")
    .setDescription("Get stats about a player.")
    .addStringOption((option) => option.setName("player")
      .setDescription("Player name.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("team")
      .setDescription("Team name.")
      .setAutocomplete(true)),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  async execute(interaction) {
    const playerName = interaction.options.getString("player");
    const teamName   = interaction.options.getString("team") || "";

    await this.showPlayerStats(interaction, playerName, teamName);
  },

  async showPlayerStats(interaction, playerName, teamName) {
    if (!interaction.deferred) {
      await interaction.deferReply({ ephemeral: true });
    }

    const player = await getPlayerInfo({ playerName, teamName });

    if (player !== null) {
      const teamInfo = await getTeamInfo({ teamID: player.TeamID });

      if (teamInfo !== null) {
        const seasonStats = await getPlayerStats({ playerID: player.PlayerID });

        if (seasonStats !== null) {
          const playerStatsEmbed = new EmbedBuilder()
            .setColor(teamInfo.PrimaryColor)
            .setTitle("Player Stats".toTitleCase())
            .addFields(
              { name: "Name", value: `${player["First Name"]} ${player["Last Name"]}` },
              { name: "Team", value: getTeamNameWithIcon(`${teamInfo.Name} ${teamInfo.Nickname}`, interaction.client.emojis.cache) },
              { name: "GP", value: `${seasonStats.GP}`, inline: true },
              { name: "G", value: `${seasonStats.G}`, inline: true },
              { name: "A", value: `${seasonStats.A}`, inline: true },
              { name: "PIM", value: `${seasonStats.PIM}`, inline: true },
              { name: "+/-", value: `${seasonStats.PlusMinus}`, inline: true },
              { name: "PPG", value: `${seasonStats.PPG}`, inline: true },
              { name: "PPA", value: `${seasonStats.PPA}`, inline: true },
              { name: "SHG", value: `${seasonStats.SHG}`, inline: true },
              { name: "SHA", value: `${seasonStats.SHA}`, inline: true },
              { name: "GR", value: `${seasonStats.GR}`, inline: true },
              { name: "GWG", value: `${seasonStats.GWG}`, inline: true },
              { name: "SOG", value: `${seasonStats.SOG}`, inline: true },
              { name: "FO", value: `${seasonStats.FO}`, inline: true },
              { name: "FOW", value: `${seasonStats.FOW}`, inline: true },
              { name: "HIT", value: `${seasonStats.HIT}`, inline: true },
              { name: "GvA", value: `${seasonStats.GvA}`, inline: true },
              { name: "TkA", value: `${seasonStats.TkA}`, inline: true },
              { name: "SB", value: `${seasonStats.SB}`, inline: true },
              { name: "TOI", value: `${seasonStats.TOI}`, inline: true },
              { name: "PPTOI", value: `${seasonStats.PPTOI}`, inline: true },
              { name: "SHTOI", value: `${seasonStats.SHTOI}`, inline: true },
              { name: "Fights", value: `${seasonStats.Fights}`, inline: true },
              { name: "Fights Won", value: `${seasonStats.Fights_Won}`, inline: true },
            );

          await interaction.editReply({
            embeds    : [playerStatsEmbed],
            ephemeral : true,
          });
        } else {
          await interaction.editReply({
            content   : "No stats found for this player.",
            ephemeral : true,
          });
        }
      } else {
        await interaction.editReply({
          content   : "Team not found.",
          ephemeral : true,
        });
      }
    } else {
      await interaction.editReply({
        content   : "Player not found.",
        ephemeral : true,
      });
    }
  },
};
