const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

const getAwardVotingElements = require("../../helpers/getAwardVotingElements");
const getAwards              = require("../../helpers/getAwards");

module.exports = async (interaction) => {
  const awards              = await getAwards();
  const teamID              = interaction.customId.split("-")[3];
  const currentAwardId      = interaction.customId.split("-")[4];
  const prevAwardId         = parseInt(currentAwardId, 10) - 1;
  const nextAwardId         = parseInt(currentAwardId, 10) + 1;
  const awardVotingElements = await getAwardVotingElements(interaction, currentAwardId);
  const navigationButtons   = new ActionRowBuilder();

  navigationButtons.addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-voting-next-${teamID}-${prevAwardId > 0 ? prevAwardId : awards.length}`)
      .setLabel("Previous Award")
      .setStyle(ButtonStyle.Secondary),
  );

  navigationButtons.addComponents(
    new ButtonBuilder()
      .setCustomId(`awards-voting-next-${teamID}-${nextAwardId <= awards.length ? nextAwardId : 1}`)
      .setLabel("Next Award")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({
    embeds     : awardVotingElements.embeds,
    components : [...awardVotingElements.components, navigationButtons],
  });
};
