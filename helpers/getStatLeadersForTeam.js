const query = require("./query");

module.exports = async (teamID) => {
  const goalLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, G FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY G DESC LIMIT 5
  `);

  const assistLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, A FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY A DESC     LIMIT 5
  `);

  const pointLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, G + A AS P FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY P DESC LIMIT 5
  `);

  const GRLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, GR FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY GR DESC LIMIT 5
  `);

  const OGRLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, OGR FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY OGR DESC LIMIT 5
  `);

  const DGRLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, DGR FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY DGR DESC LIMIT 5
  `);

  const PlusMinusLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, PlusMinus FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY PlusMinus DESC LIMIT 5
  `);

  const PPGLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, PPG FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY PPG DESC LIMIT 5
  `);

  const PPALeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, PPA FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY PPA DESC LIMIT 5
  `);

  const GvALeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, GvA FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY GvA DESC LIMIT 5
  `);

  const TkALeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, TkA FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY TkA DESC LIMIT 5
  `);

  const SBLeadersResults = await query(`
    SELECT \`First Name\`, \`Last Name\`, SB FROM player_master
    INNER JOIN player_skater_stats_rs ON player_master.PlayerID = player_skater_stats_rs.PlayerID
    WHERE player_master.TeamID = ${teamID}
    ORDER BY SB DESC LIMIT 5
  `);

  return {
    goal      : goalLeadersResults,
    assist    : assistLeadersResults,
    point     : pointLeadersResults,
    GR        : GRLeadersResults,
    OGR       : OGRLeadersResults,
    DGR       : DGRLeadersResults,
    PlusMinus : PlusMinusLeadersResults,
    PPG       : PPGLeadersResults,
    PPA       : PPALeadersResults,
    GvA       : GvALeadersResults,
    TkA       : TkALeadersResults,
    SB        : SBLeadersResults,
  };
};
