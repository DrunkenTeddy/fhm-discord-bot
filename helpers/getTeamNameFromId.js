const csv = require("csv-parser");
const fs  = require("fs");

const teamDataCSV = "../csv/team_data.csv";

module.exports = (teamId) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(teamDataCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const team = results.find((t) => t.TeamId === teamId);

      if (team) {
        resolve(`${team.Name} ${team.Nickname}`);
      } else {
        console.error("Team not found.", teamId);
        resolve(null);
      }
    });
});
