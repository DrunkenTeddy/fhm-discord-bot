const draftProfiles = require("../../static_data/draftProfiles.json");

const getDraftEligiblePlayers = require("../../helpers/getDraftEligiblePlayers");

module.exports = async (interaction) => {
  // Get a random draft profile
  const randomDraftProfile    = draftProfiles[Math.floor(Math.random() * draftProfiles.length)];
  const draftElligiblePlayers = await getDraftEligiblePlayers(randomDraftProfile);

  console.log(draftElligiblePlayers);

  interaction.reply({ content: "Debug info logged to console", ephemeral: true });
};
