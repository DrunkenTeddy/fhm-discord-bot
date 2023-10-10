const query = require("./query");

module.exports = async () => {
  const results = await query("SELECT * FROM simulations ORDER BY SimID DESC LIMIT 1;");

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
