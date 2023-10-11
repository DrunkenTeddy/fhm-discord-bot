const { EmbedBuilder } = require("discord.js");

const getCurrentDate = require("../../helpers/getCurrentDate");

module.exports = async (interaction) => {
  const channel      = interaction.guild.channels.cache.find((c) => c.name === "draft-log");
  const messages     = await channel.messages.fetch({ limit: 1 });
  const draftMessage = messages.first();

  await draftMessage.delete();

  const currentDate = await getCurrentDate();
  const currentYear = currentDate.split("-")[0];

  const draftEmbed = new EmbedBuilder()
    .setColor(0x046c13)
    .setTitle(`${currentYear} Draft`)
    .setDescription("The draft has ended.");

  await channel.send({ embeds: [draftEmbed] });

  await interaction.reply({
    content   : "Draft ended",
    ephemeral : true,
  });
};
