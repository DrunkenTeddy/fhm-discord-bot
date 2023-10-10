const query = require("./query");

module.exports = async (Year, AwardID, TeamID) => {
  const results = await query(`SELECT * from award_votes WHERE Year=${Year} AND AwardID=${AwardID} AND TeamID=${TeamID}`);

  if (results.length === 0) {
    return null;
  }

  return results[0];
};
