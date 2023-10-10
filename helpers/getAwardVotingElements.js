const { EmbedBuilder }                                 = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const getCurrentDate       = require("./getCurrentDate");
const getAwards            = require("./getAwards");
const getAward             = require("./getAward");
const getPlayerInfo        = require("./getPlayerInfo");
const awardsGetFinalists   = require("./awardsGetFinalists");
const getPlayerStats       = require("./getPlayerStats");
const getPlayerStatsString = require("./getPlayerStatsString");
const getTeamInfo          = require("./getTeamInfo");
const awardsGetVotedPlayer = require("./awardsGetVotedPlayer");
const getGoalieStats       = require("./getGoalieStats");
const getGoalieStatsString = require("./getGoalieStatsString");
const getTeamRecord        = require("./getTeamRecord");
const getTeamRecordString  = require("./getTeamRecordString");
const getTeamIcon          = require("./getTeamIcon");

module.exports = async (interaction, awardID) => {
  const currentDate          = await getCurrentDate();
  const currentYear          = currentDate.split("-")[0];
  const discordID            = interaction.user.id;
  const teamInfo             = await getTeamInfo({ discordID });
  const teamID               = teamInfo.TeamID;
  const awards               = await getAwards();
  const award                = await getAward(awardID);
  const finalists            = await awardsGetFinalists(currentYear, awardID);
  const votedFinalist        = await awardsGetVotedPlayer(currentYear, awardID, teamID);
  const votedFinalistByAward = await awards.reduce(async (acc, votedPlayerAward) => {
    const votedPlayerAwardID = votedPlayerAward.ID;
    const votedPlayerInfo    = await awardsGetVotedPlayer(currentYear, votedPlayerAwardID, teamID);

    return { ...await acc, [votedPlayerAwardID]: votedPlayerInfo };
  }, Promise.resolve({}));

  const awardEmbed = new EmbedBuilder()
    .setTitle(`${award.Name} (${parseInt(awardID, 10)}/${awards.length})`)
    .setDescription(`**${award.Description}**`)
    .setColor(0xF2A433);

  const progressEmbed = new EmbedBuilder()
    .setTitle("Completion Progress".toTitleCase())
    .setColor(0xF2A433);

  const finalistsEmbeds = [];
  const voteButtons     = [];

  const completionString = await awards.reduce(async (acc, currentAward, index) => {
    const completed = votedFinalistByAward[currentAward.ID] !== null;

    return `${await acc}${index > 0 ? "-" : ""}${completed ? "✅" : "❌"}`;
  }, Promise.resolve(""));

  const progressString = awards.reduce((acc, currentAward, index) => `${acc}${index > 0 ? "-" : ""}${parseInt(awardID, 10) === index + 1 ? "⚪" : "⚫"}`, "");

  progressEmbed.setFooter({ text: `${completionString}\n${progressString}` });

  if (finalists.length === 0) {
    finalistsEmbeds.push(
      new EmbedBuilder()
        .setTitle("No finalists")
        .setDescription("No finalists have been nominated for this award yet.")
        .setColor(0xF2A433),
    );

    return {
      embeds     : [awardEmbed, ...finalistsEmbeds],
      components : [],
    };
  }

  for (const finalist of finalists) {
    if (finalist.PlayerID) {
      const playerID       = finalist.PlayerID;
      const playerInfo     = await getPlayerInfo({ playerID });
      const playerName     = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
      const playerTeamInfo = await getTeamInfo({ teamID: playerInfo.TeamID });
      const playerTeamName = `${playerTeamInfo.Name} ${playerTeamInfo.Nickname}`;
      const playerTeamIcon = await getTeamIcon(playerTeamName, interaction.client.emojis.cache);
      const playerStats    = await getPlayerStats({ playerID });

      let playerStatsString     = "";
      let playerStatsFullString = "";

      if (playerStats) {
        playerStatsString     = getPlayerStatsString(playerStats);
        playerStatsFullString = getPlayerStatsString(playerStats, true);
      } else {
        const goalieStats     = await getGoalieStats({ playerID });
        playerStatsString     = getGoalieStatsString(goalieStats);
        playerStatsFullString = getGoalieStatsString(goalieStats, true);
      }

      finalistsEmbeds.push(
        new EmbedBuilder()
          .setTitle(`${playerTeamIcon} ${playerName}`)
          .setDescription(playerStatsString)
          .setFooter({ text: playerStatsFullString })
          .setColor(parseInt(playerTeamInfo.PrimaryColor.replace("#", ""), 16)),
      );

      voteButtons.push(
        new ButtonBuilder()
          .setCustomId(`awards-vote-player-${awardID}-${playerID}`)
          .setLabel(`${playerName}`)
          .setStyle(votedFinalist && votedFinalist.PlayerID === playerID ? ButtonStyle.Success : ButtonStyle.Secondary),
      );
    } else {
      const finalistTeamInfo = await getTeamInfo({ discordID: finalist.DiscordID });

      if (finalistTeamInfo) {
        const finalistTeamName     = `${finalistTeamInfo.Name} ${finalistTeamInfo.Nickname}`;
        const finalistTeamIcon     = await getTeamIcon(finalistTeamName, interaction.client.emojis.cache);
        const finalistTeamRecord   = await getTeamRecord({ teamID: finalistTeamInfo.TeamID });
        const teamRecordString     = getTeamRecordString(finalistTeamRecord);
        const teamRecordFullString = getTeamRecordString(finalistTeamRecord, true);

        finalistsEmbeds.push(
          new EmbedBuilder()
            .setTitle(`${finalistTeamIcon} ${finalistTeamName}`)
            .setDescription(teamRecordString)
            .setFooter({ text: teamRecordFullString })
            .setColor(parseInt(finalistTeamInfo.PrimaryColor.replace("#", ""), 16)),
        );

        voteButtons.push(
          new ButtonBuilder()
            .setCustomId(`awards-vote-team-${awardID}-${finalist.DiscordID}`)
            .setLabel(`${finalistTeamInfo.Name} ${finalistTeamInfo.Nickname}`)
            .setStyle(votedFinalist && votedFinalist.DiscordID === finalist.DiscordID ? ButtonStyle.Success : ButtonStyle.Secondary),
        );
      }
    }
  }

  if (finalistsEmbeds.length === 0) {
    return { embeds: [awardEmbed] };
  }

  const votingButtons = new ActionRowBuilder().addComponents(...voteButtons);

  if (votedFinalist !== null) {
    if (votedFinalist.PlayerID !== null) {
      const playerInfo = await getPlayerInfo({ playerID: votedFinalist.PlayerID });
      const playerName = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;

      awardEmbed.setDescription(`${awardEmbed.data.description}\n**<:pencil:1071645729531121666> You voted for ${playerName}**`);
    } else {
      const votedFinalistTeamInfo = await getTeamInfo({ discordID: votedFinalist.DiscordID });

      awardEmbed.setDescription(`${awardEmbed.data.description}\n**<:pencil:1071645729531121666> You voted for ${votedFinalistTeamInfo.Name} ${votedFinalistTeamInfo.Nickname}**`);
    }
  }

  return {
    embeds     : [awardEmbed, ...finalistsEmbeds, progressEmbed],
    components : [votingButtons],
  };
};
