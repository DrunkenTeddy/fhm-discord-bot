const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const insiders = require("../static_data/insiders.json");
const teams    = require("../static_data/teams.json");

const getBoxscoresForDateRange = require("../helpers/getBoxscoresForDateRange");
const getInjuriesForDate       = require("../helpers/getInjuriesForDate");
const getSuspensionsForDate    = require("../helpers/getSuspensionsForDate");
const getTeamInfo              = require("../helpers/getTeamInfo");
const getTeamNameWithIcon      = require("../helpers/getTeamNameWithIcon");
const updateSimDates           = require("../helpers/updateSimDates");
const validateDates            = require("../helpers/validateDates");
const sendSimRecapNotification = require("../helpers/sendSimRecapNotification");

const { sendInsiderInfo } = require("./insider");
const { getSimRecapCard } = require("../helpers/getSimRecapCard");
const showStandings       = require("../helpers/showStandings");

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
  data: new SlashCommandBuilder()
    .setName("simresults")
    .setDescription("Post the results of a simulated week.")
    .addStringOption((option) => option.setName("start")
      .setDescription("Start date of the simulated week (YYYY-MM-DD).")
      .setRequired(true))
    .addStringOption((option) => option.setName("end")
      .setDescription("End date of the simulated week (YYYY-MM-DD).")
      .setRequired(true)),

  async execute(interaction) {
    const start = interaction.options.getString("start");
    const end   = interaction.options.getString("end");

    await this.processSim(interaction, start, end);
  },

  async processSim(interaction, start, end) {
    const datesValid = await validateDates(start, end);

    if (datesValid) {
      await interaction.deferReply({ ephemeral: true });

      const boxscores = await getBoxscoresForDateRange(start, end);
      const dates     = Object.keys(boxscores);

      for (let i = 0; i < dates.length; i += 1) {
        const date          = dates[i];
        const dateYear      = parseInt(date.split("-")[0], 10).pad(4);
        const dateMonth     = parseInt(date.split("-")[1], 10).pad(2);
        const dateDay       = parseInt(date.split("-")[2], 10).pad(2);
        const dateFormatted = `${dateYear}-${dateMonth}-${dateDay}`;
        const games         = boxscores[date];

        if (games !== null) {
          const dayEmbed = new EmbedBuilder()
            .setTitle(`Games for ${dateFormatted}`.toTitleCase());

          const injuries    = await getInjuriesForDate(dateFormatted);
          const suspensions = await getSuspensionsForDate(dateFormatted);

          for (let j = 0; j < games.length; j += 1) {
            const game             = games[j];
            const homeTeamID       = game.home;
            const awayTeamID       = game.away;
            const homeTeam         = await getTeamInfo({ teamID: homeTeamID });
            const awayTeam         = await getTeamInfo({ teamID: awayTeamID });
            const homeTeamName     = getTeamNameWithIcon(`${homeTeam.Name} ${homeTeam.Nickname}`, interaction.client.emojis.cache);
            const awayTeamName     = getTeamNameWithIcon(`${awayTeam.Name} ${awayTeam.Nickname}`, interaction.client.emojis.cache);
            const homeTeamCity     = homeTeam.Name;
            const awayTeamCity     = awayTeam.Name;
            const homeTeamNickname = homeTeam.Nickname;
            const awayTeamNickname = awayTeam.Nickname;
            const homeScore        = game.score_home;
            const awayScore        = game.score_away;
            const winner           = homeScore > awayScore ? homeTeamName : awayTeamName;
            const winnerNickname   = homeScore > awayScore ? homeTeamNickname : awayTeamNickname;
            const winnerCity       = homeScore > awayScore ? homeTeamCity : awayTeamCity;
            const winnerScore      = homeScore > awayScore ? homeScore : awayScore;
            const loser            = homeScore > awayScore ? awayTeamName : homeTeamName;
            const loserNickname    = homeScore > awayScore ? awayTeamNickname : homeTeamNickname;
            const loserCity        = homeScore > awayScore ? awayTeamCity : homeTeamCity;
            const loserScore       = homeScore > awayScore ? awayScore : homeScore;
            const goalDifferential = Math.abs(homeScore - awayScore);
            const isOT             = game.score_home_OT > 0 || game.score_away_OT;
            const isSO             = game.score_home_SO > 0 || game.score_away_SO;

            if (goalDifferential > 5) {
              const goalDifferentialStrings = [
                "Tonight's game between the (Winner) and (Loser) was a complete blowout. The (WinnerNickname) scored (WinnerScore) goals in a (WinnerScore) to (LoserScore) win.",
                "The fans in (WinnerCity) are gonna be talking about this one for a while. The (WinnerNickname) scored (WinnerScore) goals in a (WinnerScore)-(LoserScore) win over the (LoserNickname).",
                "Tonight's game between the (Winner) and (Loser) will be remembered for a long time. The (WinnerNickname) scored an impressive (WinnerScore) goals against the (LoserNickname) in a decisive (WinnerScore)-(LoserScore) win.",
                "The (WinnerNickname) could not be stopped tonight. They scored an impressive (WinnerScore) goals against the (LoserNickname) in a (WinnerScore)-(LoserScore) win.",
                "The (WinnerNickname) were on fire tonight. That (WinnerScore)-(LoserScore) scoreline doesn't even begin to tell the story of how dominant they were.",
                "The (WinnerNickname) were unstoppable tonight. That (WinnerScore)-(LoserScore) victory was a complete blowout.",
                "The (LoserNickname) had no chance tonight against the (WinnerNickname). The final score was (WinnerScore)-(LoserScore) in favor of the (Winner).",
                "It was a one-sided game between the (Winner) and the (Loser) tonight. The (WinnerNickname) dominated with a final score of (WinnerScore)-(LoserScore).",
                "The (WinnerNickname) had a field day against the (LoserNickname) tonight. The final score was an impressive (WinnerScore)-(LoserScore) in favor of the (Winner).",
                "The (LoserNickname) couldn't keep up with the (WinnerNickname) tonight. The final score was (WinnerScore)-(LoserScore) in favor of the (Winner).",
                "It was a tough night for the (LoserNickname) as they were defeated by the (WinnerNickname) with a final score of (WinnerScore)-(LoserScore).",
                "The (WinnerNickname) had a historic night as they defeated the (LoserNickname) by a score of (WinnerScore)-(LoserScore).",
                "The (Winner) put on a clinic tonight against the (Loser), as they won with a final score of (WinnerScore)-(LoserScore).",
                "The fans in (WinnerCity) are ecstatic as their team, the (WinnerNickname), defeated the (LoserNickname) by a score of (WinnerScore)-(LoserScore).",
                "The fans in (WinnerCity) witnessed a dominant performance by the (WinnerNickname) as they defeated the (LoserNickname) by a score of (WinnerScore)-(LoserScore).",
                "It was a difficult night for the fans in (LoserCity) as their team, the (LoserNickname), were defeated by the (WinnerNickname) by a score of (WinnerScore)-(LoserScore).",
                "The (WinnerNickname) put on an impressive show for the fans in (WinnerCity), as they defeated the (LoserNickname) by a score of (WinnerScore)-(LoserScore).",
                "The fans in (LoserCity) were left disappointed as the (LoserNickname) were defeated by the (WinnerNickname) by a score of (WinnerScore)-(LoserScore).",
                "The (WinnerNickname) delivered a victory for the fans in (WinnerCity), as they defeated the (LoserNickname) by a score of (WinnerScore)-(LoserScore).",
                "The (WinnerNickname) dominated tonight, scoring (WinnerScore) goals while only allowing (LoserScore) to the (LoserNickname).",
                "The (WinnerNickname) had a historic night, putting up (WinnerScore) goals against the (LoserNickname) who only scored (LoserScore).",
                "The (WinnerNickname) offense was on fire, scoring (WinnerScore) goals and shutting out the (LoserNickname) who only scored (LoserScore).",
              ];

              const goalDifferentialString = goalDifferentialStrings[Math.floor(Math.random() * goalDifferentialStrings.length)]
                .replaceAll("(Winner)", winner)
                .replaceAll("(Loser)", loser)
                .replaceAll("(WinnerNickname)", winnerNickname)
                .replaceAll("(LoserNickname)", loserNickname)
                .replaceAll("(WinnerCity)", winnerCity)
                .replaceAll("(LoserCity)", loserCity)
                .replaceAll("(GoalDifferential)", goalDifferential)
                .replaceAll("(WinnerScore)", winnerScore)
                .replaceAll("(LoserScore)", loserScore);

              await sendInsiderInfo(interaction, insiders[Math.floor(Math.random() * insiders.length)].name, goalDifferentialString);
            }

            let score = `┌ ${winner} (${winnerScore})`;

            if (isOT) { score += " (OT)"; }
            if (isSO) { score += " (SO)"; }

            dayEmbed.addFields({ name: score, value: `└ ${loser} (${loserScore})` });
          }

          if (injuries.length > 0) {
            const injuryString = injuries.map((injury) => getInjuryString(interaction, injury)).join("\n");
            dayEmbed.addFields({ name: "Injuries", value: injuryString });
          }

          if (suspensions.length > 0) {
            const suspensionString = suspensions.map((suspension) => getSuspensionString(interaction, suspension)).join("\n");
            dayEmbed.addFields({ name: "Suspensions", value: suspensionString });
          }

          const channel = interaction.client.channels.cache.find((c) => c.name === "results");
          await channel.send({ embeds: [dayEmbed] });
        } else {
          await interaction.reply({
            content   : "No games were played during this period.",
            ephemeral : true,
          });
        }
      }

      await updateSimDates(start, end);
      await showStandings(interaction, true);

      // Send Sim Recap
      const { embeds, components } = await getSimRecapCard(interaction);
      const channel                = interaction.client.channels.cache.find((c) => c.name === "sim-discussion");
      await channel.send({ embeds, components });

      // Send Sim Recap notifications asynchronously
      sendSimRecapNotification(interaction);

      await interaction.editReply({
        content   : "Sim results posted.",
        ephemeral : true,
      });
    } else {
      await interaction.reply({
        content   : "Invalid dates.",
        ephemeral : true,
      });
    }
  },
};
