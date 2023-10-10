// playerInfo: {
//   PlayerID: 57111,
//   TeamID: 135,
//   FranchiseID: 135,
//   'First Name': 'Justin',
//   'Last Name': 'Poirier',
//   'Nick Name': '',
//   Height: 69,
//   Weight: 193,
//   DOB: '2006-9-4',
//   Birthcity: 'Montreal',
//   Birthstate: 'QC',
//   Nationality_One: 'Canada',
//   Nationality_Two: '',
//   Nationality_Three: '',
//   Retired: 0
// }

// playerStats: {
//   PlayerID: 57111,
//   TeamID: 135,
//   FranchiseID: 135,
//   GP: 34,
//   G: 7,
//   A: 16,
//   PlusMinus: 7,
//   PIM: 49,
//   PPG: 1,
//   PPA: 2,
//   SHG: 1,
//   SHA: 1,
//   Fights: 0,
//   Fights_Won: 0,
//   HIT: 41,
//   GvA: 8,
//   TkA: 11,
//   SB: 50,
//   GR: 64,
//   OGR: 66,
//   DGR: 61,
//   SOG: 96,
//   TOI: 31470,
//   PPTOI: 2881,
//   SHTOI: 5870,
//   PDO: '97.2',
//   GF60: '3.5',
//   GA60: '3.0',
//   SF60: '42.7',
//   SA60: '26.9',
//   CF: 670,
//   CA: 403,
//   CFPct: '62.4',
//   CFPctRel: '10.6',
//   FF: 520,
//   FA: 298,
//   FFPct: '63.6',
//   FFPctRel: '12.0',
//   GWG: 1,
//   FO: 79,
//   FOW: 42
// }

// playerRatings: {
//   PlayerID: 57111,
//   G: 0,
//   LD: 5,
//   RD: 8,
//   LW: 12,
//   C: 10,
//   RW: 20,
//   Aggression: 9,
//   Bravery: 15,
//   Determination: 15,
//   Teamplayer: 13,
//   Leadership: 13,
//   Temperament: 12,
//   Professionalism: 15,
//   MentalToughness: 1,
//   GoalieStamina: 1,
//   Acceleration: 14,
//   Agility: 16,
//   Balance: 13,
//   Speed: 16,
//   Stamina: 15,
//   Strength: 14,
//   Fighting: 7,
//   Screening: 15,
//   GettingOpen: 15,
//   Passing: 15,
//   PuckHandling: 15,
//   ShootingAccuracy: 15,
//   ShootingRange: 7,
//   OffensiveRead: 14,
//   Checking: 14,
//   Faceoffs: 14,
//   Hitting: 13,
//   Positioning: 14,
//   ShotBlocking: 7,
//   Stickchecking: 12,
//   DefensiveRead: 14,
//   GPositioning: 1,
//   GPassing: 1,
//   GPokecheck: 1,
//   Blocker: 1,
//   Glove: 1,
//   Rebound: 1,
//   Recovery: 1,
//   GPuckhandling: 1,
//   LowShots: 1,
//   GSkating: 1,
//   Reflexes: 1,
//   Skating: 13,
//   Shooting: 14,
//   Playmaking: 10,
//   Defending: 11,
//   Physicality: 12,
//   Conditioning: 17,
//   Character: 11,
//   HockeySense: 13,
//   GoalieTechnique: 0,
//   GoalieOverallPositioning: 0,
//   Ability: 2,
//   Potential: 3.5
// }

// teamInfo: {
//   TeamID: 11,
//   LeagueID: 0,
//   Name: 'Los Angeles',
//   Nickname: 'Kings',
//   Abbr: 'LAK',
//   ParentTeam1: -1,
//   ParentTeam2: -1,
//   ParentTeam3: -1,
//   ParentTeam4: -1,
//   ParentTeam5: -1,
//   ParentTeam6: -1,
//   ParentTeam7: -1,
//   ParentTeam8: -1,
//   PrimaryColor: '#000000',
//   SecondaryColor: '#afb7ba',
//   TextColor: '#fefef4',
//   ConferenceID: 1,
//   DivisionID: 0
// }

const positions = ["C", "LW", "RW", "LD", "RD", "G"];

const getPosition = (playerData) => {
  const positionRatings       = positions.map((position) => ({ position, rating: playerData.playerRatings[position] }));
  const sortedPositionRatings = positionRatings.sort((a, b) => b.rating - a.rating);

  return sortedPositionRatings[0].position;
};

const getPositionString = (playerData) => {
  const position = getPosition(playerData);

  if (position === "C" || position === "LW" || position === "RW") { return "forward"; }
  if (position === "LD" || position === "RD") { return "defenseman"; }
  return "goalie";
};

const getPhysicality = (playerData) => {
  const height = parseInt(playerData.playerInfo.Height, 10);

  if (height < 70) { return "small"; }
  if (height > 75) { return "big"; }
  return "";
};

