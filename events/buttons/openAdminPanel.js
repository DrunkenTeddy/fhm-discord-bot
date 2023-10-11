const { showAdminPanel } = require("../../commands/admin");

module.exports = async (interaction, reply) => {
  await showAdminPanel(interaction, reply);
};
