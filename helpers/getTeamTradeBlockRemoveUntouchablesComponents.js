const { ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");

const getPlayerInfo             = require("./getPlayerInfo");
const getTradeBlockUntouchables = require("./getTradeBlockUntouchables");

module.exports = async (interaction, teamID) => {
  const teamTradeBlockUntouchables = await getTradeBlockUntouchables({ teamID }) || [];

  if (teamTradeBlockUntouchables.length === 0) {
    return null;
  }

  const options = await teamTradeBlockUntouchables.reduce(async (acc, player) => {
    const playerID   = `${player.PlayerID}`;
    const playerInfo = await getPlayerInfo({ playerID });
    const playerName = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;

    return [...await acc, { label: playerName, value: playerID }];
  }, []);

  const playersSelect = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`trade-block-remove-untouchables-${teamID}`)
      .setPlaceholder("Select Players To Remove".toTitleCase())
      .setMinValues(1)
      .setMaxValues(options.length)
      .addOptions(options),
  );

  return [playersSelect];
};
