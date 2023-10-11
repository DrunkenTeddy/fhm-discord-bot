const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = async (interaction) => {
  const channel     = interaction.client.channels.cache.find((c) => c.name === "offer-sheets");
  const signingInfo = `\n${interaction.message.content.split("\n").slice(1).join("\n").replace("wants to sign", "has sent an offer sheet to")}`;

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("offer-sheet-signing-gm-accept")
        .setLabel("Match Offer")
        .setStyle(ButtonStyle.Success),
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("offer-sheet-signing-gm-reject")
        .setLabel("Don't Match Offer")
        .setStyle(ButtonStyle.Secondary),
    );

  await channel.send({ content: signingInfo, components: [buttons] });

  await interaction.message.delete();
};
