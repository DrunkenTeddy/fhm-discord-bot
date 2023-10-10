const query = require("./query");

module.exports = async (simID, start, end, realDate, simmer, notes) => {
  const result = await query(`
    UPDATE simulations
    SET DateStart = "${start}",
        DateEnd   = "${end}",
        RealDate  = "${realDate}",
        Simmer    = "${simmer}",
        Notes     = "${notes}"
    WHERE SimID = ${simID};
  `);

  return result;
};
