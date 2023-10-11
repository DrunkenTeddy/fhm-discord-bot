const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

const getTeamInfo              = require("../../helpers/getTeamInfo");
const getAwardNominationEmbeds = require("../../helpers/getAwardNominationEmbeds");
const getAwards                = require("../../helpers/getAwards");

module.exports = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const discordID = interaction.user.id;
  const teamInfo  = await getTeamInfo({ discordID });

  if (!teamInfo) {
    await interaction.reply({
      content   : "You are not currently registered as a GM.",
      ephemeral : true,
    });
    return;
  }

  const awards            = await getAwards();
  const teamID            = teamInfo.TeamID;
  const awardEmbeds       = await getAwardNominationEmbeds(interaction, 1, teamID);
  const actionButtons     = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-nomination-open-${teamID}-1`)
      .setLabel("Nominate Players")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`awards-nomination-reset-${teamID}-1`)
      .setLabel("Reset Nomations")
      .setStyle(ButtonStyle.Danger),
  );
  const navigationButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-nomination-next-${teamID}-${awards.length}`)
      .setLabel("Previous Award")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`awards-nomination-next-${teamID}-2`)
      .setLabel("Next Award")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.editReply({
    embeds     : awardEmbeds,
    components : [actionButtons, navigationButtons],
    ephemeral  : true,
  });
};
