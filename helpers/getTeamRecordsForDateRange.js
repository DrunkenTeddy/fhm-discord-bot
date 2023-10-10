const getTeamInfo         = require("./getTeamInfo");
const getTeamNameWithIcon = require("./getTeamNameWithIcon");
const query               = require("./query");

module.exports = async (interaction, start, end) => {
  const boxscores = await query(`
    SELECT gameID,
    home_data.TeamID AS homeID,
    away_data.TeamID AS awayID,
    score_home,
    score_away,
    score_home_OT,
    score_home_SO,
    score_away_OT,
    score_away_OT,
    STR_TO_DATE(CONCAT(Year,'-',Month,'-',Day), '%Y-%m-%d') AS Date
    FROM boxscore_summary
    INNER JOIN team_data AS home_data
    ON boxscore_summary.home = home_data.TeamID
    INNER JOIN team_data AS away_data
    ON boxscore_summary.away = away_data.TeamID
    WHERE home_data.LeagueID = 0 AND attendance != 0
    HAVING Date BETWEEN "${start}" AND "${end}"
    ORDER BY Year ASC, Month ASC, Day ASC;
  `);

  const isOT = (boxscore) => boxscore.score_home_OT > 0 || boxscore.score_away_OT || boxscore.score_home_SO > 0 || boxscore.score_away_SO;

  const teamRecords = await boxscores.reduce(async (acc, game) => {
    const records = await acc;

    const homeTeamID   = game.homeID;
    const awayTeamID   = game.awayID;
    const homeScore    = game.score_home;
    const awayScore    = game.score_away;
    const homeTeam     = await getTeamInfo({ teamID: homeTeamID });
    const awayTeam     = await getTeamInfo({ teamID: awayTeamID });
    const homeTeamName = getTeamNameWithIcon(`${homeTeam.Name} ${homeTeam.Nickname}`, interaction.client.emojis.cache);
    const awayTeamName = getTeamNameWithIcon(`${awayTeam.Name} ${awayTeam.Nickname}`, interaction.client.emojis.cache);
    const isOTL        = isOT(game);

    if (!records[homeTeamID]) {
      records[homeTeamID] = {
        teamID   : homeTeamID,
        teamName : homeTeamName,
        wins     : 0,
        losses   : 0,
        otl      : 0,
      };
    }

    if (!records[awayTeamID]) {
      records[awayTeamID] = {
        teamID   : awayTeamID,
        teamName : awayTeamName,
        wins     : 0,
        losses   : 0,
        otl      : 0,
      };
    }

    if (homeScore > awayScore) {
      records[homeTeamID].wins += 1;

      if (isOTL) {
        records[awayTeamID].otl += 1;
      } else {
        records[awayTeamID].losses += 1;
      }
    } else {
      records[awayTeamID].wins += 1;

      if (isOTL) {
        records[homeTeamID].otl += 1;
      } else {
        records[homeTeamID].losses += 1;
      }
    }

    return records;
  }, Promise.resolve({}));

  return Object.values(teamRecords);
};
