const { showGMHub } = require("../../commands/gm");

module.exports = async (interaction) => {
  await showGMHub(interaction, true);
};
