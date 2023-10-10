const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const autocomplete          = require("../helpers/autocomplete");
const getAgeFromDateOfBirth = require("../helpers/getAgeFromDateOfBirth");
const getContractInfo       = require("../helpers/getContractInfo");
const getHeightInFeet       = require("../helpers/getHeightInFeet");
const getPlayerInfo         = require("../helpers/getPlayerInfo");
const getPlayerRatings      = require("../helpers/getPlayerRatings");
const getStarRatings        = require("../helpers/getStarRatings");
const getTeamInfo           = require("../helpers/getTeamInfo");
const getTeamNameWithIcon   = require("../helpers/getTeamNameWithIcon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playerinfo")
    .setDescription("Get information about a player.")
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
    await interaction.deferReply({ ephemeral: true });

    const playerName = interaction.options.getString("player");
    const teamName   = interaction.options.getString("team") || "";

    let player   = await getPlayerInfo({ playerName, teamName });
    let teamInfo = null;

    if (player !== null) {
      if (player.length > 1) {
        if (teamName !== "") {
          teamInfo       = await getTeamInfo({ teamName });
          const filtered = player.find((p) => p.TeamID === teamInfo.TeamID);

          if (filtered) {
            player = filtered;
          }
        } else {
          player   = player[0];
          teamInfo = await getTeamInfo({ teamID: player.TeamID });
        }
      } else {
        teamInfo = await getTeamInfo({ teamID: player.TeamID });
      }

      if (teamInfo !== null) {
        const playerRatings          = await getPlayerRatings(player.PlayerID);
        const { ability, potential } = getStarRatings(interaction.client, playerRatings);
        const contractInfo           = await getContractInfo({ playerID: player.PlayerID, teamID: teamInfo.TeamID });

        const playerBioEmbed = new EmbedBuilder()
          .setColor(teamInfo.PrimaryColor)
          .setTitle(`${player["First Name"]} ${player["Last Name"]}`)
          .setDescription(getTeamNameWithIcon(`${teamInfo.Name} ${teamInfo.Nickname}`, interaction.client.emojis.cache))
          .addFields(
            { name: "Ability", value: ability },
            { name: "Potential", value: potential },
            { name: "Age", value: getAgeFromDateOfBirth(player.DOB), inline: true },
            { name: "Height", value: getHeightInFeet(player.Height), inline: true },
            { name: "Weight", value: `${player.Weight}lb`, inline: true },
            { name: "Status", value: contractInfo.UFA ? "UFA" : "RFA", inline: true },
            { name: "NTC", value: contractInfo.NTC, inline: true },
            { name: "NMC", value: contractInfo.NMC, inline: true },
          );

        await interaction.editReply({
          embeds    : [playerBioEmbed],
          ephemeral : true,
        });
      } else {
        await interaction.editReply({
          content   : "Player not found.",
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
