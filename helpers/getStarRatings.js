module.exports = (client, ratings) => {
  const abilityStarEmoji       = client.emojis.cache.find((emoji) => emoji.name === "star_ability");
  const abilityHalfStarEmoji   = client.emojis.cache.find((emoji) => emoji.name === "star_ability_half");
  const potentialStarEmoji     = client.emojis.cache.find((emoji) => emoji.name === "star_potential");
  const potentialHalfStarEmoji = client.emojis.cache.find((emoji) => emoji.name === "star_potential_half");

  const abilityRating   = parseFloat(ratings.Ability);
  const potentialRating = parseFloat(ratings.Potential);

  let ability   = "";
  let potential = "";

  if (abilityRating === 0.5) {
    ability = abilityHalfStarEmoji;
  } else if (abilityRating === 1) {
    ability = abilityStarEmoji;
  } else if (abilityRating === 1.5) {
    ability = `${abilityStarEmoji}${abilityHalfStarEmoji}`;
  } else if (abilityRating === 2) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}`;
  } else if (abilityRating === 2.5) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}${abilityHalfStarEmoji}`;
  } else if (abilityRating === 3) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}`;
  } else if (abilityRating === 3.5) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}${abilityHalfStarEmoji}`;
  } else if (abilityRating === 4) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}`;
  } else if (abilityRating === 4.5) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}${abilityHalfStarEmoji}`;
  } else if (abilityRating === 5) {
    ability = `${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}${abilityStarEmoji}`;
  }

  if (potentialRating === 0.5) {
    potential = potentialHalfStarEmoji;
  } else if (potentialRating === 1) {
    potential = potentialStarEmoji;
  } else if (potentialRating === 1.5) {
    potential = `${potentialStarEmoji}${potentialHalfStarEmoji}`;
  } else if (potentialRating === 2) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}`;
  } else if (potentialRating === 2.5) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}${potentialHalfStarEmoji}`;
  } else if (potentialRating === 3) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}`;
  } else if (potentialRating === 3.5) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}${potentialHalfStarEmoji}`;
  } else if (potentialRating === 4) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}`;
  } else if (potentialRating === 4.5) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}${potentialHalfStarEmoji}`;
  } else if (potentialRating === 5) {
    potential = `${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}${potentialStarEmoji}`;
  }

  return { ability, potential };
};
