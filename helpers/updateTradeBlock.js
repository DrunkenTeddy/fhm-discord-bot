const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("@discordjs/builders");
const { TextInputStyle }                                   = require("discord.js");

const getTeamInfo        = require("./getTeamInfo");
const getTradePreference = require("./getTradePreference");

module.exports = async (interaction, teamName) => {
  const teamInfo         = await getTeamInfo({ teamName });
  const teamID           = teamInfo.TeamID;
  const tradePreferences = await getTradePreference({ teamID });
  const customId         = `trade-block-modal-${teamID}`;

  const modal = new ModalBuilder()
    .setCustomId(customId)
    .setTitle(`${teamName} Trade Block`.toTitleCase());

  const teamNeeds = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("team-needs")
      .setLabel("Team Needs:")
      .setValue((tradePreferences && tradePreferences.TeamNeeds) || "")
      .setMaxLength(255)
      .setStyle(TextInputStyle.Paragraph),
  );

  modal.addComponents(teamNeeds);

  await interaction.showModal(modal);
};
