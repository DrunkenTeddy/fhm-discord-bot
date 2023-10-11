const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = async (interaction, update = true) => {
  const helpMessage = `
**Discord Bot Help**

**How to use commands**
To use bot commands, you need to start your message with /. A list of all available commands will open.

Most commands will ask you for one or more information. You should see a description of the information asked for each one. Team names and player names are auto completed. To make sure the command will work properly, make sure you always use a value from the auto complete list.

You can use bot commands in any channel that you can write in. The bot commands will be hidden from the other users so don't worry about spam, only you can see the commands that you use.

**How to report bugs**
If you use a command and the bot does not reply in the next 3 or 5 seconds, it means the command probably failed. If you use a command and don't get a reply or if you have any issue with the bot you can contact <@98484454032420864>
  `;

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("help-discord-bot-update")
      .setLabel("Discord Bot Help")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("help-commands-update")
      .setLabel("Available Commands".toTitleCase())
      .setStyle(ButtonStyle.Primary),
  );

  const secondaryButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("return-gm-hub")
      .setLabel("Back to GM Hub".toTitleCase())
      .setStyle(ButtonStyle.Secondary),
  );

  if (update) {
    await interaction.update({
      content    : helpMessage,
      components : [buttons, secondaryButtons],
      embeds     : [],
      ephemeral  : true,
    });
  } else {
    await interaction.reply({
      content    : helpMessage,
      components : [buttons, secondaryButtons],
      ephemeral  : true,
    });
  }
};
