const { EmbedBuilder } = require("@discordjs/builders");

const getTeamNameWithIcon       = require("./getTeamNameWithIcon");
const getTradeBlockPlayers      = require("./getTradeBlockPlayers");
const getTeamInfo               = require("./getTeamInfo");
const getPlayerInfo             = require("./getPlayerInfo");
const getPlayerRatings          = require("./getPlayerRatings");
const getTradePreference        = require("./getTradePreference");
const getTradeBlockUntouchables = require("./getTradeBlockUntouchables");
const tradeBlockRemovePlayer    = require("./tradeBlockRemovePlayer");

module.exports = async (interaction, teamName) => {
  const teamInfo              = await getTeamInfo({ teamName });
  const teamID                = teamInfo.TeamID;
  const teamNameWithIcon      = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
  const teamTradeBlockPlayers = await getTradeBlockPlayers({ teamID }, "name") || [];
  const untouchablePlayers    = await getTradeBlockUntouchables({ teamID }) || [];
  const tradePreferences      = await getTradePreference({ teamID });

  const tradeBlockEmbed = new EmbedBuilder().setTitle(`${teamNameWithIcon}`);

  tradeBlockEmbed.addFields({
    name  : "Team Needs:",
    value : tradePreferences !== null && tradePreferences.TeamNeeds !== null ? tradePreferences.TeamNeeds : "Unspecified",
  });

  if (teamTradeBlockPlayers.length > 0) {
    let tradeBlockString = "";

    for (let i = 0; i < teamTradeBlockPlayers.length; i++) {
      const availablePlayer = teamTradeBlockPlayers[i];
      const playerInfo      = await getPlayerInfo({ playerID: availablePlayer.PlayerID });

      if (!playerInfo) {
        // Player was not found so it probably means the player has changed team, remove him from the trade block
        await tradeBlockRemovePlayer(availablePlayer.TeamID, availablePlayer.PlayerID);
      } else if (teamID !== playerInfo.FranchiseID) {
        // Player has changed team, remove him from the trade block
        await tradeBlockRemovePlayer(availablePlayer.TeamID, availablePlayer.PlayerID);
      } else {
        const playerRatings   = await getPlayerRatings(playerInfo.PlayerID);
        const playerName      = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
        const positions       = ["C", "LW", "RW", "LD", "RD", "G"];
        const playerPositions = positions.filter((position) => playerRatings && playerRatings[position] >= 15);

        tradeBlockString += `
- **${playerName}** (${playerPositions.join("/")})`;
      }
    }

    if (tradeBlockString !== "") {
      tradeBlockEmbed.addFields({
        name  : "Available Players:",
        value : tradeBlockString,
      });
    }
  }

  if (untouchablePlayers.length > 0) {
    let untouchableString = "";

    for (let i = 0; i < untouchablePlayers.length; i++) {
      const untouchablePlayer = untouchablePlayers[i];
      const playerInfo        = await getPlayerInfo({ playerID: untouchablePlayer.PlayerID });
      const playerName        = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;

      untouchableString += `
- ${playerName}`;
    }

    tradeBlockEmbed.addFields({
      name  : "Untouchable Players:",
      value : untouchableString,
    });
  }

  return tradeBlockEmbed;
};
