const query = require("./query");

module.exports = async (simID) => {
  const results = await query(`SELECT * FROM simulations WHERE SimID = ${simID};`);

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
