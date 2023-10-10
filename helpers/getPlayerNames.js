const getTeamInfo = require("./getTeamInfo");
const query       = require("./query");

module.exports = async (searchValue, info = {}) => {
  const search   = searchValue.toLowerCase();
  const teamName = info.teamName;
  const teamID   = info.teamID;

  let sql = `
    SELECT \`First Name\`, \`Last Name\`
    FROM player_master
    WHERE CONCAT(LOWER(\`First Name\`), ' ', LOWER(\`Last Name\`)) LIKE '%${search.replace(/'/g, "\\'")}%' AND Retired=0
  `;

  if (teamID !== undefined && teamID !== "") {
    sql += `AND TeamID='${teamID}'`;
  } else if (teamName !== undefined && teamName !== "") {
    const teamInfo = await getTeamInfo({ teamName });

    sql += `AND TeamID='${teamInfo.TeamID}'`;
  }

  sql += "ORDER BY CASE WHEN TeamID >= 0 THEN 1 ELSE 2 END, ABS(TeamID), `Last Name` ASC LIMIT 25";

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return results.map((result) => `${result["First Name"]} ${result["Last Name"]}`);
};
