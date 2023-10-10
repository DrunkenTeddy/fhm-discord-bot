const { EmbedBuilder } = require("discord.js");

const getCurrentDate = require("./getCurrentDate");

module.exports = async (interaction, currentPick) => {
  const currentDate = await getCurrentDate();
  const currentYear = currentDate.split("-")[0];

  const draftEmbed = new EmbedBuilder()
    .setColor(0x046c13)
    .setTitle(`${currentYear} Draft - Pick on the clock: ${currentPick}`)
    .setDescription("The draft is currently in progress. Use the `/draft` command to draft a player.\nYou can also post directly in this channel using the following format:\n`Connor Bedard (MTL)`");

  const channel = interaction.client.channels.cache.find((c) => c.name === "draft-log");
  await channel.send({ embeds: [draftEmbed] });
};
