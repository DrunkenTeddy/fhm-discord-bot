const query = require("./query");

module.exports = async (start, end, teamID) => {
  const boxscores = await query(`
      SELECT *, STR_TO_DATE(CONCAT(Year,'-',Month,'-',Day), '%Y-%m-%d') as Date FROM boxscore_summary
      INNER JOIN team_data
      ON boxscore_summary.home = team_data.TeamID
      WHERE team_data.LeagueID = 0 AND attendance != 0 AND (boxscore_summary.home = ${teamID} OR boxscore_summary.away = ${teamID})
      HAVING Date BETWEEN "${start}" AND "${end}"
      ORDER BY Year ASC, Month ASC, Day ASC;
    `);

  // Group boxscores by date
  const boxscoresByDate = boxscores.reduce((acc, boxscore) => {
    const boxscoreDate = `${boxscore.Year}-${boxscore.Month}-${boxscore.Day}`;

    if (!acc[boxscoreDate]) {
      acc[boxscoreDate] = [];
    }

    acc[boxscoreDate].push(boxscore);

    return acc;
  }, {});

  return boxscoresByDate;
};
