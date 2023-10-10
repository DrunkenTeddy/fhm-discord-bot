const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Close Prediction")
    .setType(ApplicationCommandType.Message),
};
