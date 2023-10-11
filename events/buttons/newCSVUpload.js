const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");

const csvFiles = require("../../static_data/csvFiles.json");

module.exports = async (interaction) => {
  const csvEmbed = new EmbedBuilder()
    .setTitle("CSV Files Status")
    .setColor(0x0099ff)
    .addFields(...csvFiles.map((file) => ({ name: file.name, value: "Ready to upload" })));

  const channel  = interaction.guild.channels.cache.find((c) => c.name === "csv-upload");
  const messages = await channel.messages.fetch();
  const message  = messages.find((m) => m.embeds.length > 0 && m.embeds[0].title === "CSV Files Status");

  if (message) {
    await message.edit({ embeds: [csvEmbed], components: [] });
  } else {
    await channel.send({ embeds: [csvEmbed], components: [] });
  }

  await interaction.reply({ content: "New CSV upload started, please upload the missing CSV files in the channel.", ephemeral: true });
};
