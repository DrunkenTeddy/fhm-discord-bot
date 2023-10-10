const query = require("./query");

module.exports = async () => {
  const results = await query("SELECT DateEnd AS Date FROM simulations WHERE Simmed=1 ORDER BY SimID DESC LIMIT 1");

  return results[0].Date;
};
