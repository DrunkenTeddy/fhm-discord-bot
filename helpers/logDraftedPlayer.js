const query = require("./query");

module.exports = async (playerID, teamID, draftYear, draftPosition) => {
  const result = await query(`
    INSERT INTO drafted_players (PlayerID, TeamID, DraftYear, DraftPosition)
    VALUES ("${playerID}", "${teamID}", "${draftYear}", "${draftPosition}")
    ON DUPLICATE KEY UPDATE PlayerID="${playerID}", TeamID="${teamID}"
  `);

  return result;
};
