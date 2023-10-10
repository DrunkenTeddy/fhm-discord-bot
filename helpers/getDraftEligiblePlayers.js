const query          = require("./query");
const getCurrentDate = require("./getCurrentDate");

module.exports = async (draftYear, draftProfile) => {
  const currentDate = await getCurrentDate();

  const getWeightedRating = (rating) => {
    const attribute = draftProfile.attributes.find((a) => a.name === rating);

    if (attribute === undefined) {
      return `player_ratings.${rating}`;
    }

    const weight = attribute.value;

    if (rating === "G") {
      return `(player_ratings.${rating} * player_ratings.Potential * ${weight})`;
    }

    return `(player_ratings.${rating} * ${weight})`;
  };

  const ageBias = 100;

  const sql = `
    SELECT player_master.PlayerID, player_master.\`First Name\`, player_master.\`Last Name\`, 
    TIMESTAMPDIFF(YEAR, player_master.DOB, '${currentDate}') AS Age, (
      ${getWeightedRating("Ability")} +
      ${getWeightedRating("Potential")} +
      ${getWeightedRating("Acceleration")} +
      ${getWeightedRating("Aggression")} +
      ${getWeightedRating("Agility")} +
      ${getWeightedRating("Balance")} +
      ${getWeightedRating("Blocker")} +
      ${getWeightedRating("Bravery")} +
      ${getWeightedRating("Character")} +
      ${getWeightedRating("Checking")} +
      ${getWeightedRating("Defending")} +
      ${getWeightedRating("DefensiveRead")} +
      ${getWeightedRating("Determination")} +
      ${getWeightedRating("Faceoffs")} +
      ${getWeightedRating("Fighting")} +
      ${getWeightedRating("GettingOpen")} +
      ${getWeightedRating("Glove")} +
      ${getWeightedRating("GoalieStamina")} +
      ${getWeightedRating("Hitting")} +
      ${getWeightedRating("HockeySense")} +
      ${getWeightedRating("Leadership")} +
      ${getWeightedRating("LowShots")} +
      ${getWeightedRating("MentalToughness")} +
      ${getWeightedRating("OffensiveRead")} +
      ${getWeightedRating("GoalieOverallPositioning")} +
      ${getWeightedRating("GPassing")} +
      ${getWeightedRating("Passing")} +
      ${getWeightedRating("Physicality")} +
      ${getWeightedRating("Playmaking")} +
      ${getWeightedRating("GPokecheck")} +
      ${getWeightedRating("GPositioning")} +
      ${getWeightedRating("Positioning")} +
      ${getWeightedRating("Professionalism")} +
      ${getWeightedRating("PuckHandling")} +
      ${getWeightedRating("GPuckhandling")} +
      ${getWeightedRating("Rebound")} +
      ${getWeightedRating("Recovery")} +
      ${getWeightedRating("Reflexes")} +
      ${getWeightedRating("Screening")} +
      ${getWeightedRating("ShootingAccuracy")} +
      ${getWeightedRating("ShootingRange")} +
      ${getWeightedRating("Shooting")} +
      ${getWeightedRating("ShotBlocking")} +
      ${getWeightedRating("GSkating")} +
      ${getWeightedRating("Skating")} +
      ${getWeightedRating("Speed")} +
      ${getWeightedRating("Stamina")} +
      ${getWeightedRating("Stickchecking")} +
      ${getWeightedRating("Strength")} +
      ${getWeightedRating("Teamplayer")} +
      ${getWeightedRating("GoalieTechnique")} +
      ${getWeightedRating("Temperament")} +
      ${getWeightedRating("G")}
    ) - (TIMESTAMPDIFF(YEAR, player_master.DOB, '${currentDate}') * ${ageBias}) AS WeightedRating
    FROM player_master
    INNER JOIN player_ratings ON player_master.PlayerID = player_ratings.PlayerID
    JOIN team_data ON player_master.FranchiseID = team_data.TeamID
    LEFT JOIN drafted_players ON player_master.PlayerID = drafted_players.PlayerID
    WHERE
      TIMESTAMPDIFF(YEAR, player_master.DOB, '${draftYear}-09-15') >= 18
      AND TIMESTAMPDIFF(YEAR, player_master.DOB, '${draftYear}-12-31') <= 20
      AND drafted_players.PlayerID IS NULL
    ORDER BY WeightedRating DESC, player_ratings.Potential DESC, player_ratings.Ability DESC
    LIMIT 32
  `;

  const results = await query(sql);

  if (results.length === 0) {
    return null;
  }

  return results;
};
