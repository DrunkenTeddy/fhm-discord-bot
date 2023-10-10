const {
  EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder,
} = require("discord.js");

const getLastSimInfo              = require("./getLastSimInfo");
const getStatLeadersForDateRange  = require("./getStatLeadersForDateRange");
const getTeamInfo                 = require("./getTeamInfo");
const getTeamsRecordsForDateRange = require("./getTeamsRecordsForDateRange");

const sortTeamsByPoints = (a, b) => {
  const aPoints = a.wins * 2 + a.otl;
  const bPoints = b.wins * 2 + b.otl;

  // Sort by points
  // If points are equal, sort by the team with the least losses
  if (aPoints === bPoints) {
    return a.losses - b.losses;
  }

  return bPoints - aPoints;
};

async function getSimRecapCardEmbed(interaction) {
  const latestSim                                    = await getLastSimInfo();
  const { goalLeaders, assistLeaders, pointLeaders } = await getStatLeadersForDateRange(latestSim.DateStart, latestSim.DateEnd);
  const teamsRecords                                 = await getTeamsRecordsForDateRange(interaction, latestSim.DateStart, latestSim.DateEnd);
  const sortedTeams                                  = teamsRecords.sort(sortTeamsByPoints);

  let statLeadersString      = "";
  let bestTeamRecordsString  = "";
  let worstTeamRecordsString = "";

  bestTeamRecordsString = await sortedTeams.slice(0, 3).reduce(async (acc, teamRecord) => {
    const teamID   = teamRecord.teamID;
    const teamInfo = await getTeamInfo({ teamID });
    const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

    const string = `**${teamLogo} ${teamName}** (${teamRecord.wins}-${teamRecord.losses}-${teamRecord.otl})\n`;

    return await acc + string;
  }, Promise.resolve(""));

  worstTeamRecordsString = await sortedTeams.slice(-3).reduce(async (acc, teamRecord) => {
    const teamID   = teamRecord.teamID;
    const teamInfo = await getTeamInfo({ teamID });
    const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

    const string = `**${teamLogo} ${teamName}** (${teamRecord.wins}-${teamRecord.losses}-${teamRecord.otl})\n`;

    return await acc + string;
  }, Promise.resolve(""));

  statLeadersString = await goalLeaders.slice(0, 1).reduce(async (acc, player) => {
    const playerName = player.playerName;
    const goals      = player.goals;
    const teamID     = player.teamID;
    const teamInfo   = await getTeamInfo({ teamID });
    const teamName   = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamLogo   = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

    const string = `**G: ${goals}-** ${teamLogo} ${playerName}\n`;

    return await acc + string;
  }, statLeadersString);

  statLeadersString = await assistLeaders.slice(0, 1).reduce(async (acc, player) => {
    const playerName = player.playerName;
    const assists    = player.assists;
    const teamID     = player.teamID;
    const teamInfo   = await getTeamInfo({ teamID });
    const teamName   = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamLogo   = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

    const string = `**A: ${assists}-** ${teamLogo} ${playerName}\n`;

    return await acc + string;
  }, statLeadersString);

  statLeadersString = await pointLeaders.slice(0, 1).reduce(async (acc, player) => {
    const playerName = player.playerName;
    const points     = player.points;
    const teamID     = player.teamID;
    const teamInfo   = await getTeamInfo({ teamID });
    const teamName   = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamLogo   = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

    const string = `**P: ${points}-** ${teamLogo} ${playerName}\n`;

    return await acc + string;
  }, statLeadersString);

  const reportCardEmbed = new EmbedBuilder().setTitle("Simulation Recap".toTitleCase());

  reportCardEmbed.addFields({ name: "Sim Start Date", value: latestSim.DateStart, inline: true });
  reportCardEmbed.addFields({ name: "Sim End Date", value: latestSim.DateEnd, inline: true });
  reportCardEmbed.addFields({ name: "Best Team Records", value: bestTeamRecordsString === "" ? "No games played" : bestTeamRecordsString });
  reportCardEmbed.addFields({ name: "Worst Team Records", value: worstTeamRecordsString === "" ? "No games played" : worstTeamRecordsString });
  reportCardEmbed.addFields({ name: "Stat Leaders", value: statLeadersString === "" ? "No games played" : statLeadersString });

  return reportCardEmbed;
}

