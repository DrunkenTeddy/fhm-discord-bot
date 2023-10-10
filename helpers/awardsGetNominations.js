const query = require("./query");

module.exports = async (Year, AwardID, TeamID) => {
  const results = await query(`SELECT * from award_nominations WHERE Year=${Year} AND AwardID=${AwardID} AND TeamID=${TeamID} ORDER BY Votes DESC`);

  return results;
};
