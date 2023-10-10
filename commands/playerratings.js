const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const autocomplete          = require("../helpers/autocomplete");
const getAgeFromDateOfBirth = require("../helpers/getAgeFromDateOfBirth");
const getContractInfo       = require("../helpers/getContractInfo");
const getHeightInFeet       = require("../helpers/getHeightInFeet");
const getPlayerInfo         = require("../helpers/getPlayerInfo");
const getPlayerRatings      = require("../helpers/getPlayerRatings");
const getRatingWithIcon     = require("../helpers/getRatingWithIcon");
const getStarRatings        = require("../helpers/getStarRatings");
const getTeamInfo           = require("../helpers/getTeamInfo");
const getTeamNameWithIcon   = require("../helpers/getTeamNameWithIcon");

const getPlayerEmbeds = (interaction, playerRatings, teamInfo) => {
  const positionRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Position Ratings".toTitleCase())
    .addFields(
      { name: "LW", value: getRatingWithIcon(playerRatings.LW, interaction.client.emojis.cache), inline: true },
      { name: "C", value: getRatingWithIcon(playerRatings.C, interaction.client.emojis.cache), inline: true },
      { name: "RW", value: getRatingWithIcon(playerRatings.RW, interaction.client.emojis.cache), inline: true },
      { name: "LD", value: getRatingWithIcon(playerRatings.LD, interaction.client.emojis.cache), inline: true },
      { name: "RD", value: getRatingWithIcon(playerRatings.RD, interaction.client.emojis.cache), inline: true },
      { name: "\u200b", value: "\u200b", inline: true },
    );

  const offensiveRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Offensive Ratings".toTitleCase())
    .addFields(
      { name: "Screening", value: getRatingWithIcon(playerRatings.Screening, interaction.client.emojis.cache), inline: true },
      { name: "Getting Open", value: getRatingWithIcon(playerRatings.GettingOpen, interaction.client.emojis.cache), inline: true },
      { name: "Passing", value: getRatingWithIcon(playerRatings.Passing, interaction.client.emojis.cache), inline: true },
      { name: "Puckhandling", value: getRatingWithIcon(playerRatings.PuckHandling, interaction.client.emojis.cache), inline: true },
      { name: "Shooting Accuracy", value: getRatingWithIcon(playerRatings.ShootingAccuracy, interaction.client.emojis.cache), inline: true },
      { name: "Shooting Range", value: getRatingWithIcon(playerRatings.ShootingRange, interaction.client.emojis.cache), inline: true },
      { name: "Offensive Read", value: getRatingWithIcon(playerRatings.OffensiveRead, interaction.client.emojis.cache), inline: true },
    );

  const defensiveRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Defensive Ratings".toTitleCase())
    .addFields(
      { name: "Checking", value: getRatingWithIcon(playerRatings.Checking, interaction.client.emojis.cache), inline: true },
      { name: "Faceoffs", value: getRatingWithIcon(playerRatings.Faceoffs, interaction.client.emojis.cache), inline: true },
      { name: "Hitting", value: getRatingWithIcon(playerRatings.Hitting, interaction.client.emojis.cache), inline: true },
      { name: "Positioning", value: getRatingWithIcon(playerRatings.Positioning, interaction.client.emojis.cache), inline: true },
      { name: "Shot Blocking", value: getRatingWithIcon(playerRatings.ShotBlocking, interaction.client.emojis.cache), inline: true },
      { name: "Stickchecking", value: getRatingWithIcon(playerRatings.Stickchecking, interaction.client.emojis.cache), inline: true },
      { name: "Defensive Read", value: getRatingWithIcon(playerRatings.DefensiveRead, interaction.client.emojis.cache), inline: true },
    );

  const mentalRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Mental Ratings".toTitleCase())
    .addFields(
      { name: "Aggression", value: getRatingWithIcon(playerRatings.Aggression, interaction.client.emojis.cache), inline: true },
      { name: "Bravery", value: getRatingWithIcon(playerRatings.Bravery, interaction.client.emojis.cache), inline: true },
      { name: "Determination", value: getRatingWithIcon(playerRatings.Determination, interaction.client.emojis.cache), inline: true },
      { name: "Team Player", value: getRatingWithIcon(playerRatings.Teamplayer, interaction.client.emojis.cache), inline: true },
      { name: "Leadership", value: getRatingWithIcon(playerRatings.Leadership, interaction.client.emojis.cache), inline: true },
      { name: "Temperament", value: getRatingWithIcon(playerRatings.Temperament, interaction.client.emojis.cache), inline: true },
      { name: "Professionalism", value: getRatingWithIcon(playerRatings.Professionalism, interaction.client.emojis.cache), inline: true },
    );

  const physicalRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Physical Ratings".toTitleCase())
    .addFields(
      { name: "Acceleration", value: getRatingWithIcon(playerRatings.Acceleration, interaction.client.emojis.cache), inline: true },
      { name: "Agility", value: getRatingWithIcon(playerRatings.Agility, interaction.client.emojis.cache), inline: true },
      { name: "Balance", value: getRatingWithIcon(playerRatings.Balance, interaction.client.emojis.cache), inline: true },
      { name: "Speed", value: getRatingWithIcon(playerRatings.Speed, interaction.client.emojis.cache), inline: true },
      { name: "Stamina", value: getRatingWithIcon(playerRatings.Stamina, interaction.client.emojis.cache), inline: true },
      { name: "Strength", value: getRatingWithIcon(playerRatings.Strength, interaction.client.emojis.cache), inline: true },
      { name: "Fighting", value: getRatingWithIcon(playerRatings.Fighting, interaction.client.emojis.cache), inline: true },
    );

  return [positionRatingsEmbed, offensiveRatingsEmbed, defensiveRatingsEmbed, mentalRatingsEmbed, physicalRatingsEmbed];
};

