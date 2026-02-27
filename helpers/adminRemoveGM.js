const query = require("./query");

module.exports = async (Abbr) => {
  const results = await query(
    `UPDATE gm SET DiscordID = NULL WHERE Abbr = '${Abbr}';`,
  );

  return results;
};
