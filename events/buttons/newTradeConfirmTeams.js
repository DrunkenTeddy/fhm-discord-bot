const {
  ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle,
} = require("discord.js");

const teams = require("../../static_data/teams.json");

module.exports = async (interaction) => {
  const easternTeamsSelect = interaction.message.components[0].components[0];
  const westernTeamsSelect = interaction.message.components[1].components[0];

  const selectedTeams = [
    ...easternTeamsSelect.options.filter((option) => option.default).map((option) => option.value),
    ...westernTeamsSelect.options.filter((option) => option.default).map((option) => option.value),
  ].map((team) => {
    const teamData = teams.find((data) => data.abbreviation === team);

    return {
      name         : teamData.name,
      abbreviation : teamData.abbreviation,
    };
  });

  let getInputLabel = () => "";

  let customId     = "new-trade-offer";
  const components = [];

  if (selectedTeams.length > 3) {
    await interaction.update({
      content   : "<:exclamation:1063626317964251147> **You can only select up to 3 teams.**",
      ephemeral : true,
    });
    return;
  } if (selectedTeams.length === 3) {
    getInputLabel = (teamName) => `${teamName} receives (1 per line):`;
  } else {
    getInputLabel = (teamName) => `${teamName} sends (1 per line):`;
  }

  selectedTeams.map((selectedTeam) => {
    const teamName  = selectedTeam.name;
    const teamIndex = teams.findIndex((team) => team.name === teamName);
    const input     = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(`trade-offer-team-${teamIndex}`)
        .setLabel(getInputLabel(teamName))
        .setStyle(TextInputStyle.Paragraph),
    );

    customId += `-${teamIndex}`;
    components.push(input);

    return input;
  });

  const modal = new ModalBuilder()
    .setCustomId(customId)
    .setTitle("Trade");

  modal.addComponents(...components);

  await interaction.showModal(modal);
};
