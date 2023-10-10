const { EmbedBuilder } = require("discord.js");

const getInjuriesForDate           = require("./getInjuriesForDate");
const getLastSimInfo               = require("./getLastSimInfo");
const getSuspensionsForDate        = require("./getSuspensionsForDate");
const getTeamBoxscoresForDateRange = require("./getTeamBoxscoresForDateRange");
const getTeamInfo                  = require("./getTeamInfo");
const getTeamNameWithIcon          = require("./getTeamNameWithIcon");

const teams = require("../static_data/teams.json");

const getInjuryString = (interaction, injury) => {
  const teamName         = teams.find((team) => team.abbreviation === injury.TeamAbbreviation).name;
  const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);

  return `${teamNameWithIcon} - ${injury.PlayerName} - ${injury.Duration}`;
};

const getSuspensionString = (interaction, suspension) => {
  const teamName         = teams.find((team) => team.abbreviation === suspension.TeamAbbreviation).name;
  const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);

  return `${teamNameWithIcon} - ${suspension.PlayerName} - ${suspension.Duration} games`;
};

module.exports = {
  async getTeamSimReportCard(interaction, teamName, showFullReport = false) {
    const teamInfo         = await getTeamInfo({ teamName });
    const teamID           = teamInfo.TeamID;
    const latestSim        = await getLastSimInfo();
    const boxscores        = await getTeamBoxscoresForDateRange(latestSim.DateStart, latestSim.DateEnd, teamID);
    const dates            = Object.keys(boxscores);
    const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
    const reportCardEmbed  = new EmbedBuilder()
      .setTitle("Simulation Report Card".toTitleCase())
      .setColor(teamInfo.PrimaryColor)
      .setDescription(teamNameWithIcon);

    const isOT        = (boxscore) => boxscore.score_home_OT > 0 || boxscore.score_away_OT || boxscore.score_home_SO > 0 || boxscore.score_away_SO;
    let wins          = 0;
    let rsLosses      = 0;
    let otLosses      = 0;
    const gamesEmbeds = [];
    const injuries    = [];
    const suspensions = [];

    for (let i = 0; i < dates.length; i += 1) {
      const date          = dates[i];
      const dateYear      = parseInt(date.split("-")[0], 10).pad(4);
      const dateMonth     = parseInt(date.split("-")[1], 10).pad(2);
      const dateDay       = parseInt(date.split("-")[2], 10).pad(2);
      const dateFormatted = `${dateYear}-${dateMonth}-${dateDay}`;
      const games         = boxscores[date];

      if (games !== null) {
        if (showFullReport) {
          const dayInjuries    = await getInjuriesForDate(dateFormatted);
          const daySuspensions = await getSuspensionsForDate(dateFormatted);

          for (let j = 0; j < dayInjuries.length; j += 1) {
            const injury         = dayInjuries[j];
            const injuryTeamName = teams.find((team) => team.abbreviation === injury.TeamAbbreviation).name;

            if (teamName === injuryTeamName) {
              injuries.push(injury);
            }
          }

          for (let s = 0; s < daySuspensions.length; s += 1) {
            const suspension         = daySuspensions[s];
            const suspensionTeamName = teams.find((team) => team.abbreviation === suspension.TeamAbbreviation).name;

            if (teamName === suspensionTeamName) {
              suspensions.push(suspension);
            }
          }
        }

        for (let g = 0; g < games.length; g += 1) {
          const game         = games[g];
          const homeTeamID   = game.home;
          const awayTeamID   = game.away;
          const homeTeam     = await getTeamInfo({ teamID: homeTeamID });
          const awayTeam     = await getTeamInfo({ teamID: awayTeamID });
          const homeTeamName = getTeamNameWithIcon(`${homeTeam.Name} ${homeTeam.Nickname}`, interaction.client.emojis.cache);
          const awayTeamName = getTeamNameWithIcon(`${awayTeam.Name} ${awayTeam.Nickname}`, interaction.client.emojis.cache);
          const homeScore    = game.score_home;
          const awayScore    = game.score_away;
          const winner       = homeScore > awayScore ? homeTeamName : awayTeamName;
          const winnerScore  = homeScore > awayScore ? homeScore : awayScore;
          const loser        = homeScore > awayScore ? awayTeamName : homeTeamName;
          const loserScore   = homeScore > awayScore ? awayScore : homeScore;
          const isOTL        = isOT(game) && winner !== teamNameWithIcon;
          const ot           = game.score_home_OT > 0 || game.score_away_OT;
          const so           = game.score_home_SO > 0 || game.score_away_SO;

          if (winner === teamNameWithIcon) {
            wins += 1;
          } else if (isOTL) {
            otLosses += 1;
          } else {
            rsLosses += 1;
          }

          let score = `┌ ${winner} (${winnerScore})`;

          if (ot) { score += " (OT)"; }
          if (so) { score += " (SO)"; }

          gamesEmbeds.push({ name: score, value: `└ ${loser} (${loserScore})` });
        }
      } else {
        await interaction.editReply({
          content   : "No games were played during this period.",
          ephemeral : true,
        });
      }
    }

    reportCardEmbed.addFields({ name: "Sim Start Date", value: latestSim.DateStart, inline: true });
    reportCardEmbed.addFields({ name: "Sim End Date", value: latestSim.DateEnd, inline: true });
    reportCardEmbed.addFields({ name: "Record", value: `${wins}-${rsLosses}-${otLosses}` });

    if (showFullReport) {
      for (let i = 0; i < gamesEmbeds.length; i += 1) {
        reportCardEmbed.addFields({ name: gamesEmbeds[i].name, value: gamesEmbeds[i].value });
      }

      if (injuries.length > 0) {
        const injuryString = injuries.map((injury) => getInjuryString(interaction, injury)).join("\n");
        reportCardEmbed.addFields({ name: "Injuries", value: injuryString });
      }

      if (suspensions.length > 0) {
        const suspensionString = suspensions.map((suspension) => getSuspensionString(interaction, suspension)).join("\n");
        reportCardEmbed.addFields({ name: "Suspensions", value: suspensionString });
      }
    }

    return reportCardEmbed;
  },
};
