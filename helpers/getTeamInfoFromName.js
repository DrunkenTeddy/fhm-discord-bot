const query = require("./query");

module.exports = async (name) => {
  const results = await query(`SELECT * FROM team_data WHERE CONCAT(team_data.Name, ' ', team_data.Nickname)='${name}'`);

  if (results.length === 0) {
    return null;
  }

  if (results.length === 1) {
    return results[0];
  }

  return results;
};
