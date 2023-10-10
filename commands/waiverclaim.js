const { SlashCommandBuilder } = require("discord.js");

const autocomplete        = require("../helpers/autocomplete");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("waiverclaim")
    .setDescription("Claim a player on waivers.")
    .addStringOption((option) => option.setName("team")
      .setDescription("Team claiming the player.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("player")
      .setDescription("Player to claim.")
      .setRequired(true)
      .setAutocomplete(true)),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const team   = interaction.options.getString("team");
    const player = interaction.options.getString("player");

    const channel = interaction.client.channels.cache.find((c) => c.name === "waiver-wire");
    await channel.send({
      content: `**${getTeamNameWithIcon(team, interaction.client.emojis.cache)}** claims **${player}** off waivers.`,
    });

    await interaction.editReply({
      content   : `Claimed ${player} off waivers.`,
      ephemeral : true,
    });
  },
};
