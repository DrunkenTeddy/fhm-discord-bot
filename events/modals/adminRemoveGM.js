const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

const adminRemoveGM = require("../../helpers/adminRemoveGM");
const getDiscordIds = require("../helpers/getDiscordIds");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");

const teams = require("../../static_data/teams.json");

module.exports = async (interaction) => {
  const teamAbbr = interaction.customId.split("-").pop();
  const teamName = teams.find((team) => team.abbreviation === teamAbbr).name;
  const teamNameWithIcon = getTeamNameWithIcon(
    teamName,
    interaction.client.emojis.cache,
  );

  // Get user name from Discord ID
  // const user = await interaction.client.users.fetch(discordID);

  // if (!user) {
  //   const embed = new EmbedBuilder()
  //     .setTitle("Invalid Discord ID")
  //     .setDescription(`The Discord ID ${discordID} is invalid.`);

  //   const buttons = new ActionRowBuilder().addComponents(
  //     new ButtonBuilder()
  //       .setCustomId("admin-cancel")
  //       .setLabel("Return to Admin Panel".toTitleCase())
  //       .setStyle(ButtonStyle.Primary),
  //   );

  //   await interaction.update({
  //     embeds: [embed],
  //     components: [buttons],
  //   });

  //   return;
  // }

  await adminRemoveGM(teamAbbr);

  // Send message to user
  const gm = await getDiscordIds().find((info) => info.Abbr === teamAbbr);
  let discordName = "Unknown User";
  if (gm && gm.DiscordID) {
    const user = await interaction.client.users.fetch(gm.DiscordID);
    user.send(`You are no longer the GM for ${teamNameWithIcon}.`);
    discordName = user.DiscordName;
  }

  const embed = new EmbedBuilder()
    .setTitle("GM Successfully Removed")
    .setDescription(
      `${discordName} is no longer registered as the GM for ${teamNameWithIcon}.`,
    );

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("admin-cancel")
      .setLabel("Return to Admin Panel".toTitleCase())
      .setStyle(ButtonStyle.Primary),
  );

  await interaction.update({
    embeds: [embed],
    components: [buttons],
  });
};
