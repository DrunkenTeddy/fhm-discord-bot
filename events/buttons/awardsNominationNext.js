const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

const getAwardNominationEmbeds = require("../../helpers/getAwardNominationEmbeds");
const getAwards                = require("../../helpers/getAwards");

module.exports = async (interaction) => {
  const awards            = await getAwards();
  const teamID            = interaction.customId.split("-")[3];
  const currentAwardId    = interaction.customId.split("-")[4];
  const prevAwardId       = parseInt(currentAwardId, 10) - 1;
  const nextAwardId       = parseInt(currentAwardId, 10) + 1;
  const awardEmbeds       = await getAwardNominationEmbeds(interaction, currentAwardId, teamID);
  const teamAwardsID      = [9, 10];
  const actionButtons     = new ActionRowBuilder();
  const navigationButtons = new ActionRowBuilder();

  actionButtons.addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-nomination-open-${teamID}-${currentAwardId}`)
      .setLabel(teamAwardsID.includes(parseInt(currentAwardId, 10)) ? "Nominate Teams" : "Nominate Players")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`awards-nomination-reset-${teamID}-${currentAwardId}`)
      .setLabel("Reset Nomations")
      .setStyle(ButtonStyle.Danger),
  );

  navigationButtons.addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-nomination-next-${teamID}-${prevAwardId > 0 ? prevAwardId : awards.length}`)
      .setLabel("Previous Award")
      .setStyle(ButtonStyle.Secondary),
  );

  navigationButtons.addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-nomination-next-${teamID}-${nextAwardId <= awards.length ? nextAwardId : 1}`)
      .setLabel("Next Award")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds     : awardEmbeds,
    components : [actionButtons, navigationButtons],
  });
};
