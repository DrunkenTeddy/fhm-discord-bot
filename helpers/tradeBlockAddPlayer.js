const query = require("./query");

module.exports = async (TeamID, PlayerID, Info) => {
  let sql = "";

  if (Info && Info !== null) {
    sql = `
    INSERT INTO trade_block (TeamID, PlayerID, Info)
    VALUES (${TeamID}, ${PlayerID}, "${Info}")
    ON DUPLICATE KEY UPDATE    
    Info="${Info}";
  `;
  } else {
    sql = `INSERT INTO trade_block (TeamID, PlayerID) VALUES (${TeamID}, ${PlayerID}) ON DUPLICATE KEY UPDATE PlayerID="${PlayerID}";`;
  }

  const result = await query(sql);

  return result;
};
