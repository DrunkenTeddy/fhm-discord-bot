const query = require("./query");

module.exports = async () => {
  const results = await query("SELECT * FROM simulations WHERE Simmed=0");

  if (results.length === 0) {
    return null;
  }

  return results;
};
