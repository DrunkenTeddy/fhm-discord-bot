module.exports = (goalieStats, showFullStats = false) => {
  const stats = [
    `GP: ${goalieStats.GP}`,
    `W: ${goalieStats.Wins}`,
    `L: ${goalieStats.Losses}`,
    `OTL: ${goalieStats.OT}`,
  ];

  const fullStats = [
    `SV%: ${goalieStats.SavePct}`,
    `GAA: ${goalieStats.GAA}`,
    `SO: ${goalieStats.Shutouts}`,
    `GA: ${goalieStats.GoalsAgainst}`,
    `SA: ${goalieStats.ShotsAgainst}`,
    `SV: ${goalieStats.Saves}`,
    `GR: ${goalieStats.GameRating}`,
  ];

  return showFullStats ? fullStats.join(" | ") : stats.join(" / ");
};
