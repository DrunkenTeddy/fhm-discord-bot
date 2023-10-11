const { showGMHub } = require("../../commands/gm");

module.exports = async (interaction, reply) => {
  await showGMHub(interaction, reply);
};
