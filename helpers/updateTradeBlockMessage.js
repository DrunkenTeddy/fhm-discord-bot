const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");

const getLatestTradeBlockPlayers = require("./getLatestTradeBlockPlayers");
const getPlayerInfo              = require("./getPlayerInfo");
const getPlayerRatings           = require("./getPlayerRatings");
const getStarRatings             = require("./getStarRatings");
const getTeamInfo                = require("./getTeamInfo");
const getTopTradeBlockPlayers    = require("./getTopTradeBlockPlayers");
const getTopTradeBlockProspects  = require("./getTopTradeBlockProspects");
const tradeBlockRemovePlayer     = require("./tradeBlockRemovePlayer");

module.exports = async (interaction) => {
  const channel                 = interaction.client.channels.cache.find((c) => c.name === "trade-block");
  const tradeBlockMessages      = await channel.messages.fetch({ limit: 100 });
  const tradeBlockMessagesArray = Array.from(tradeBlockMessages.values());
  const topTradeBlockPlayers    = await getTopTradeBlockPlayers(8);
  const topTradeBlockProspects  = await getTopTradeBlockProspects(8);
  const latestTradeBlockPlayers = await getLatestTradeBlockPlayers(8);

  let tradeBlockMessage;

  if (tradeBlockMessagesArray.length === 0) {
    tradeBlockMessage = await channel.send({ content: "Loading..." });
  } else {
    // Delete all messages in the channel except for the first one
    for (let i = 1; i < tradeBlockMessagesArray.length; i++) {
      await tradeBlockMessagesArray[i].delete();
    }

    tradeBlockMessage = tradeBlockMessagesArray[0];
  }

  const topPlayersEmbed = new EmbedBuilder().setTitle("Top players on the Trade Block".toTitleCase());
  let topPlayersString  = "";

  const topProspectsEmbed = new EmbedBuilder().setTitle("Top prospects on the Trade Block".toTitleCase());
  let topProspectsString  = "";

  const lastPlayersEmbed = new EmbedBuilder().setTitle("Last players added to the Trade Block".toTitleCase());
  let lastPlayersString  = "";

  for (let i = 0; i < topTradeBlockPlayers.length; i++) {
    const tradeBlockPlayer = topTradeBlockPlayers[topTradeBlockPlayers.length - i - 1];
    const teamID           = tradeBlockPlayer.TeamID;
    const playerInfo       = await getPlayerInfo({ playerID: tradeBlockPlayer.PlayerID });

    if (playerInfo !== null) {
      const playerRatings   = await getPlayerRatings(playerInfo.PlayerID);
      const teamInfo        = await getTeamInfo({ teamID: playerInfo.FranchiseID });
      const teamName        = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo        = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());
      const playerName      = `${teamLogo} ${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
      const positions       = ["C", "LW", "RW", "LD", "RD", "G"];
      const playerPositions = positions.filter((position) => playerRatings[position] >= 15);
      const { ability }     = getStarRatings(interaction.client, playerRatings);

      topPlayersString += `**${playerName}** (${playerPositions.join("/")}) ${ability}\n`;
    } else {
      // Player info is null, that probably means the player is a free agent so remove him from the trade block.
      await tradeBlockRemovePlayer(teamID, tradeBlockPlayer.PlayerID);
    }
  }

  topPlayersEmbed.setDescription(topPlayersString);

  for (let i = 0; i < topTradeBlockProspects.length; i++) {
    const tradeBlockPlayer = topTradeBlockProspects[topTradeBlockProspects.length - i - 1];
    const teamID           = tradeBlockPlayer.TeamID;
    const playerInfo       = await getPlayerInfo({ playerID: tradeBlockPlayer.PlayerID });

    if (playerInfo !== null) {
      const playerRatings   = await getPlayerRatings(playerInfo.PlayerID);
      const teamInfo        = await getTeamInfo({ teamID: playerInfo.FranchiseID });
      const teamName        = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo        = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());
      const playerName      = `${teamLogo} ${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
      const positions       = ["C", "LW", "RW", "LD", "RD", "G"];
      const playerPositions = positions.filter((position) => playerRatings[position] >= 15);
      const { potential }   = getStarRatings(interaction.client, playerRatings);

      topProspectsString += `**${playerName}** (${playerPositions.join("/")}) ${potential}\n`;
    } else {
      // Player info is null, that probably means the player is a free agent so remove him from the trade block.
      await tradeBlockRemovePlayer(teamID, tradeBlockPlayer.PlayerID);
    }
  }

  topProspectsEmbed.setDescription(topProspectsString);

  for (let i = 0; i < latestTradeBlockPlayers.length; i++) {
    const tradeBlockPlayer = latestTradeBlockPlayers[i];
    const teamID           = tradeBlockPlayer.TeamID;
    const playerInfo       = await getPlayerInfo({ playerID: tradeBlockPlayer.PlayerID });

    if (playerInfo !== null) {
      const playerRatings   = await getPlayerRatings(playerInfo.PlayerID);
      const teamInfo        = await getTeamInfo({ teamID: playerInfo.FranchiseID });
      const teamName        = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo        = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());
      const playerName      = `${teamLogo} ${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
      const positions       = ["C", "LW", "RW", "LD", "RD", "G"];
      const playerPositions = positions.filter((position) => playerRatings[position] >= 15);
      const { ability }     = getStarRatings(interaction.client, playerRatings);

      lastPlayersString += `**${playerName}** (${playerPositions.join("/")}) ${ability}\n`;
    } else {
      // Player info is null, that probably means the player is a free agent so remove him from the trade block.
      await tradeBlockRemovePlayer(teamID, tradeBlockPlayer.PlayerID);
    }
  }

  lastPlayersEmbed.setDescription(lastPlayersString);

  const searchButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("trade-block-search")
      .setLabel("Search Player on the Trade Block".toTitleCase())
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("trade-block-show-my-team")
      .setLabel("Open my Trade Block".toTitleCase())
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("trade-block-refresh")
      .setLabel("Refresh".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  const actionButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("trade-block-expand-top-players")
      .setLabel("View Top 15 Players".toTitleCase())
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("trade-block-expand-top-prospects")
      .setLabel("View Top 15 Prospects".toTitleCase())
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("trade-block-expand-last-players")
      .setLabel("View Last 15 Players".toTitleCase())
      .setStyle(ButtonStyle.Primary),
  );

  const otherButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("help-trade-block")
      .setLabel("Trade Block Help".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("open-gm-hub")
      .setLabel("Open GM Hub".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  // Update channel message
  await tradeBlockMessage.edit({
    content    : "",
    embeds     : [topPlayersEmbed, topProspectsEmbed, lastPlayersEmbed],
    components : [searchButtons, actionButtons, otherButtons],
  });
};
