const query = require("./query");

module.exports = (Year, AwardID, PlayerID, DiscordID, TeamID) => {
  let sql = `INSERT INTO award_votes
  (Year, AwardID, PlayerID, TeamID, Votes)
  VALUES (${Year}, ${AwardID}, ${PlayerID}, ${TeamID}, 1)
  ON DUPLICATE KEY UPDATE PlayerID=${PlayerID}`;

  if (DiscordID) {
    sql = `INSERT INTO award_votes
    (Year, AwardID, DiscordID, TeamID, Votes)
    VALUES (${Year}, ${AwardID}, ${DiscordID}, ${TeamID}, 1)
    ON DUPLICATE KEY UPDATE DiscordID=${DiscordID}`;
  }

  return query(sql);
};
