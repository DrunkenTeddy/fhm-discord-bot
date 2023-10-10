const query = require("./query");

module.exports = async (Abbr, DiscordID) => {
  const results = await query(`
    INSERT INTO gm (Abbr, DiscordID) VALUES ('${Abbr}', '${DiscordID}') ON DUPLICATE KEY UPDATE DiscordID = '${DiscordID}';
  `);

  return results;
};
