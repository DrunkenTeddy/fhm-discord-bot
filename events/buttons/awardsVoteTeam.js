const { ButtonStyle } = require("discord.js");

const awardsAddVote          = require("../../helpers/awardsAddVote");
const getAwardVotingElements = require("../../helpers/getAwardVotingElements");
const getCurrentDate         = require("../../helpers/getCurrentDate");
const getTeamInfo            = require("../../helpers/getTeamInfo");

module.exports = async (interaction) => {
  const currentDate   = await getCurrentDate();
  const currentYear   = currentDate.split("-")[0];
  const awardID       = interaction.customId.split("-")[3];
  const components    = interaction.message.components;
  const teamDiscordID = interaction.customId.split("-")[4];
  const teamInfo      = await getTeamInfo({ discordID: teamDiscordID });
  const teamName      = `${teamInfo.Name} ${teamInfo.Nickname}`;
  const userDiscordID = interaction.user.id;
  const userTeamInfo  = await getTeamInfo({ discordID: userDiscordID });
  const userTeamID    = userTeamInfo.TeamID;

  await awardsAddVote(currentYear, awardID, null, teamDiscordID, userTeamID);

  const awardVotingElements = await getAwardVotingElements(interaction, awardID);
  const awardEmbeds         = awardVotingElements.embeds;
  const trophyEmbed         = awardEmbeds[0];
  const descriptionLines    = trophyEmbed.data.description.split("\n");

  trophyEmbed.data.description = `${descriptionLines[0]}\n**<:pencil:1071645729531121666> You voted for ${teamName}**`;

  for (const button of components[0].components) {
    if (button.data.label === teamName) {
      button.data.style = ButtonStyle.Success;
    } else {
      button.data.style = ButtonStyle.Secondary;
    }
  }

  await interaction.update({
    embeds: awardEmbeds,
    components,
  });
};
