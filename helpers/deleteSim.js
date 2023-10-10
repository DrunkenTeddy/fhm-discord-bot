const query = require("./query");

module.exports = async (simID) => {
  const result = await query(`DELETE FROM simulations WHERE SimID = ${simID};`);

  return result;
};
