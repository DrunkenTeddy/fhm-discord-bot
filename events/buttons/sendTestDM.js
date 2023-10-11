const getDiscordInfo      = require("../../helpers/getDiscordInfo");
const getTeamInfo         = require("../../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");

module.exports = async (interaction) => {
  const userID   = interaction.user.id;
  const teamInfo = await getTeamInfo({ discordID: userID });

  if (!teamInfo) {
    await interaction.reply({
      content   : "You are not currently registered as a GM.",
      ephemeral : true,
    });
    return;
  }

  try {
    const teamName         = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
    const discordInfo      = await getDiscordInfo({ teamName });
    const discordID        = discordInfo.DiscordID;

    const DM = await interaction.client.users.fetch(discordID);
    await DM.send(`You are currently registered as the GM of the **${teamNameWithIcon}**`);

    await interaction.reply({
      content   : "Test DM sent.",
      ephemeral : true,
    });
  } catch (error) {
    console.error(error);

    await interaction.reply({
      content   : "There was an error while sending the test DM.",
      ephemeral : true,
    });
  }
};
