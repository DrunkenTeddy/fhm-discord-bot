const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

const getDiscordInfo      = require("../../helpers/getDiscordInfo");
const getTeamInfo         = require("../../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");

const teams = require("../../static_data/teams.json");

module.exports = async (interaction) => {
  const tradeOfferTeam1Index = parseInt(interaction.customId.split("-")[2], 10);
  const tradeOfferTeam1Name  = teams[tradeOfferTeam1Index].name;
  const tradeOfferTeam1      = interaction.fields.getTextInputValue("team1");
  const tradeOfferTeam2Index = parseInt(interaction.customId.split("-")[3], 10);
  const tradeOfferTeam2Name  = teams[tradeOfferTeam2Index].name;
  const tradeOfferTeam2      = interaction.fields.getTextInputValue("team2");
  const team1Info            = await getTeamInfo({ teamName: tradeOfferTeam1Name });
  const team2Info            = await getTeamInfo({ teamName: tradeOfferTeam2Name });
  const team1ID              = team1Info.TeamID;
  const team2ID              = team2Info.TeamID;
  const team1Abbr            = team1Info.Abbr;
  const team2Abbr            = team2Info.Abbr;
  const team1DiscordInfo     = await getDiscordInfo({ abbr: team1Abbr });
  const team2DiscordInfo     = await getDiscordInfo({ abbr: team2Abbr });
  const is3Way               = interaction.customId.split("-").length === 5;

  if (is3Way) {
    const tradeOfferTeam3Index = parseInt(interaction.customId.split("-")[4], 10);
    const tradeOfferTeam3Name  = teams[tradeOfferTeam3Index].name;
    const tradeOfferTeam3      = interaction.fields.getTextInputValue("team3");
    const team3Info            = await getTeamInfo({ teamName: tradeOfferTeam3Name });
    const team3ID              = team3Info.TeamID;
    const team3Abbr            = team3Info.Abbr;
    const team3DiscordInfo     = await getDiscordInfo({ abbr: team3Abbr });

    // 3-way trade
    if (!team1DiscordInfo || !team2DiscordInfo || !team3DiscordInfo) {
      return interaction.reply({
        content   : "One of the teams you selected is not valid. Please try again or contact an admin if you believe this is an error.",
        ephemeral : true,
      });
    }

    const team1DiscordID    = team1DiscordInfo.DiscordID;
    const team2DiscordID    = team2DiscordInfo.DiscordID;
    const team3DiscordID    = team3DiscordInfo.DiscordID;
    const team1NameWithIcon = getTeamNameWithIcon(tradeOfferTeam1Name, interaction.client.emojis.cache);
    const team2NameWithIcon = getTeamNameWithIcon(tradeOfferTeam2Name, interaction.client.emojis.cache);
    const team3NameWithIcon = getTeamNameWithIcon(tradeOfferTeam3Name, interaction.client.emojis.cache);

    const tradeString        = `**${team1NameWithIcon} receives:**\n${tradeOfferTeam1}\n\n**${team2NameWithIcon} receives:**\n${tradeOfferTeam2}\n\n**${team3NameWithIcon} receives:**\n${tradeOfferTeam3}`;
    const confirmationString = `Waiting for ${team1NameWithIcon} to confirm the trade...\nWaiting for ${team2NameWithIcon} to confirm the trade...\nWaiting for ${team3NameWithIcon} to confirm the trade...`;

    // Send trade to review board
    const buttons = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId("trade-accept").setLabel("Accept").setStyle(ButtonStyle.Success))
      .addComponents(new ButtonBuilder().setCustomId("trade-reject").setLabel("Reject").setStyle(ButtonStyle.Danger));

    const channel                 = interaction.client.channels.cache.find((c) => c.name === "trade-review-board");
    const tradeReviewBoardMessage = await channel.send({ content: `New trade offer from ${interaction.user.username}:\n\n${tradeString}\n\n${confirmationString}`, components: [buttons] });

    await interaction.reply({ content: `Trade sent to the review board\n\n${tradeString}`, ephemeral: true });

    // Send trade confirmation to team 1
    const team1ConfirmationButtons = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId(`trade-accept-gm1-${team1ID}-${tradeReviewBoardMessage.id}`).setLabel("Accept").setStyle(ButtonStyle.Success))
      .addComponents(new ButtonBuilder().setCustomId(`trade-reject-gm1-${team1ID}-${tradeReviewBoardMessage.id}`).setLabel("Reject").setStyle(ButtonStyle.Danger));

    const team1DM = await interaction.client.users.fetch(team1DiscordID);
    await team1DM.send({
      content    : `Please confirm this trade offer with ${team2NameWithIcon} and ${team3NameWithIcon}:\n\n${tradeString}`,
      components : [team1ConfirmationButtons],
    });

    // Send trade confirmation to team 2
    const team2ConfirmationButtons = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId(`trade-accept-gm2-${team2ID}-${tradeReviewBoardMessage.id}`).setLabel("Accept").setStyle(ButtonStyle.Success))
      .addComponents(new ButtonBuilder().setCustomId(`trade-reject-gm2-${team2ID}-${tradeReviewBoardMessage.id}`).setLabel("Reject").setStyle(ButtonStyle.Danger));

    const team2DM = await interaction.client.users.fetch(team2DiscordID);
    await team2DM.send({
      content    : `Please confirm this trade offer with ${team1NameWithIcon} and ${team3NameWithIcon}:\n\n${tradeString}`,
      components : [team2ConfirmationButtons],
    });

    // Send trade confirmation to team 3
    const team3ConfirmationButtons = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setCustomId(`trade-accept-gm3-${team3ID}-${tradeReviewBoardMessage.id}`).setLabel("Accept").setStyle(ButtonStyle.Success))
      .addComponents(new ButtonBuilder().setCustomId(`trade-reject-gm3-${team3ID}-${tradeReviewBoardMessage.id}`).setLabel("Reject").setStyle(ButtonStyle.Danger));

    const team3DM = await interaction.client.users.fetch(team3DiscordID);
    return team3DM.send({
      content    : `Please confirm this trade offer with ${team1NameWithIcon} and ${team2NameWithIcon}:\n\n${tradeString}`,
      components : [team3ConfirmationButtons],
    });
  }

  // 2-way trade
  if (!team1DiscordInfo || !team2DiscordInfo) {
    return interaction.reply({
      content   : "One or both of the teams you selected are not valid. Please try again or contact an admin if you believe this is an error.",
      ephemeral : true,
    });
  }

  const team1DiscordID    = team1DiscordInfo.DiscordID;
  const team2DiscordID    = team2DiscordInfo.DiscordID;
  const team1NameWithIcon = getTeamNameWithIcon(tradeOfferTeam1Name, interaction.client.emojis.cache);
  const team2NameWithIcon = getTeamNameWithIcon(tradeOfferTeam2Name, interaction.client.emojis.cache);

  const tradeString        = `**${team1NameWithIcon} sends:**\n${tradeOfferTeam1}\n\n**${team2NameWithIcon} sends:**\n${tradeOfferTeam2}`;
  const confirmationString = `Waiting for ${team1NameWithIcon} to confirm the trade...\nWaiting for ${team2NameWithIcon} to confirm the trade...`;

  // Send trade to review board
  const buttons = new ActionRowBuilder()
    .addComponents(new ButtonBuilder().setCustomId("trade-accept").setLabel("Accept").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId("trade-reject").setLabel("Reject").setStyle(ButtonStyle.Danger));

  const channel                 = interaction.client.channels.cache.find((c) => c.name === "trade-review-board");
  const tradeReviewBoardMessage = await channel.send({ content: `New trade offer from ${interaction.user.username}:\n\n${tradeString}\n\n${confirmationString}`, components: [buttons] });

  await interaction.reply({ content: `Trade sent to the review board\n\n${tradeString}`, ephemeral: true });

  // Send trade confirmation to team 1
  const team1ConfirmationButtons = new ActionRowBuilder()
    .addComponents(new ButtonBuilder().setCustomId(`trade-accept-gm1-${team1ID}-${tradeReviewBoardMessage.id}`).setLabel("Accept").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId(`trade-reject-gm1-${team1ID}-${tradeReviewBoardMessage.id}`).setLabel("Reject").setStyle(ButtonStyle.Danger));

  const team1DM = await interaction.client.users.fetch(team1DiscordID);
  await team1DM.send({
    content    : `Please confirm this trade offer with ${team2Info.Name}:\n\n${tradeString}`,
    components : [team1ConfirmationButtons],
  });

  // Send trade confirmation to team 2
  const team2ConfirmationButtons = new ActionRowBuilder()
    .addComponents(new ButtonBuilder().setCustomId(`trade-accept-gm2-${team2ID}-${tradeReviewBoardMessage.id}`).setLabel("Accept").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId(`trade-reject-gm2-${team2ID}-${tradeReviewBoardMessage.id}`).setLabel("Reject").setStyle(ButtonStyle.Danger));

  const team2DM = await interaction.client.users.fetch(team2DiscordID);
  return team2DM.send({
    content    : `Please confirm this trade offer with ${team1Info.Name}:\n\n${tradeString}`,
    components : [team2ConfirmationButtons],
  });
};
