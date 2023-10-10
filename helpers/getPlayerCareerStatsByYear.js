const csv = require("csv-parser");
const fs  = require("fs");

const playerCareerStatsCSV = "../csv/player_skater_career_stats_rs.csv";

module.exports = (playerId, year) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(playerCareerStatsCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const stats     = results.filter((s) => s.PlayerId === playerId);
      let seasonStats = stats.find((s) => s.Year === year);

      // Sort the stats by year
      stats.sort((a, b) => parseInt(a.Year, 10) - parseInt(b.Year, 10));

      if (stats && year === "") {
        seasonStats = stats[stats.length - 1];
      }

      if (seasonStats) {
        resolve(seasonStats);
      } else if (stats) {
        console.error("No stats for that year.", playerId, year);
        resolve(null);
      } else {
        console.error("Player not found.", playerId, year);
        resolve(null);
      }
    });
});
