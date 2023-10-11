const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");

const csvFiles = require("../../static_data/csvFiles.json");

const expectedFiles = csvFiles.map((file) => file.name);

module.exports = async (interaction) => {
  const files = interaction.attachments;

  if (files.size > 0) {
    const messages = await interaction.channel.messages.fetch();
    const message  = messages.find((m) => m.embeds.length > 0 && m.embeds[0].title === "CSV Files Status");
    const embeds   = message ? message.embeds : [];

    const fields = expectedFiles.map((file) => ({ name: file, value: "❌ **MISSING**" }));

    if (embeds.length > 0) {
      embeds[0].fields.forEach((field) => {
        const foundField = fields.find((f) => f.name === field.name);

        if (foundField) {
          foundField.value = field.value;
        }
      });
    }

    expectedFiles.forEach((file) => {
      const foundFile = files.find((f) => f.name === file);

      if (foundFile) {
        fields.reduce((acc, current) => {
          if (current.name === foundFile.name) {
            current.value = `✅ **OK** (${foundFile.size / 1000}kb)`;
          }

          return acc;
        }, []);
      }
    });

    const successFiles = fields.filter((field) => field.value.includes("**OK**"));
    const success      = successFiles.length === expectedFiles.length;

    const csvEmbed = new EmbedBuilder()
      .setTitle("CSV Files Status")
      .setColor(success ? 0x046c13 : 0x0099ff)
      .setFooter({ text: `${successFiles.length}/${expectedFiles.length} imported successfully` })
      .addFields(...fields);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new-csv-upload")
        .setLabel("New Upload".toTitleCase())
        .setStyle(ButtonStyle.Danger),
    );

    const completeButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new-csv-upload")
        .setLabel("New Upload".toTitleCase())
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("sync-database")
        .setLabel("Sync Database".toTitleCase())
        .setStyle(ButtonStyle.Success),
    );

    await interaction.delete();

    if (message) {
      await message.edit({
        components : [success ? completeButtons : buttons],
        embeds     : [csvEmbed],
      });
    } else {
      await interaction.channel.send({
        components : [success ? completeButtons : buttons],
        embeds     : [csvEmbed],
      });
    }
  }
};
