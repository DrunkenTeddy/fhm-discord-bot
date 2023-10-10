const query = require("./query");

module.exports = async () => {
  const results = await query("SELECT * FROM simulations WHERE Simmed=1 ORDER BY SimID DESC LIMIT 1");

  return results[0];
};
