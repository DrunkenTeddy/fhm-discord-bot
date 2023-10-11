const query = require("./query");

module.exports = async (TeamID, PlayerID) => {
  const result = await query(`
    INSERT INTO trade_block (TeamID, PlayerID, Available)
    VALUES (${TeamID}, ${PlayerID}, 0)
    ON DUPLICATE KEY UPDATE    
    Available=0;
  `);

  return result;
};
