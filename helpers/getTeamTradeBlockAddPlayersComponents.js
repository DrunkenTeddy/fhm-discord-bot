const { ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");

const getTradeBlockAddPlayers = require("./getTradeBlockAddPlayers");

module.exports = async (interaction, teamID) => {
  const NHLPlayers   = await getTradeBlockAddPlayers({ teamID }) || [];
  const OtherPlayers = await getTradeBlockAddPlayers({ franchiseID: teamID }) || [];

  if (NHLPlayers.length === 0) {
    return null;
  }

  const NHLOptions = await NHLPlayers.reduce(async (acc, playerInfo) => [
    ...await acc,
    { label: playerInfo.PlayerName, value: `${playerInfo.PlayerID}` },
  ], []);

  const NHLPlayersSelect = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`trade-block-add-players-nhl-${teamID}`)
      .setPlaceholder("Add NHL Players To My Trade Block".toTitleCase())
      .setMinValues(1)
      .setMaxValues(NHLOptions.length)
      .addOptions(NHLOptions),
  );

  if (OtherPlayers.length === 0) {
    return [NHLPlayersSelect];
  }

  const OtherOptions = await OtherPlayers.reduce(async (acc, playerInfo) => [
    ...await acc,
    { label: playerInfo.PlayerName, value: `${playerInfo.PlayerID}` },
  ], []);

  const OtherPlayersSelect = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`trade-block-add-players-other-${teamID}`)
      .setPlaceholder("Add Other Players To My Trade Block".toTitleCase())
      .setMinValues(1)
      .setMaxValues(OtherOptions.length)
      .addOptions(OtherOptions),
  );

  return [NHLPlayersSelect, OtherPlayersSelect];
};
