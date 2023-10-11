const fs                                  = require("node:fs");
const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

module.exports = async (interaction, update = true) => {
  const adminOnlyCommands = [
    "admin",
    "awards-nominations",
    "awards-results",
    "awards-voting",
    "simresults",
    "sim",
    "playersigning",
    "offersheet",
  ];

  const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js") && !adminOnlyCommands.includes(file.split(".")[0]));

  let helpMessage = "**Discord Bot Commands**\n";

  for (const file of commandFiles) {
    const command     = require(`../../commands/${file}`);
    const commandInfo = command.data.toJSON();

    if (commandInfo.type !== 2 && commandInfo.type !== 3) {
      helpMessage += `\n\`/${commandInfo.name}\`: ${commandInfo.description}`;
    }
  }

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("help-discord-bot-update")
      .setLabel("Discord Bot Help")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("help-commands-update")
      .setLabel("Available Commands".toTitleCase())
      .setStyle(ButtonStyle.Success),
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
