const getTeamInfo         = require("../../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");

module.exports = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const teamID               = interaction.customId.split("-")[3];
  const teamInfo             = await getTeamInfo({ teamID });
  const teamName             = `${teamInfo.Name} ${teamInfo.Nickname}`;
  const tradeReviewMessageID = interaction.customId.split("-")[4];

  const channel = interaction.client.channels.cache.find((c) => c.name === "trade-review-board");

  // Clear cache to make sure we get the latest message
  channel.messages.cache.clear();

  try {
    // Get the message in the trade-review-board channel
    const message = await channel.messages.fetch(tradeReviewMessageID);

    // Find the line waiting for the GM to accept the trade and replace it with the GM accepting the trade
    const tradeReviewMessage    = message.content.split("\n");
    const tradeReviewMessageNew = [];
    for (const line of tradeReviewMessage) {
      if (line.startsWith("Waiting for") && line.includes(teamName)) {
        tradeReviewMessageNew.push(`**${getTeamNameWithIcon(teamName, interaction.client.emojis.cache)} GM has rejected the trade.**`);
      } else {
        tradeReviewMessageNew.push(line);
      }
    }

    // Edit the message in the trade-review-board channel
    await message.edit({ content: tradeReviewMessageNew.join("\n") });

    // Send a message to the GM that the trade has been accepted
    await interaction.editReply({ content: "You have rejected the trade." });
  } catch (e) {
    await interaction.editReply({ content: "Trade message could not be found in the trade-review-board channel. The trade has probably already been accepted or rejected. Please contact an admin if you think this is a mistake." });
  }

  // Delete the message in DMs
  await interaction.message.delete();
};
