const { EmbedBuilder } = require("discord.js");

const query                  = require("./query");
const getPlayerInfo          = require("./getPlayerInfo");
const getPlayerRatings       = require("./getPlayerRatings");
const getStarRatings         = require("./getStarRatings");
const getTeamIcon            = require("./getTeamIcon");
const getTeamInfo            = require("./getTeamInfo");
const tradeBlockRemovePlayer = require("./tradeBlockRemovePlayer");

// Function to split a string into chunks of a specific length
function chunkString(str, length) {
  const chunks = [];
  while (str) {
    if (str.length < length) {
      chunks.push(str);
      break;
    } else {
      const pos   = str.lastIndexOf("\n", length); // Try to split by newline
      const chunk = pos === -1 ? str.substr(0, length) : str.substr(0, pos);
      chunks.push(chunk);
      str = pos === -1 ? str.substr(length) : str.substr(pos + 1);
    }
  }
  return chunks;
}

module.exports = async (client, players) => {
  const results    = await query("SELECT DiscordID FROM gm WHERE NotifTradeBlock=1");
  const discordIDs = [];

  for (const result of results) {
    if (!discordIDs.includes(result.DiscordID)) {
      discordIDs.push(result.DiscordID);
    }
  }

  let message = "";

  for (const player of players) {
    const teamID     = player.TeamID;
    const playerInfo = await getPlayerInfo({ playerID: player.PlayerID });

    if (playerInfo !== null) {
      const playerRatings   = await getPlayerRatings(playerInfo.PlayerID);
      const teamInfo        = await getTeamInfo({ teamID: playerInfo.FranchiseID });
      const teamName        = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo        = getTeamIcon(teamName, client.emojis.cache);
      const playerName      = `${teamLogo} ${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
      const positions       = ["C", "LW", "RW", "LD", "RD", "G"];
      const playerPositions = positions.filter((position) => playerRatings[position] >= 15);
      const { ability }     = getStarRatings(client, playerRatings);

      message += `**${playerName}** (${playerPositions.join("/")}) - ${ability}\n`;
    } else {
      // Player info is null, that probably means the player is a free agent so remove him from the trade block.
      await tradeBlockRemovePlayer(teamID, player.PlayerID);
    }
  }

  // Split message into chunks of max 4000 characters each (using 4000 to have some buffer)
  const chunkedMessages = chunkString(message, 4000);

  for (let i = 0; i < chunkedMessages.length; i++) {
    const chunk = chunkedMessages[i];
    const title = i === 0 ? "New players added to trade block".toTitleCase() : " ";  // Title only for the first chunk

    const chunkedEmbed = new EmbedBuilder().setTitle(title).setDescription(chunk);

    // Send a notification to each GM
    await Promise.all(discordIDs.map(async (discordID) => {
      try {
        const DM = await client.users.fetch(discordID);

        if (DM) {
          await DM.send({ embeds: [chunkedEmbed] });
        }
      } catch (err) {
        console.error(`Failed to send DM to user ${discordID}: `, err);
      }
    }));
  }

  return discordIDs;
};
