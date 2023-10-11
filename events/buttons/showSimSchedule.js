const getScheduledSimsEmbeds = require("../../helpers/getScheduledSimsEmbeds");
const getTeamInfo            = require("../../helpers/getTeamInfo");

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

  await interaction.deferReply({ ephemeral: true });

  const scheduledSimEmbeds = await getScheduledSimsEmbeds();

  await interaction.editReply({
    embeds    : scheduledSimEmbeds,
    ephemeral : true,
  });
};
