const getNewTradeButtons = require("../../helpers/getNewTradeButtons");
const getPickNameFromID  = require("../../helpers/getPickNameFromID");

module.exports = async (interaction, pickName = null) => {
  if (pickName === null) {
    const pickID = interaction.values[0];
    pickName     = await getPickNameFromID(pickID);
  }

  const embeds                   = interaction.message.embeds;
  const draftPickConditionsEmbed = embeds.find((embed) => embed.title === "Pick Conditions");

  if (draftPickConditionsEmbed) {
    const pickLines = draftPickConditionsEmbed.description.split("\n").filter((line) => line !== "");

    if (pickLines.length === 2) {
      embeds.splice(1, 1);
    } else {
      const picks = pickLines.reduce((acc, line) => {
        if (line.startsWith("**")) {
          const pick = line.replaceAll("**", "");

          if (pick !== pickName) {
            acc[pick] = pickLines[pickLines.indexOf(line) + 1];
          }
        }

        return acc;
      }, {});

      const newPickLines = Object.entries(picks).reduce((acc, [pick, condition], index) => {
        if (index !== 0) {
          acc.push("");
        }

        acc.push(`**${pick}**`);
        acc.push(condition);

        return acc;
      }, []);

      const newDraftPickConditionsEmbed = {
        title       : "Pick Conditions",
        color       : 0x005095,
        description : newPickLines.join("\n"),
      };

      embeds.splice(1, 1, newDraftPickConditionsEmbed);
    }

    const buttons = getNewTradeButtons(interaction, true);

    await interaction.update({
      embeds,
      components : [buttons],
      ephemeral  : true,
    });
  } else {
    await interaction.reply({
      content   : "There are no pick conditions to remove.",
      ephemeral : true,
    });
  }
};
