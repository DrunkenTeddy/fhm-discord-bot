const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const getDiscordInfo       = require("../../helpers/getDiscordInfo");
const getTeamInfo          = require("../../helpers/getTeamInfo");
const transformTradeString = require("../../helpers/transformTradeString");

module.exports = async (interaction) => {
  const embeds      = interaction.message.embeds;
  const tradeString = embeds[0].description;
  const tradeLines  = tradeString.split("\n").filter((line) => line !== "");
  const tradeObject = transformTradeString(tradeString);
  const teamNames   = Object.keys(tradeObject).filter((teamName) => teamName !== "Pick Conditions");

  let tradeMessage = tradeLines.reduce((acc, line) => {
    const teamLine = line.includes("receives") || line.includes("sends");
    if (teamLine) { acc.push(""); }
    acc.push(line);
    return acc;
  }, []).join("\n");

  const pickConditionsEmbed = embeds.find((embed) => embed.title === "Pick Conditions");

  if (pickConditionsEmbed) {
    const pickConditions     = pickConditionsEmbed.description;
    const pickConditionLines = pickConditions.split("\n").filter((line) => line !== "");

    const pickConditionMessage = pickConditionLines.reduce((acc, line, index) => {
      if (line.startsWith("**") && index !== 0) { acc.push(""); }
      acc.push(line);
      return acc;
    }, []).join("\n");

    tradeMessage += `\n\n**Pick Conditions:**\n${pickConditionMessage}`;
  }

  let confirmationString = "";

  for (const teamName of teamNames) {
    confirmationString += `\nWaiting for ${teamName} to confirm the trade...`;
  }

  // Send trade to review board
  const buttons = new ActionRowBuilder()
    .addComponents(new ButtonBuilder().setCustomId("trade-accept").setLabel("Accept").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId("trade-reject").setLabel("Reject").setStyle(ButtonStyle.Danger));

  const channel                 = interaction.client.channels.cache.find((c) => c.name === "trade-review-board");
  const tradeReviewBoardMessage = await channel.send({ content: `New trade offer from ${interaction.user.username}:\n${tradeMessage}\n${confirmationString}`, components: [buttons] });

  // Send confirmation message to each team
  teamNames.forEach(async (teamName, index) => {
    const emojiRegex = /<:.+?:\d+>/g;
    const emojiMatch = teamName.match(emojiRegex);

    if (emojiMatch) {
      teamName = teamName.replace(emojiMatch[0], "").trim();
    }

    const teamInfo        = await getTeamInfo({ teamName });
    const teamID          = teamInfo.TeamID;
    const teamDiscordInfo = await getDiscordInfo({ abbr: teamInfo.Abbr });
    const teamDiscordID   = teamDiscordInfo.DiscordID;

    const teamConfirmationButtons = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId(`trade-accept-gm${index}-${teamID}-${tradeReviewBoardMessage.id}`).setLabel("Accept").setStyle(ButtonStyle.Success))
      .addComponents(new ButtonBuilder().setCustomId(`trade-reject-gm${index}-${teamID}-${tradeReviewBoardMessage.id}`).setLabel("Reject").setStyle(ButtonStyle.Danger));

    const teamDM = await interaction.client.users.fetch(teamDiscordID);
    await teamDM.send({
      content    : `Please confirm this trade offer:\n${tradeMessage}`,
      components : [teamConfirmationButtons],
    });
  });

  await interaction.update({
    content    : `Trade sent to the review board\n${tradeMessage}`,
    embeds     : [],
    components : [],
    ephemeral  : true,
  });
};
