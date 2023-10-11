const { ButtonStyle } = require("discord.js");

const awardsAddVote          = require("../../helpers/awardsAddVote");
const getAwardVotingElements = require("../../helpers/getAwardVotingElements");
const getCurrentDate         = require("../../helpers/getCurrentDate");
const getPlayerInfo          = require("../../helpers/getPlayerInfo");
const getTeamInfo            = require("../../helpers/getTeamInfo");

module.exports = async (interaction) => {
  const currentDate = await getCurrentDate();
  const currentYear = currentDate.split("-")[0];
  const awardID     = interaction.customId.split("-")[3];
  const components  = interaction.message.components;
  const playerID    = interaction.customId.split("-")[4];
  const playerInfo  = await getPlayerInfo({ playerID });
  const playerName  = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
  const discordID   = interaction.user.id;
  const teamInfo    = await getTeamInfo({ discordID });
  const teamID      = teamInfo.TeamID;

  await awardsAddVote(currentYear, awardID, playerID, null, teamID);

  const awardVotingElements = await getAwardVotingElements(interaction, awardID);
  const awardEmbeds         = awardVotingElements.embeds;
  const trophyEmbed         = awardEmbeds[0];
  const descriptionLines    = trophyEmbed.data.description.split("\n");

  trophyEmbed.data.description = `${descriptionLines[0]}\n**<:pencil:1071645729531121666> You voted for ${playerName}**`;

  for (const button of components[0].components) {
    if (button.data.label === playerName) {
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
