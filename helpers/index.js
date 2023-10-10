const csv = require("csv-parser");
const fs  = require("fs");

const insiders = require("../static_data/insiders.json");
const teams    = require("../static_data/teams.json");
const query    = require("./query");

const playerMasterCSV      = "csv/player_master.csv";
const playerCareerStatsCSV = "csv/player_skater_career_stats_rs.csv";
const teamDataCSV          = "csv/team_data.csv";
const teamLinesCSV         = "csv/team_lines.csv";
const teamRecordsCSV       = "csv/team_records.csv";
const injuriesCSV          = "csv/injuries.csv";
const suspensionsCSV       = "csv/suspensions.csv";

exports.getTeamNameWithIcon = (teamName, emojis) => {
  const emojiName = teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase();
  const teamEmoji = emojis.find((emoji) => emoji.name === emojiName);
  return `${teamEmoji} ${teamName}`;
};

exports.getRatingWithIcon = (rating, emojis) => {
  const ratingValue = parseInt(rating, 10);
  let emojiName     = "";

  if (ratingValue <= 5) {
    emojiName = "ratingslowest";
  } else if (ratingValue <= 7) {
    emojiName = "ratingslow";
  } else if (ratingValue <= 10) {
    emojiName = "ratingsmedium";
  } else if (ratingValue <= 14) {
    emojiName = "ratingsgood";
  } else if (ratingValue <= 17) {
    emojiName = "ratingsbetter";
  } else {
    emojiName = "ratingsbest";
  }

  const ratingEmoji = emojis.find((emoji) => emoji.name === emojiName);
  return `${ratingEmoji}${rating}`;
};

exports.getTeamIcon = (teamName, emojis) => {
  const emojiName = teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase();
  const teamEmoji = emojis.find((emoji) => emoji.name === emojiName);
  return `${teamEmoji}`;
};

exports.getInsiderImageFromName   = (insiderName) => insiders.find((insider) => insider.name === insiderName).image;
exports.getInsiderNetworkFromName = (insiderName) => insiders.find((insider) => insider.name === insiderName).network;

exports.getTeamNameFromAbbreviation = (abbreviation) => teams.find((team) => team.abbreviation === abbreviation).name;

exports.getHeightInFeet = (height) => {
  const feet = Math.floor(height / 12);
  const inch = height % 12;
  return `${feet}'${inch}"`;
};

exports.getAgeFromDateOfBirth = (dateOfBirth) => {
  const today     = new Date();
  const birthDate = new Date(dateOfBirth);
  let age         = today.getFullYear() - birthDate.getFullYear();
  const m         = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age.toString();
};

exports.getTeamInfo = (teamId) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(teamDataCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const team = results.find((t) => t.TeamId === teamId);

      if (team) {
        resolve(team);
      } else {
        console.error("Team not found.", teamId);
        resolve(null);
      }
    });
});

exports.getTeamIdFromName = (teamName) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(teamDataCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const team = results.find((t) => `${t.Name} ${t.Nickname}` === teamName);

      if (team) {
        resolve(team.TeamId);
      } else {
        console.error("Team not found.", teamName);
        resolve(null);
      }
    });
});

exports.getTeamNameFromId = (teamId) => new Promise((resolve) => {
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

exports.getPlayerIdFromName = (playerName) => new Promise((resolve) => {
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

exports.getPlayerNameFromId = (playerId) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(playerMasterCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const player = results.find((p) => p.PlayerId === playerId);

      if (player) {
        resolve(`${player["First Name"]} ${player["Last Name"]}`);
      } else {
        console.error("Player not found.", playerId);
        resolve(null);
      }
    });
});

exports.getPlayerTeamIdFromId = (playerId) => new Promise((resolve) => {
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

exports.getPlayerRatings = (playerId) => query(`SELECT * FROM player_ratings WHERE PlayerId=${playerId}`)[0];

exports.getPlayerCareerStats = (playerId) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(playerCareerStatsCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const stats = results.filter((p) => p.PlayerId === playerId);

      if (stats) {
        resolve(stats);
      } else {
        console.error("Player not found.", playerId);
        resolve(null);
      }
    });
});

exports.getPlayerCareerStatsByYear = (playerId, year) => new Promise((resolve) => {
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
        // eslint-disable-next-line prefer-destructuring
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

exports.checkIfTeamIsNHL = (teamId) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(teamDataCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const team = results.find((t) => t.TeamId === teamId);

      if (team) {
        resolve(team.LeagueId === "0");
      } else {
        resolve(false);
      }
    });
});

exports.getBoxscoresForDateRange = async (start, end) => {
  const startDate = new Date(start);
  const endDate   = new Date(end);
  const boxscores = await query(`
    SELECT * FROM boxscore_summary
    WHERE Year >= ${startDate.getFullYear()}
    AND Year <= ${endDate.getFullYear()}
    AND Month >= ${startDate.getMonth() + 1}
    AND Month <= ${endDate.getMonth() + 1}
    AND Day >= ${startDate.getDate()}
    AND Day <= ${endDate.getDate()}
    AND attendance >= 15000
    ORDER BY Year ASC, Month ASC, Day ASC;
  `);

  // Group boxscores by date
  const boxscoresByDate = boxscores.reduce((acc, boxscore) => {
    const boxscoreYear  = boxscore.Year;
    const boxscoreMonth =   boxscore.Month;
    const boxscoreDay   = boxscore.Day;
    const boxscoreDate  = `${boxscoreYear}-${boxscoreMonth}-${boxscoreDay}`;

    if (!acc[boxscoreDate]) {
      acc[boxscoreDate] = [];
    }

    acc[boxscoreDate].push(boxscore);

    return acc;
  }, {});

  // Sort boxscores by date from oldest to newest
  const sortedBoxscoresByDate = Object.keys(boxscoresByDate).sort().reduce((acc, key) => {
    acc[key] = boxscoresByDate[key];
    return acc;
  }, {});

  return sortedBoxscoresByDate;
};

exports.getLinesForTeam = (team) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(teamLinesCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const lines = results.find((l) => l.TeamId === team);

      if (lines) {
        resolve(lines);
      } else {
        console.error("No lines found.");
        resolve(null);
      }
    });
});

exports.getStandings = () => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(teamRecordsCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      if (results) {
        const nhlTeamRecords = results.filter((r) => r["League Id"] === "0");

        resolve(nhlTeamRecords);
      } else {
        console.error("No standings found.");
        resolve(null);
      }
    });
});

exports.getInjuriesForDate = (date) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(injuriesCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const injuries = results.filter((i) => i.Date === date);
      resolve(injuries);
    });
});

exports.getSuspensionsForDate = (date) => new Promise((resolve) => {
  const results = [];

  fs.createReadStream(suspensionsCSV, { encoding: "binary" })
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const suspensions = results.filter((s) => s.Date === date);
      resolve(suspensions);
    });
});
