const query = require("./query");

module.exports = async (teamID, TeamNeeds) => {
  const result = await query(`
    INSERT INTO trade_preference (TeamID, TeamNeeds)
    VALUES (${teamID}, "${TeamNeeds}")
    ON DUPLICATE KEY UPDATE    
    TeamNeeds="${TeamNeeds}";
  `);

  return result;
};
