const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const getTeamInfo            = require("../../helpers/getTeamInfo");
const getAwardVotingElements = require("../../helpers/getAwardVotingElements");
const getAwards              = require("../../helpers/getAwards");

module.exports = async (interaction) => {
  const discordID = interaction.user.id;
  const teamInfo  = await getTeamInfo({ discordID });

  if (!teamInfo) {
    await interaction.reply({
      content   : "You are not currently registered as a GM.",
      ephemeral : true,
    });
    return;
  }

  const awards              = await getAwards();
  const teamID              = teamInfo.TeamID;
  const awardVotingElements = await getAwardVotingElements(interaction, 1);

  const navigationButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-voting-next-${teamID}-${awards.length}`)
      .setLabel("Previous Award")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`awards-voting-next-${teamID}-2`)
      .setLabel("Next Award")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.reply({
    embeds     : awardVotingElements.embeds,
    components : [...awardVotingElements.components, navigationButtons],
    ephemeral  : true,
  });
};
