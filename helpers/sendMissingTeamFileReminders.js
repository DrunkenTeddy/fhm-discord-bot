const { EmbedBuilder } = require("discord.js");
const query            = require("./query");

module.exports = async (client) => {
  const results    = await query("SELECT DiscordID FROM gm WHERE NotifTeamFile=1");
  const discordIDs = [];

  for (const result of results) {
    if (!discordIDs.includes(result.DiscordID)) {
      discordIDs.push(result.DiscordID);
    }
  }

  // Send a notification to each GM
  await Promise.all(discordIDs.map(async (discordID) => {
    try {
      const teamFileEmbed = new EmbedBuilder()
        .setColor(0xed1c24)
        .setTitle("Team File Missing")
        .setDescription("**The next sim is less than 12 hours away and your team file is missing.**\nPlease upload your team file from the game client as soon as possible.");

      const DM = await client.users.fetch(discordID);

      if (DM) {
        await DM.send({ embeds: [teamFileEmbed] });
      }
    } catch (err) {
      console.error(`Failed to send DM to user ${discordID}: `, err);
    }
  }));

  return discordIDs;
};
