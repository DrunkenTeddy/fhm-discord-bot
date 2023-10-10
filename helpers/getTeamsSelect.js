const { ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");

const teams = require("../static_data/teams.json");

module.exports = async (interaction, prefix, multiple = false, selectedTeams = []) => {
  const teamsByConference = teams.reduce((acc, team) => {
    const conference = team.conference;

    if (!acc[conference]) {
      acc[conference] = [];
    }

    acc[conference].push(team);

    return acc;
  }, {});

  const teamsSelect = await Object.entries(teamsByConference).reduce(async (searchMenusAcc, [conference, conferenceTeams], index) => {
    const options = await conferenceTeams.reduce(async (optionsAcc, team) => [...(await optionsAcc), {
      label   : team.name,
      value   : team.abbreviation,
      default : selectedTeams.includes(team.abbreviation),
      emoji   : { id: interaction.client.emojis.cache.find((emoji) => emoji.name === team.name.replaceAll(" ", "").replaceAll(".", "").toLowerCase()).id },
    }], []);

    const searchMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${prefix}-${index}`)
        .setPlaceholder(`${conference} Conference Teams`.toTitleCase())
        .setMinValues(1)
        .setMaxValues(multiple ? 3 : 1)
        .addOptions(options),
    );

    return [searchMenu, ...(await searchMenusAcc)];
  }, []);

  return teamsSelect;
};
