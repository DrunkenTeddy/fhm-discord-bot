const csvImport = require("./message/csvImport");
const draftPick = require("./message/draftPick");

module.exports = {
  name: "messageCreate",
  async execute(interaction) {
    if (interaction.author.bot) return;

    if (interaction.channel.name === "csv-upload") {
      await csvImport(interaction);
    } else if (interaction.channel.name === "draft-log") {
      await draftPick(interaction);
    }
  },
};