module.exports = {
  async getSimRecapCard(interaction) {
    const reportCardEmbed = await getSimRecapCardEmbed(interaction);

    const recordsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sim-recap-summary")
        .setLabel("Sim Summary".toTitleCase())
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("sim-recap-best-teams")
        .setLabel("Best Team Records".toTitleCase())
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("sim-recap-worst-teams")
        .setLabel("Worst Team Records".toTitleCase())
        .setStyle(ButtonStyle.Danger),
    );

    const statsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sim-recap-goals")
        .setLabel("Goal Leaders".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("sim-recap-assists")
        .setLabel("Assist Leaders".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("sim-recap-points")
        .setLabel("Point Leaders".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    const teamButtons = new ActionRowBuilder();

    // Check if original message was ephemeral
    if (interaction.message && interaction.message.flags.has(64)) {
      teamButtons.addComponents(
        new ButtonBuilder()
          .setCustomId("return-gm-hub")
          .setLabel("Back to GM Hub".toTitleCase())
          .setStyle(ButtonStyle.Secondary),
      );
    }

    teamButtons.addComponents(
      new ButtonBuilder()
        .setCustomId("sim-recap-team-report-card")
        .setLabel("View My Team Sim Report Card".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    return {
      embeds     : [reportCardEmbed],
      components : [recordsButtons, statsButtons, teamButtons],
    };
  },

  async getBestTeamRecordsEmbed(interaction) {
    const latestSim    = await getLastSimInfo();
    const teamsRecords = await getTeamsRecordsForDateRange(interaction, latestSim.DateStart, latestSim.DateEnd);
    const sortedTeams  = teamsRecords.sort(sortTeamsByPoints);

    const bestTeamRecordsString = await sortedTeams.slice(0, 16).reduce(async (acc, teamRecord) => {
      const teamID   = teamRecord.teamID;
      const teamInfo = await getTeamInfo({ teamID });
      const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

      const string = `**${teamLogo} ${teamName}** (${teamRecord.wins}-${teamRecord.losses}-${teamRecord.otl})\n`;

      return await acc + string;
    }, Promise.resolve(""));

    return new EmbedBuilder().setTitle("Best Team Records".toTitleCase()).setDescription(bestTeamRecordsString === "" ? "No games played" : bestTeamRecordsString);
  },

  async getWorstTeamRecordsEmbed(interaction) {
    const latestSim    = await getLastSimInfo();
    const teamsRecords = await getTeamsRecordsForDateRange(interaction, latestSim.DateStart, latestSim.DateEnd);
    const sortedTeams  = teamsRecords.sort(sortTeamsByPoints);

    const worstTeamRecordsString = await sortedTeams.slice(-16).reduce(async (acc, teamRecord) => {
      const teamID   = teamRecord.teamID;
      const teamInfo = await getTeamInfo({ teamID });
      const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

      const string = `**${teamLogo} ${teamName}** (${teamRecord.wins}-${teamRecord.losses}-${teamRecord.otl})\n`;

      return await acc + string;
    }, Promise.resolve(""));

    return new EmbedBuilder().setTitle("Worst Team Records".toTitleCase()).setDescription(worstTeamRecordsString === "" ? "No games played" : worstTeamRecordsString);
  },

  async getSimGoalsLeadersEmbed(interaction) {
    const latestSim       = await getLastSimInfo();
    const { goalLeaders } = await getStatLeadersForDateRange(latestSim.DateStart, latestSim.DateEnd);

    const goalsTop10String = await goalLeaders.reduce(async (acc, player) => {
      const playerName = player.playerName;
      const teamID     = player.teamID;
      const goals      = player.goals;
      const teamInfo   = await getTeamInfo({ teamID });
      const teamName   = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo   = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

      const string = `**${goals}- **${teamLogo} ${playerName}\n`;

      return await acc + string;
    }, Promise.resolve(""));

    return new EmbedBuilder().setTitle("Goal Leaders".toTitleCase()).setDescription(goalsTop10String === "" ? "No games played" : goalsTop10String);
  },

  async getSimAssistsLeadersEmbed(interaction) {
    const latestSim         = await getLastSimInfo();
    const { assistLeaders } = await getStatLeadersForDateRange(latestSim.DateStart, latestSim.DateEnd);

    const assistsTop10String = await assistLeaders.reduce(async (acc, player) => {
      const playerName = player.playerName;
      const teamID     = player.teamID;
      const assists    = player.assists;
      const teamInfo   = await getTeamInfo({ teamID });
      const teamName   = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo   = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

      const string = `**${assists}- **${teamLogo} ${playerName}\n`;

      return await acc + string;
    }, Promise.resolve(""));

    return new EmbedBuilder().setTitle("Assist Leaders".toTitleCase()).setDescription(assistsTop10String === "" ? "No games played" : assistsTop10String);
  },

  async getSimPointsLeadersEmbed(interaction) {
    const latestSim        = await getLastSimInfo();
    const { pointLeaders } = await getStatLeadersForDateRange(latestSim.DateStart, latestSim.DateEnd);

    const pointsTop10String = await pointLeaders.reduce(async (acc, player) => {
      const playerName = player.playerName;
      const teamID     = player.teamID;
      const points     = player.points;
      const teamInfo   = await getTeamInfo({ teamID });
      const teamName   = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamLogo   = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

      const string = `**${points}- **${teamLogo} ${playerName}\n`;

      return await acc + string;
    }, Promise.resolve(""));

    return new EmbedBuilder().setTitle("Point Leaders".toTitleCase()).setDescription(pointsTop10String === "" ? "No games played" : pointsTop10String);
  },
};
