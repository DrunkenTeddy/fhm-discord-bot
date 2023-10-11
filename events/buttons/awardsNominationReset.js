const awardsResetNominations   = require("../../helpers/awardsResetNominations");
const getAwardNominationEmbeds = require("../../helpers/getAwardNominationEmbeds");
const getCurrentDate           = require("../../helpers/getCurrentDate");

module.exports = async (interaction) => {
  await interaction.deferUpdate({ ephemeral: true });

  const teamID      = interaction.customId.split("-")[3];
  const awardID     = interaction.customId.split("-")[4];
  const currentDate = await getCurrentDate();
  const year        = currentDate.split("-")[0];

  await awardsResetNominations(year, awardID, teamID);

  const awardEmbeds = await getAwardNominationEmbeds(interaction, awardID, teamID);

  await interaction.editReply({ embeds: awardEmbeds });
};
