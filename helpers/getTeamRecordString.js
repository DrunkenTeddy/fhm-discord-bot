module.exports = (teamRecord, showFullStats = false) => {
  const stats = [
    `GP: ${teamRecord.Wins + teamRecord.Losses + teamRecord.OTL + teamRecord.SOL}`,
    `W: ${teamRecord.Wins}`,
    `L: ${teamRecord.Losses}`,
    `OT: ${teamRecord.OTL + teamRecord.SOL}`,
  ];

  const fullStats = [
    `GF: ${teamRecord.GF}`,
    `GA: ${teamRecord.GA}`,
    `SOW: ${teamRecord.SOW}`,
    `OTL: ${teamRecord.OTL}`,
    `SOL: ${teamRecord.SOL}`,
    `PCT: ${teamRecord.PCT}`,
  ];

  return showFullStats ? fullStats.join(" | ") : stats.join(" / ");
};
