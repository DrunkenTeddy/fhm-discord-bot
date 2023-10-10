const query = require("./query");

module.exports = async (Year, AwardID, PlayerID, DiscordID, TeamID, Votes) => {
  const results = await query(`INSERT INTO award_nominations
  (Year, AwardID, PlayerID, DiscordID, TeamID, Votes)
  VALUES (${Year}, ${AwardID}, ${PlayerID}, ${DiscordID}, ${TeamID}, ${Votes})
  ON DUPLICATE KEY UPDATE Votes=${Votes}`);

  return results;
};
