const { SlashCommandBuilder } = require("discord.js");

const tradeBlockSearch = require("../events/buttons/tradeBlockSearch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tradeblock-search")
    .setDescription("Search a player on the trade block."),

  async execute(interaction) {
    await tradeBlockSearch(interaction);
  },
};
