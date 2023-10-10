const query = require("./query");

module.exports = async (name) => {
  const results = await query(`SELECT * FROM player_master WHERE CONCAT(LOWER(\`First Name\`), ' ', LOWER(\`Last Name\`))=LOWER('${name}')`);

  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};
