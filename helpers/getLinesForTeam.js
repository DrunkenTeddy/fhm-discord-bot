const query = require("./query");

module.exports = async (team) => {
  let lines = await query(`
    SELECT *
    FROM team_lines
    WHERE team_lines.TeamId = ${team}
  `);

  if (lines.length === 0) {
    return null;
  }

  lines = lines[0];

  const positions = Object.keys(lines);

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const playerID = lines[position];

    if (position !== "TeamId" && playerID !== "") {
      const player = await query(`
        SELECT *
        FROM player_master
        WHERE player_master.PlayerID = ${playerID}
      `);

      lines[position] = `${player[0]["First Name"]} ${player[0]["Last Name"]}`;
    }
  }

  return lines;
};
