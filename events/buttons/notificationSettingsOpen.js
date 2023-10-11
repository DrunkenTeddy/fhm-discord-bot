const { EmbedBuilder } = require("@discordjs/builders");

const getDiscordInfo     = require("../../helpers/getDiscordInfo");
const getSettingsButtons = require("../../helpers/getSettingsButtons");
const getTeamInfo        = require("../../helpers/getTeamInfo");

module.exports = async (interaction, update = true) => {
  const discordID   = interaction.user.id;
  const discordInfo = await getDiscordInfo({ discordID });

  if (!discordInfo) {
    await interaction.reply({
      content   : "You are not currently registered as a GM.",
      ephemeral : true,
    });
    return;
  }

  const teamInfo = await getTeamInfo({ discordID });
  const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;
  const teamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

  const notificationEmbed = new EmbedBuilder()
    .setTitle(`${teamLogo} Notification Settings`)
    .setDescription("Click the buttons below to toggle your notification settings.");

  if (update) {
    await interaction.update({
      embeds     : [notificationEmbed],
      components : getSettingsButtons(discordInfo),
      ephemeral  : true,
    });
  } else {
    await interaction.reply({
      embeds     : [notificationEmbed],
      components : getSettingsButtons(discordInfo),
      ephemeral  : true,
    });
  }
};
