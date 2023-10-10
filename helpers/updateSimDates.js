const query = require("./query");

module.exports = async (start, end) => {
  const now           = new Date();
  const year          = now.getFullYear();
  const month         = (`0${now.getMonth() + 1}`).slice(-2);
  const day           = (`0${now.getDate()}`).slice(-2);
  const formattedDate = `${year}-${month}-${day} 04:00`;

  const result = await query(`
    UPDATE simulations SET Simmed=1, RealDate="${formattedDate}" WHERE DateStart="${start}" AND DateEnd="${end}";
  `);

  return result;
};
