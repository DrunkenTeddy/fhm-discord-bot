const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("My GM Hub")
    .setType(ApplicationCommandType.Message),
};
