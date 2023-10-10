const query = require("./query");

module.exports = async (Year, AwardID, TeamID) => {
  const results = await query(`DELETE FROM award_nominations WHERE Year=${Year} AND AwardID=${AwardID} AND TeamID=${TeamID}`);

  return results;
};
