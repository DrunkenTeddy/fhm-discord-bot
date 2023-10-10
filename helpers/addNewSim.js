const query = require("./query");

module.exports = async (start, end, realDate, simmer, notes) => {
  const result = await query(`
    INSERT INTO simulations (DateStart, DateEnd, RealDate, Simmer, Notes)
    VALUES ("${start}", "${end}", "${realDate}", "${simmer}", "${notes}");
  `);

  return result;
};
