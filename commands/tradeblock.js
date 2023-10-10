const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Show Trade Block")
    .setType(ApplicationCommandType.User),
};
