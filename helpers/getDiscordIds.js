const query = require("./query");

module.exports = async () => {
  // Get all GM Discord IDs
  const results = await query("SELECT * FROM gm");

  return results;
};
