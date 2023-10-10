const csv = require("csv-parser");
const fs  = require("fs");

const playerMasterCSV = "../csv/player_master.csv";

module.exports = (playerName) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(playerMasterCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const player = results.find((p) => `${p["First Name"].toLowerCase()} ${p["Last Name"].toLowerCase()}` === playerName.toLowerCase());

      if (player) {
        resolve(player.PlayerId);
      } else {
        console.error("Player not found.", playerName);
        resolve(null);
      }
    });
});