const getGoalieEmbeds = (interaction, playerRatings, teamInfo) => {
  const goalieRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Goalie Ratings".toTitleCase())
    .addFields(
      { name: "Positioning", value: getRatingWithIcon(playerRatings.GPositioning, interaction.client.emojis.cache), inline: true },
      { name: "Passing", value: getRatingWithIcon(playerRatings.GPassing, interaction.client.emojis.cache), inline: true },
      { name: "Pokecheck", value: getRatingWithIcon(playerRatings.GPokecheck, interaction.client.emojis.cache), inline: true },
      { name: "Blocker", value: getRatingWithIcon(playerRatings.Blocker, interaction.client.emojis.cache), inline: true },
      { name: "Glove", value: getRatingWithIcon(playerRatings.Glove, interaction.client.emojis.cache), inline: true },
      { name: "Rebound", value: getRatingWithIcon(playerRatings.Rebound, interaction.client.emojis.cache), inline: true },
      { name: "Recovery", value: getRatingWithIcon(playerRatings.Recovery, interaction.client.emojis.cache), inline: true },
      { name: "Puckhandling", value: getRatingWithIcon(playerRatings.GPuckhandling, interaction.client.emojis.cache), inline: true },
      { name: "Low Shots", value: getRatingWithIcon(playerRatings.LowShots, interaction.client.emojis.cache), inline: true },
      { name: "Skating", value: getRatingWithIcon(playerRatings.GSkating, interaction.client.emojis.cache), inline: true },
      { name: "Reflexes", value: getRatingWithIcon(playerRatings.Reflexes, interaction.client.emojis.cache), inline: true },
    );

  const mentalRatingsEmbed = new EmbedBuilder()
    .setColor(teamInfo.PrimaryColor)
    .setTitle("Mental Ratings".toTitleCase())
    .addFields(
      { name: "Aggression", value: getRatingWithIcon(playerRatings.Aggression, interaction.client.emojis.cache), inline: true },
      { name: "Mental Toughness", value: getRatingWithIcon(playerRatings.MentalToughness, interaction.client.emojis.cache), inline: true },
      { name: "Determination", value: getRatingWithIcon(playerRatings.Determination, interaction.client.emojis.cache), inline: true },
      { name: "Team Player", value: getRatingWithIcon(playerRatings.Teamplayer, interaction.client.emojis.cache), inline: true },
      { name: "Leadership", value: getRatingWithIcon(playerRatings.Leadership, interaction.client.emojis.cache), inline: true },
      { name: "Stamina", value: getRatingWithIcon(playerRatings.Stamina, interaction.client.emojis.cache), inline: true },
      { name: "Professionalism", value: getRatingWithIcon(playerRatings.Professionalism, interaction.client.emojis.cache), inline: true },
    );

  return [goalieRatingsEmbed, mentalRatingsEmbed];
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playerratings")
    .setDescription("Get ratings about a player.")
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

  execute(interaction) {
    const playerName = interaction.options.getString("player");
    const teamName   = interaction.options.getString("team") || "";

    this.showPlayerRatings(interaction, playerName, teamName);
  },
  async showPlayerRatings(interaction, playerName, teamName, DM = false) {
    if (!interaction.deferred) {
      await interaction.deferReply({ ephemeral: true });
    }

    const player = await getPlayerInfo({ playerName, teamName });

    if (player !== null) {
      const teamInfo = await getTeamInfo({ teamID: player.TeamID });

      if (teamInfo !== null) {
        const playerRatings          = await getPlayerRatings(player.PlayerID);
        const { ability, potential } = getStarRatings(interaction.client, playerRatings);
        const contractInfo           = await getContractInfo({ playerID: player.PlayerID, teamID: teamInfo.TeamID });

        const playerBioEmbed = new EmbedBuilder()
          .setColor(teamInfo.PrimaryColor)
          .setTitle(`${player["First Name"]} ${player["Last Name"]}`)
          .setDescription(`${getTeamNameWithIcon(`${teamInfo.Name} ${teamInfo.Nickname}`, interaction.client.emojis.cache)}`)
          .addFields(
            { name: "Ability", value: `${ability}` },
            { name: "Potential", value: `${potential}` },
            { name: "Age", value: `${getAgeFromDateOfBirth(player.DOB)}`, inline: true },
            { name: "Height", value: `${getHeightInFeet(player.Height)}`, inline: true },
            { name: "Weight", value: `${player.Weight}lb`, inline: true },
          );

        if (contractInfo) {
          playerBioEmbed.addFields(
            { name: "Status", value: contractInfo.UFA ? "UFA" : "RFA", inline: true },
            { name: "NTC", value: `${contractInfo.NTC}`, inline: true },
            { name: "NMC", value: `${contractInfo.NMC}`, inline: true },
          );
        }

        const embeds = [playerBioEmbed];

        if (parseInt(playerRatings.G, 10) >= 18) {
          embeds.push(...getGoalieEmbeds(interaction, playerRatings, teamInfo));
        } else {
          embeds.push(...getPlayerEmbeds(interaction, playerRatings, teamInfo));
        }

        if (DM) {
          interaction.user.send({ embeds });

          await interaction.editReply({
            content   : "Player Ratings sent to your DMs.",
            ephemeral : true,
          });
        } else {
          await interaction.editReply({ embeds, ephemeral: true });
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
