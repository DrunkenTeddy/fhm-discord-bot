const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} = require("discord.js");

module.exports = async (interaction) => {
  const channel  = interaction.guild.channels.cache.find((c) => c.name === "csv-upload");
  const messages = await channel.messages.fetch();
  const message  = messages.find((m) => m.embeds.length > 0 && m.embeds[0].title === "CSV Files Status");
  const embed    = new EmbedBuilder()
    .setTitle("CSV Files Status")
    .setDescription("All CSV files were imported successfully and the database is now up to date.")
    .setColor(0x046c13);

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("new-csv-upload")
      .setLabel("New Upload".toTitleCase())
      .setStyle(ButtonStyle.Success),
  );

  if (message) {
    await message.edit({ embeds: [embed], components: [buttons] });
  } else {
    await channel.send({ embeds: [embed], components: [buttons] });
  }

  await interaction.reply({ content: "Database synced successfully.", ephemeral: true });
};
