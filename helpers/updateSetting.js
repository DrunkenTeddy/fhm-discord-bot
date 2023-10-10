const query = require("./query");

module.exports = async (interaction, discordID, setting, value) => {
  const results = await query(`UPDATE gm SET ${setting}=${value ? 1 : 0} WHERE DiscordID='${discordID.replace(/'/g, "\\'")}'`);

  const DM    = await interaction.client.users.fetch(discordID);
  let message = "";

  if (DM) {
    if (setting === "NotifSimRecaps") {
      if (value) {
        message = "You will now receive sim recaps.";
      } else {
        message = "You will no longer receive sim recaps.";
      }
    } else if (setting === "NotifTradeBlock") {
      if (value) {
        message = "You will now receive trade block notifications.";
      } else {
        message = "You will no longer receive trade block notifications.";
      }
    } else if (setting === "NotifTeamFile") {
      if (value) {
        message = "You will now receive missing team file notifications.";
      } else {
        message = "You will no longer receive missing team file notifications.";
      }
    }
  }

  if (message !== "") {
    await DM.send(`**Notification Settings Updated** - ${message}`);
  }

  return results;
};
