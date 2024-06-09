const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle }                     = require("discord.js");

const { getTeamSimReportCard } = require("../../commands/simreportcard");

const getTeamInfo = require("../../helpers/getTeamInfo");

module.exports = async (interaction) => {
  const teamID   = interaction.customId.split("-")[3];
  const teamInfo = await getTeamInfo({ teamID });
  const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;

  const tradeBlockEmbed = await getTeamSimReportCard(interaction, teamName);

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`sim-report-open-full-${teamID}`)
      .setLabel("Show Full Sim Report Card".toTitleCase())
      .setStyle(ButtonStyle.Primary),
  );

  const channel = interaction.client.channels.cache.find((c) => c.name === "league-discussion");
  await channel.send({
    embeds     : [tradeBlockEmbed],
    components : [buttons],
  });

  await interaction.reply({
    content   : "Sim Report Card shared.",
    ephemeral : true,
  });
};