const getPlayerAttributes = (playerData) => {
  const playerRatings = playerData.playerRatings;
  const attributes    = [
    { name: "Acceleration", rating: "Acceleration", snippet: "" },
    { name: "Aggression", rating: "Aggression", snippet: "" },
    { name: "Agility", rating: "Agility", snippet: "" },
    { name: "Balance", rating: "Balance", snippet: "" },
    { name: "Blocker", rating: "Blocker", snippet: "" },
    { name: "Bravery", rating: "Bravery", snippet: "" },
    { name: "Character", rating: "Character", snippet: "" },
    { name: "Checking", rating: "Checking", snippet: "" },
    { name: "Defending", rating: "Defending", snippet: "" },
    { name: "Defensive Read", rating: "DefensiveRead", snippet: "" },
    { name: "Determination", rating: "Determination", snippet: "" },
    { name: "Faceoffs", rating: "Faceoffs", snippet: "" },
    { name: "Fighting", rating: "Fighting", snippet: "" },
    { name: "Getting Open", rating: "GettingOpen", snippet: "" },
    { name: "Glove", rating: "Glove", snippet: "" },
    { name: "Goalie Stamina", rating: "GoalieStamina", snippet: "" },
    { name: "Hitting", rating: "Hitting", snippet: "" },
    { name: "Hockey Sense", rating: "HockeySense", snippet: "" },
    { name: "Leadership", rating: "Leadership", snippet: "" },
    { name: "Low Shots", rating: "LowShots", snippet: "" },
    { name: "Mental Toughness", rating: "MentalToughness", snippet: "" },
    { name: "Offensive Read", rating: "OffensiveRead", snippet: "" },
    { name: "Overall Positioning", rating: "GoalieOverallPositioning", snippet: "" },
    { name: "Passing", rating: "GPassing", snippet: "" },
    { name: "Passing", rating: "Passing", snippet: "" },
    { name: "Physicality", rating: "Physicality", snippet: "" },
    { name: "Playmaking", rating: "Playmaking", snippet: "" },
    { name: "Pokecheck", rating: "GPokecheck", snippet: "" },
    { name: "Positioning", rating: "GPositioning", snippet: "" },
    { name: "Positioning", rating: "Positioning", snippet: "" },
    { name: "Professionalism", rating: "Professionalism", snippet: "" },
    { name: "Puck Handling", rating: "PuckHandling", snippet: "" },
    { name: "Puckhandling", rating: "GPuckhandling", snippet: "" },
    { name: "Rebound", rating: "Rebound", snippet: "" },
    { name: "Recovery", rating: "Recovery", snippet: "" },
    { name: "Reflexes", rating: "Reflexes", snippet: "" },
    { name: "Screening", rating: "Screening", snippet: "" },
    { name: "Shooting Accuracy", rating: "ShootingAccuracy", snippet: "" },
    { name: "Shooting Range", rating: "ShootingRange", snippet: "" },
    { name: "Shooting", rating: "Shooting", snippet: "" },
    { name: "Shot Blocking", rating: "ShotBlocking", snippet: "" },
    { name: "Skating", rating: "GSkating", snippet: "" },
    { name: "Skating", rating: "Skating", snippet: "" },
    { name: "Speed", rating: "Speed", snippet: "" },
    { name: "Stamina", rating: "Stamina", snippet: "" },
    { name: "Stickchecking", rating: "Stickchecking", snippet: "" },
    { name: "Strength", rating: "Strength", snippet: "" },
    { name: "Teamplayer", rating: "Teamplayer", snippet: "" },
    { name: "Technique", rating: "GoalieTechnique", snippet: "" },
    { name: "Temperament", rating: "Temperament", snippet: "" },
  ];

  return attributes.map((attribute) => ({ attribute: attribute.name, rating: playerRatings[attribute.rating] }));
};

const getPlayerTopAttributes = (playerData) => {
  const playerAttributes = getPlayerAttributes(playerData);
  const sortedAttributes = playerAttributes.sort((a, b) => b.rating - a.rating);

  return sortedAttributes.slice(0, 3);
};

const getPlayerTopAttributesString = (playerData) => {
  const topAttributes    = getPlayerTopAttributes(playerData);
  const lastAttribute    = topAttributes.pop();
  const attributesString = `${topAttributes.map((attribute) => attribute.attribute.toLowerCase()).join(", ")} and ${lastAttribute.attribute.toLowerCase()}`;

  const strings = [
    `${playerData.playerInfo["Last Name"]} is known for his ${attributesString}. `,
    `He is known for his ${attributesString}. `,
    `His best attributes are his ${attributesString}. `,
    `${playerData.playerInfo["Last Name"]} key attributes are his ${attributesString}. `,
  ];

  return strings[Math.floor(Math.random() * strings.length)];
};

module.exports = (playerInfo, playerStats, playerRatings, teamInfo) => {
  const playerData = {
    playerInfo, playerStats, playerRatings, teamInfo,
  };

  let message = "";

  if (playerStats) {
    message = `In ${playerStats.GP} games, the ${getPhysicality(playerData)} ${getPositionString(playerData)} scored ${playerStats.G} goals and had ${playerStats.A} assists for ${playerStats.G + playerStats.A} points. `;
  }

  if (playerRatings) {
    message += getPlayerTopAttributesString(playerData);
  }

  return message;
};
