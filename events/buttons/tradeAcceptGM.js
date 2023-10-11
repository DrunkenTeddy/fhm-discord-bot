const getDiscordInfo      = require("../../helpers/getDiscordInfo");
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
  await channel.messages.cache.clear();

  try {
    // Get the message in the trade-review-board channel
    const message       = await channel.messages.fetch(tradeReviewMessageID);
    const teamNameLines = message.content.split("\n").filter((line) => line.includes("sends:") || line.includes("receives:"));
    const is3Way        = teamNameLines.length === 3;

    // Find the line waiting for the GM to accept the trade and replace it with the GM accepting the trade
    const tradeReviewMessage    = message.content.split("\n");
    const tradeReviewMessageNew = [];
    for (const line of tradeReviewMessage) {
      if (line.startsWith("Waiting for") && line.includes(teamName)) {
        tradeReviewMessageNew.push(`**${getTeamNameWithIcon(teamName, interaction.client.emojis.cache)} GM has confirmed the trade.**`);
      } else {
        tradeReviewMessageNew.push(line);
      }
    }

    // Edit the message in the trade-review-board channel
    await message.edit({ content: tradeReviewMessageNew.join("\n") });

    // Send a message to the GM that the trade has been accepted
    await interaction.editReply({ content: "You have confirmed the trade." });

    // Check if all teams have accepted the trade
    if (!tradeReviewMessageNew.join("\n").includes("Waiting for")) {
      if (is3Way) {
        const team1NameWithIcon = teamNameLines[0].replaceAll("**", "").replaceAll(" receives:", "");
        const team2NameWithIcon = teamNameLines[1].replaceAll("**", "").replaceAll(" receives:", "");
        const team3NameWithIcon = teamNameLines[2].replaceAll("**", "").replaceAll(" receives:", "");
        const team1Name         = team1NameWithIcon.replaceAll(team1NameWithIcon.split(" ")[0], "").trim();
        const team2Name         = team2NameWithIcon.replaceAll(team2NameWithIcon.split(" ")[0], "").trim();
        const team3Name         = team3NameWithIcon.replaceAll(team3NameWithIcon.split(" ")[0], "").trim();
        const team1DiscordInfo  = await getDiscordInfo({ teamName: team1Name });
        const team2DiscordInfo  = await getDiscordInfo({ teamName: team2Name });
        const team3DiscordInfo  = await getDiscordInfo({ teamName: team3Name });
        const team1DiscordID    = team1DiscordInfo.DiscordID;
        const team2DiscordID    = team2DiscordInfo.DiscordID;
        const team3DiscordID    = team3DiscordInfo.DiscordID;

        const team1DM = await interaction.client.users.fetch(team1DiscordID);
        await team1DM.send(`Your trade with ${team2NameWithIcon} and ${team3NameWithIcon} has been confirmed by all GMs. It will be reviewed by the Trade Review Board shortly.`);

        const team2DM = await interaction.client.users.fetch(team2DiscordID);
        await team2DM.send(`Your trade with ${team1NameWithIcon} and ${team3NameWithIcon} has been confirmed by all GMs. It will be reviewed by the Trade Review Board shortly.`);

        const team3DM = await interaction.client.users.fetch(team3DiscordID);
        await team3DM.send(`Your trade with ${team1NameWithIcon} and ${team2NameWithIcon} has been confirmed by all GMs. It will be reviewed by the Trade Review Board shortly.`);
      } else {
        const team1NameWithIcon = teamNameLines[0].replaceAll("**", "").replaceAll(" sends:", "");
        const team2NameWithIcon = teamNameLines[1].replaceAll("**", "").replaceAll(" sends:", "");
        const team1Name         = team1NameWithIcon.replaceAll(team1NameWithIcon.split(" ")[0], "").trim();
        const team2Name         = team2NameWithIcon.replaceAll(team2NameWithIcon.split(" ")[0], "").trim();
        const team1DiscordInfo  = await getDiscordInfo({ teamName: team1Name });
        const team2DiscordInfo  = await getDiscordInfo({ teamName: team2Name });
        const team1DiscordID    = team1DiscordInfo.DiscordID;
        const team2DiscordID    = team2DiscordInfo.DiscordID;

        const team1DM = await interaction.client.users.fetch(team1DiscordID);
        await team1DM.send(`Your trade with ${team2NameWithIcon} has been confirmed by all GMs. It will be reviewed by the Trade Review Board shortly.`);

        const team2DM = await interaction.client.users.fetch(team2DiscordID);
        await team2DM.send(`Your trade with ${team1NameWithIcon} has been confirmed by all GMs. It will be reviewed by the Trade Review Board shortly.`);
      }
    }
  } catch (e) {
    console.error(e);
    await interaction.editReply({ content: "Trade message could not be found in the trade-review-board channel. The trade has probably already been accepted or rejected. Please contact an admin if you think this is a mistake." });
  }

  // Delete the message in DMs
  await interaction.message.delete();
};
