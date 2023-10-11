const { sendInsiderInfo } = require("../../commands/insider");

const insiders = require("../../static_data/insiders.json");

module.exports = async (interaction) => {
  const information = interaction.fields.getTextInputValue("insider-message");
  const insider     = insiders[Math.floor(Math.random() * insiders.length)].name;

  await sendInsiderInfo(interaction, insider, information);
};
