const { ActionRowBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");

const teams   = require("../static_data/teams.json");
const ratings = require("../static_data/ratings.json");

const getNumberTradeBlockPlayers = require("./getNumberTradeBlockPlayers");
const getTeamInfo                = require("./getTeamInfo");

module.exports = async (interaction) => {
  // Group teams by conference
  const teamsByConference = teams.reduce((acc, team) => {
    const conference = team.conference;

    if (!acc[conference]) {
      acc[conference] = [];
    }

    acc[conference].push(team);

    return acc;
  }, {});

  const searchByConference = await Object.entries(teamsByConference).reduce(async (searchMenusAcc, [conference, conferenceTeams], index) => {
    const options = await conferenceTeams.reduce(async (optionsAcc, team) => {
      const teamInfo                = await getTeamInfo({ teamName: team.name });
      const teamID                  = teamInfo.TeamID;
      const numberTradeBlockPlayers = await getNumberTradeBlockPlayers(teamID);

      return [...(await optionsAcc), {
        label       : team.name,
        description : `${numberTradeBlockPlayers} player${numberTradeBlockPlayers > 1 ? "s" : ""} on the trade block`,
        value       : team.abbreviation,
        emoji       : { id: interaction.client.emojis.cache.find((emoji) => emoji.name === team.name.replaceAll(" ", "").replaceAll(".", "").toLowerCase()).id },
      }];
    }, []);

    const searchMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`trade-block-open-${index}`)
        .setPlaceholder(`Search players by ${conference} Conference teams`.toTitleCase())
        .addOptions(options),
    );

    return [searchMenu, ...(await searchMenusAcc)];
  }, []);

  const searchByPosition = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("trade-block-position")
      .setPlaceholder("Search players by Position".toTitleCase())
      .addOptions(["C", "LW", "RW", "LD", "RD", "G"].map((position) => ({ label: position, value: position }))),
  );

  const technicalRatings      = ratings.filter((rating) => rating.type === "technical");
  const physicalMentalRatings = ratings.filter((rating) => rating.type === "physical" || rating.type === "mental");

  technicalRatings.sort((a, b) => a.name.localeCompare(b.name));
  physicalMentalRatings.sort((a, b) => a.name.localeCompare(b.name));

  const searchByTechnicalRating = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("trade-block-technical-rating")
      .setPlaceholder("Search players by Technical Rating".toTitleCase())
      .addOptions(technicalRatings.map((rating) => ({ label: rating.name, value: rating.value }))),
  );

  const searchByPhysicalMentalRating = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("trade-block-physical-mental-rating")
      .setPlaceholder("Search players by Physical or Mental Rating".toTitleCase())
      .addOptions(physicalMentalRatings.map((rating) => ({ label: rating.name, value: rating.value }))),
  );

  return [...searchByConference, searchByPosition, searchByTechnicalRating, searchByPhysicalMentalRating];
};
