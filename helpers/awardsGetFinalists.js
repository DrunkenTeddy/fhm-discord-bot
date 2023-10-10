const query = require("./query");

module.exports = async (Year, AwardID) => {
  const teamAwardsID = [9, 10];
  const teamAward    = teamAwardsID.includes(parseInt(AwardID, 10));

  const results = await query(`
    SELECT ${teamAward ? "DiscordID" : "PlayerID"}, COUNT(Votes) AS TotalVotes from award_nominations
    WHERE Year=${Year} AND AwardID=${AwardID}
    GROUP BY ${teamAward ? "DiscordID" : "PlayerID"}
    ORDER BY TotalVotes DESC, ${teamAward ? "DiscordID" : "PlayerID"} ASC
    LIMIT 5
  `);

  return results.sort((a, b) => {
    if (a.PlayerID && b.PlayerID) { return parseInt(`${a.PlayerID}`.slice(-2), 10) - parseInt(`${b.PlayerID}`.slice(-2), 10); }
    if (a.DiscordID && b.DiscordID) { return parseInt(`${a.DiscordID}`.slice(-2), 10) - parseInt(`${b.DiscordID}`.slice(-2), 10); }
    return 0;
  });
};
