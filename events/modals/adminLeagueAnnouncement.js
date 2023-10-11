const sendLeagueAnnouncement = require("../../helpers/sendLeagueAnnouncement");

module.exports = async (interaction) => {
  const message = interaction.fields.getTextInputValue("admin-league-announcement-message");

  await interaction.deferReply({ ephemeral: true });

  const discordIDs = await sendLeagueAnnouncement(interaction, message);
  const gmNumber   = discordIDs.length;

  await interaction.editReply({ content: `Announcement sent to ${gmNumber} GM${gmNumber === 1 ? "" : "s"}.` });
};
