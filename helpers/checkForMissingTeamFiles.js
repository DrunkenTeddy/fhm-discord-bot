const sendMissingTeamFileReminders = require("./sendMissingTeamFileReminders");

module.exports = async (client) => {
  await sendMissingTeamFileReminders(client);
};
