const { ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle }                = require("discord.js");

const isDraftPick = require("../../helpers/isDraftPick");
const getPickID   = require("../../helpers/getPickID");

const newTradeAddPickConditionSelect = require("../select/newTradeAddPickConditionSelect");

module.exports = async (interaction) => {
  const embeds      = interaction.message.embeds;
  const tradeString = embeds[0].description;
  const tradeLines  = tradeString.split("\n").filter((line) => line !== "");
  const tradeAssets = tradeLines.reduce((acc, line) => {
    const teamLine = line.includes("receives") || line.includes("sends");

    if (teamLine === false) { acc.push(line); }

    return acc;
  }, []);

  const draftPicks = tradeAssets.filter(isDraftPick);

  const draftPicksWithoutConditions = draftPicks.filter((pick) => {
    const pickConditionsEmbed = embeds.find((embed) => embed.title === "Pick Conditions");

    if (pickConditionsEmbed === undefined) { return true; }

    const pickConditionLines = pickConditionsEmbed.description.split("\n").filter((line) => line !== "");
    const pickIndex          = pickConditionLines.findIndex((line) => line.startsWith(`**${pick}**`));

    return pickIndex === -1;
  });

  if (draftPicksWithoutConditions.length === 0) {
    await interaction.reply({
      content   : "There are no draft picks to add conditions to.",
      ephemeral : true,
    });

    return;
  }

  if (draftPicksWithoutConditions.length === 1) {
    await newTradeAddPickConditionSelect(interaction, await getPickID(draftPicksWithoutConditions[0]));
  } else {
    const options = await draftPicksWithoutConditions.reduce(async (acc, pick) => [
      ...await acc,
      { label: pick, value: `${await getPickID(pick)}` },
    ], []);

    const pickSelect = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("new-trade-add-pick-condition")
        .setPlaceholder("Select Draft Pick To Add Condition".toTitleCase())
        .addOptions(options),
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new-trade-cancel-pick-condition")
        .setLabel("Cancel Pick Condition".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.update({
      components : [pickSelect, buttons],
      ephemeral  : true,
    });
  }
};
