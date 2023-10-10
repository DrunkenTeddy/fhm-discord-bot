const query = require("./query");

module.exports = async (Year, AwardID) => {
  const teamAwardsID = [9, 10];
  const teamAward    = teamAwardsID.includes(parseInt(AwardID, 10));

  const results = await query(`
    SELECT ${teamAward ? "DiscordID" : "PlayerID"}, SUM(Votes) AS TotalVotes from award_votes
    WHERE Year=${Year} AND AwardID=${AwardID}
    GROUP BY ${teamAward ? "DiscordID" : "PlayerID"}
    ORDER BY TotalVotes DESC
  `);

  return results;
};
