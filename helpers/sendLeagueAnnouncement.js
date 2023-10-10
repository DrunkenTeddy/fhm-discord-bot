const query = require("./query");

module.exports = async (interaction, message) => {
  const results    = await query("SELECT DiscordID FROM gm");
  const discordIDs = [];

  for (const result of results) {
    if (!discordIDs.includes(result.DiscordID)) {
      discordIDs.push(result.DiscordID);
    }
  }

  // Send a message to each GM
  await Promise.all(discordIDs.map(async (discordID) => {
    try {
      const DM = await interaction.client.users.fetch(discordID);

      if (DM) {
        await DM.send(`**New League Announcement:**\n\n${message}`);
      }
    } catch (err) {
      console.error(`Failed to send DM to user ${discordID}: `, err);
    }
  }));

  return discordIDs;
};
