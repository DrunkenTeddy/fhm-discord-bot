const query = require("./query");

module.exports = async (awardID) => {
  const results = await query(`SELECT * FROM awards WHERE ID=${awardID}`);

  return results[0];
};
