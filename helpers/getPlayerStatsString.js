module.exports = (playerStats, showFullStats = false) => {
  const stats = [
    `GP: ${playerStats.GP}`,
    `G: ${playerStats.G}`,
    `A: ${playerStats.A}`,
    `PTS: ${playerStats.G + playerStats.A}`,
    `${playerStats.PlusMinus >= 0 ? "+" : ""}${playerStats.PlusMinus}`,
  ];

  const fullStats = [
    `GvA: ${playerStats.GvA}`,
    `TkA: ${playerStats.TkA}`,
    `PIM: ${playerStats.PIM}`,
    `HIT: ${playerStats.HIT}`,
    `SB: ${playerStats.SB}`,
    `OGR: ${playerStats.OGR}`,
    `DGR: ${playerStats.DGR}`,
    `GR: ${playerStats.GR}`,
  ];

  if (showFullStats && playerStats.FO > 400) {
    fullStats.push(`FO%: ${Math.floor((playerStats.FOW / playerStats.FO) * 100)}`);
  }

  return showFullStats ? fullStats.join(" | ") : stats.join(" / ");
};
