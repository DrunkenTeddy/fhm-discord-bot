const { ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");
const { ButtonStyle }                                              = require("discord.js");
const getPickID                                                    = require("../../helpers/getPickID");

const newTradeRemovePickConditionSelect = require("../select/newTradeRemovePickConditionSelect");

module.exports = async (interaction) => {
  const embeds                   = interaction.message.embeds;
  const draftPickConditionsEmbed = embeds.find((embed) => embed.title === "Pick Conditions");

  if (draftPickConditionsEmbed) {
    const pickLines  = draftPickConditionsEmbed.description.split("\n").filter((line) => line !== "");
    const draftPicks = pickLines.reduce((acc, line) => {
      if (line.startsWith("**")) {
        const pick = line.replace("**", "").replace("**", "");
        acc[pick]  = pickLines[pickLines.indexOf(line) + 1];
      }

      return acc;
    }, {});

    if (Object.keys(draftPicks).length === 1) {
      await newTradeRemovePickConditionSelect(interaction, Object.keys(draftPicks)[0]);
    } else {
      const options = await Object.keys(draftPicks).reduce(async (acc, pick) => [
        ...await acc,
        {
          label       : pick,
          value       : `${await getPickID(pick)}`,
          description : draftPicks[pick],
        },
      ], []);

      const pickSelect = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("new-trade-remove-pick-condition")
          .setPlaceholder("Select Draft Pick To Remove Condition".toTitleCase())
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
  }
};
