const { SlashCommandBuilder } = require("discord.js");

const helpDiscordBot = require("../events/buttons/helpDiscordBot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Open help menu."),

  async execute(interaction) {
    await helpDiscordBot(interaction, false);
  },
};
