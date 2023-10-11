const getDiscordInfo     = require("../../helpers/getDiscordInfo");
const getSettingsButtons = require("../../helpers/getSettingsButtons");
const updateSetting      = require("../../helpers/updateSetting");

module.exports = async (interaction) => {
  const discordID    = interaction.user.id;
  const setting      = interaction.customId.replace("notification-settings-update-", "");
  const discordInfo  = await getDiscordInfo({ discordID });
  const currentValue = discordInfo[setting];

  await updateSetting(interaction, discordID, setting, !currentValue);

  const discordInfoUpdated = await getDiscordInfo({ discordID });

  if (!discordInfo) {
    await interaction.reply({
      content   : "You are not currently registered as a GM.",
      ephemeral : true,
    });
    return;
  }

  await interaction.update({
    components : getSettingsButtons(discordInfoUpdated),
    ephemeral  : true,
  });
};
