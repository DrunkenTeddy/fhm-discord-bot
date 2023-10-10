const csv = require("csv-parser");
const fs  = require("fs");

const playerMasterCSV = "../csv/player_master.csv";

module.exports = (playerId) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(playerMasterCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const player = results.find((p) => p.PlayerId === playerId);

      if (player) {
        resolve(player.TeamId);
      } else {
        console.error("Player not found.", playerId);
        resolve(null);
      }
    });
});
