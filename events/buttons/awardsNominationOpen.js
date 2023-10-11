const { ActionRowBuilder, TextInputBuilder, ModalBuilder } = require("@discordjs/builders");
const { TextInputStyle }                                   = require("discord.js");

const getAward = require("../../helpers/getAward");

module.exports = async (interaction) => {
  const awardId          = interaction.customId.split("-")[4];
  const award            = await getAward(awardId);
  const embeds           = interaction.message.embeds;
  const nominationsEmbed = embeds.find((embed) => embed.title === "My Nominations");
  const description      = nominationsEmbed.data.description;
  const teamAwardsID     = [9, 10];
  const nominations      = description.split("\n").map((nomination) => {
    nomination = nomination.replaceAll("**", "").replace(" (Confirmed)", "").replace(" (Error)", "").replace(" (Player not found)", "").replace(" (Team not found)", "").trim();
    return nomination;
  }).join("\n");

  const modal = new ModalBuilder()
    .setCustomId(`award-nomination-${awardId}`)
    .setTitle(award.Description);

  const label = teamAwardsID.includes(parseInt(awardId, 10)) ? "Teams (1 per line, 5 max)" : "Player Names (1 per line, 5 max)";

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      nominations !== "You don't have any nominations for this award."
        ? new TextInputBuilder()
          .setCustomId("nominations")
          .setLabel(label)
          .setStyle(TextInputStyle.Paragraph)
          .setValue(nominations)
        : new TextInputBuilder()
          .setCustomId("nominations")
          .setLabel(label)
          .setStyle(TextInputStyle.Paragraph),
    ),
  );

  await interaction.showModal(modal);
};
