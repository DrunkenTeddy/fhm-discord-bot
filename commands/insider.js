const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const autocomplete = require("../helpers/autocomplete");

const insiders = require("../static_data/insiders.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insider")
    .setDescription("Send information to an NHL insider.")
    .addStringOption((option) => option.setName("insider")
      .setDescription("NHL insider to send information to.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("information")
      .setDescription("Information to send to the insider.")
      .setRequired(true)),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  execute(interaction) {
    const insider     = interaction.options.getString("insider");
    const information = interaction.options.getString("information");

    this.sendInsiderInfo(interaction, insider, information);
  },

  async sendInsiderInfo(interaction, insider, information) {
    if (insiders.find((i) => i.name === insider)) {
      const insiderInfo = insiders.find((i) => i.name === insider);
      const photo       = insiderInfo.image;
      const network     = insiderInfo.network;
      const color       = network === "TSN" ? 0xed1c24 : 0x085089;

      const insiderEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(" ")
        .setAuthor({ name: insider, iconURL: photo })
        .setDescription(information)
        .setTimestamp();

      const channel = interaction.client.channels.cache.find((c) => c.name === "insider-info");
      channel.send({ embeds: [insiderEmbed] });

      if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({ content: `Sent information to ${insider}!`, ephemeral: true });
      }
    } else if (!interaction.deferred && !interaction.replied) {
      await interaction.reply({
        content   : "That insider does not exist.",
        ephemeral : true,
      });
    }
  },
};
