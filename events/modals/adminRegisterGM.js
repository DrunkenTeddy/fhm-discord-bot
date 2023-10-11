const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                                   = require("discord.js");

const adminRegisterGM     = require("../../helpers/adminRegisterGM");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");

const teams = require("../../static_data/teams.json");

module.exports = async (interaction) => {
  const teamAbbr         = interaction.customId.split("-").pop();
  const discordID        = interaction.fields.getTextInputValue("admin-register-gm-id");
  const teamName         = teams.find((team) => team.abbreviation === teamAbbr).name;
  const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);

  // Get user name from Discord ID
  const user = await interaction.client.users.fetch(discordID);

  if (!user) {
    const embed = new EmbedBuilder()
      .setTitle("Invalid Discord ID")
      .setDescription(`The Discord ID ${discordID} is invalid.`);

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("admin-cancel")
          .setLabel("Return to Admin Panel".toTitleCase())
          .setStyle(ButtonStyle.Primary),
      );

    await interaction.update({
      embeds     : [embed],
      components : [buttons],
    });

    return;
  }

  await adminRegisterGM(teamAbbr, discordID);

  // Send confirmation message to user
  user.send(`You are now registered as the GM for ${teamNameWithIcon}.`);

  const discordName = user.username;

  const embed = new EmbedBuilder()
    .setTitle("New GM Successfully Registered")
    .setDescription(`${discordName} is now registered as the new GM for ${teamNameWithIcon}.`);

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("admin-cancel")
        .setLabel("Return to Admin Panel".toTitleCase())
        .setStyle(ButtonStyle.Primary),
    );

  await interaction.update({
    embeds     : [embed],
    components : [buttons],
  });
};
