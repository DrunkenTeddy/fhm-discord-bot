const getPickNameFromID  = require("../../helpers/getPickNameFromID");
const getNewTradeButtons = require("../../helpers/getNewTradeButtons");

module.exports = async (interaction) => {
  const pickID                    = interaction.customId.split("-")[5];
  const pick                      = await getPickNameFromID(pickID);
  const pickCondition             = interaction.fields.getTextInputValue("pick-condition");
  const embeds                    = interaction.message.embeds;
  const draftPickConditionsEmbeds = embeds.filter((embed) => embed.title === "Pick Conditions");

  if (draftPickConditionsEmbeds.length === 0) {
    const draftPickConditionsEmbed = {
      title       : "Pick Conditions",
      color       : 0x005095,
      description : `**${pick}**\n${pickCondition}`,
    };

    embeds.splice(1, 0, draftPickConditionsEmbed);
  } else {
    const currentDraftPickConditionsEmbed = draftPickConditionsEmbeds[0];
    const draftPickConditionsEmbed        = {
      title       : "Pick Conditions",
      color       : 0x005095,
      description : `${currentDraftPickConditionsEmbed.description}\n\n**${pick}**\n${pickCondition}`,
    };

    embeds.splice(1, 1, draftPickConditionsEmbed);
  }

  const buttons = await getNewTradeButtons(interaction, true, true);

  // Update the message
  await interaction.update({
    embeds,
    components: [buttons],
  });
};
