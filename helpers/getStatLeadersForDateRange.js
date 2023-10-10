const getPlayerInfo = require("./getPlayerInfo");
const query         = require("./query");

module.exports = async (start, end, teamID) => {
  let sql;

  if (teamID) {
    sql = `
    SELECT gameID, period, time, scoring_playerID, assist1_playerID, assist2_playerID, TeamID, goal_notes
    FROM (
      SELECT boxscore_period_scoring_summary.*,
      STR_TO_DATE(CONCAT(Year,'-',Month,'-',Day), '%Y-%m-%d') AS Date
      FROM boxscore_period_scoring_summary
      INNER JOIN boxscore_summary
      ON boxscore_summary.gameID = boxscore_period_scoring_summary.gameID
      INNER JOIN team_data
      ON boxscore_summary.home = team_data.TeamID
      WHERE team_data.LeagueID = 0 AND attendance != 0 AND (boxscore_summary.home = ${teamID} OR boxscore_summary.away = ${teamID})
      HAVING Date BETWEEN "${start}" AND "${end}"
      ORDER BY Year ASC, Month ASC, Day ASC
    ) stats  
  `;
  } else {
    sql = `
    SELECT gameID, period, time, scoring_playerID, assist1_playerID, assist2_playerID, TeamID, goal_notes
    FROM (
      SELECT boxscore_period_scoring_summary.*,
      STR_TO_DATE(CONCAT(Year,'-',Month,'-',Day), '%Y-%m-%d') AS Date
      FROM boxscore_period_scoring_summary
      INNER JOIN boxscore_summary
      ON boxscore_summary.gameID = boxscore_period_scoring_summary.gameID
      INNER JOIN team_data
      ON boxscore_summary.home = team_data.TeamID
      WHERE team_data.LeagueID = 0 AND attendance != 0
      HAVING Date BETWEEN "${start}" AND "${end}"
      ORDER BY Year ASC, Month ASC, Day ASC
    ) stats  
  `;
  }

  const boxscoresStats = await query(sql);

  const playerStats = boxscoresStats.reduce((acc, stat) => {
    const GPlayerID  = stat.scoring_playerID;
    const A1PlayerID = stat.assist1_playerID;
    const A2PlayerID = stat.assist2_playerID;

    if (teamID && parseInt(stat.TeamID, 10) !== parseInt(teamID, 10)) { return acc; }

    if (GPlayerID) {
      if (!acc[GPlayerID]) { acc[GPlayerID] = { G: 0, A: 0, P: 0 }; }
      acc[GPlayerID].G += 1;
      acc[GPlayerID].P += 1;
    }

    if (A1PlayerID) {
      if (!acc[A1PlayerID]) { acc[A1PlayerID] = { G: 0, A: 0, P: 0 }; }
      acc[A1PlayerID].A += 1;
      acc[A1PlayerID].P += 1;
    }

    if (A2PlayerID) {
      if (!acc[A2PlayerID]) { acc[A2PlayerID] = { G: 0, A: 0, P: 0 }; }
      acc[A2PlayerID].A += 1;
      acc[A2PlayerID].P += 1;
    }

    return acc;
  }, {});

  const playerIDs = Object.keys(playerStats);

  const top10GoalLeaders   = [];
  const top10AssistLeaders = [];
  const top10PointLeaders  = [];

  for (let i = 0; i < playerIDs.length; i += 1) {
    const playerID      = playerIDs[i];
    const playerInfo    = await getPlayerInfo({ playerID });
    const playerName    = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
    const playerGoals   = playerStats[playerID].G;
    const playerAssists = playerStats[playerID].A;
    const playerPoints  = playerStats[playerID].P;

    // Check if player has more goals than the current lowest goal scorer
    if (playerGoals > 0) {
      if (top10GoalLeaders.length < 10) {
        top10GoalLeaders.push({
          playerID, playerName, teamID: playerInfo.TeamID, goals: playerStats[playerID].G,
        });
      } else {
        const lowestGoalScorer = top10GoalLeaders.reduce((acc, curr) => {
          if (curr.goals < acc.goals) { return curr; }
          return acc;
        }, { goals: 1000 });

        if (playerStats[playerID].G > lowestGoalScorer.goals) {
          top10GoalLeaders.splice(top10GoalLeaders.indexOf(lowestGoalScorer), 1);
          top10GoalLeaders.push({
            playerID, playerName, teamID: playerInfo.TeamID, goals: playerStats[playerID].G,
          });
        }
      }
    }

    // Check if player has more assists than the current lowest assist scorer
    if (playerAssists > 0) {
      if (top10AssistLeaders.length < 10) {
        top10AssistLeaders.push({
          playerID, playerName, teamID: playerInfo.TeamID, assists: playerStats[playerID].A,
        });
      } else {
        const lowestAssistScorer = top10AssistLeaders.reduce((acc, curr) => {
          if (curr.assists < acc.assists) { return curr; }
          return acc;
        }, { assists: 1000 });

        if (playerStats[playerID].A > lowestAssistScorer.assists) {
          top10AssistLeaders.splice(top10AssistLeaders.indexOf(lowestAssistScorer), 1);
          top10AssistLeaders.push({
            playerID, playerName, teamID: playerInfo.TeamID, assists: playerStats[playerID].A,
          });
        }
      }
    }

    // Check if player has more points than the current lowest point scorer
    if (playerPoints > 0) {
      if (top10PointLeaders.length < 10) {
        top10PointLeaders.push({
          playerID, playerName, teamID: playerInfo.TeamID, points: playerStats[playerID].P,
        });
      } else {
        const lowestPointScorer = top10PointLeaders.reduce((acc, curr) => {
          if (curr.points < acc.points) { return curr; }
          return acc;
        }, { points: 1000 });

        if (playerStats[playerID].P > lowestPointScorer.points) {
          top10PointLeaders.splice(top10PointLeaders.indexOf(lowestPointScorer), 1);
          top10PointLeaders.push({
            playerID, playerName, teamID: playerInfo.TeamID, points: playerStats[playerID].P,
          });
        }
      }
    }
  }

  const goalLeaders   = top10GoalLeaders.sort((a, b) => b.goals - a.goals).slice(0, 10);
  const assistLeaders = top10AssistLeaders.sort((a, b) => b.assists - a.assists).slice(0, 10);
  const pointLeaders  = top10PointLeaders.sort((a, b) => b.points - a.points).slice(0, 10);

  return { goalLeaders, assistLeaders, pointLeaders };
};
