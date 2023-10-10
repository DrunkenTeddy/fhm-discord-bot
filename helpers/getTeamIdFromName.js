const query = require("./query");

module.exports = (teamName) => query(`SELECT * FROM team_data WHERE CONCAT(team_data.Name, ' ', team_data.Nickname)='${teamName}'`)[0].TeamID;
