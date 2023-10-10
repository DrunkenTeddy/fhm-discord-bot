const { EmbedBuilder } = require("@discordjs/builders");

const getCurrentDate       = require("./getCurrentDate");
const getAwards            = require("./getAwards");
const getAward             = require("./getAward");
const awardsGetNominations = require("./awardsGetNominations");
const getPlayerInfo        = require("./getPlayerInfo");
const getTeamInfo          = require("./getTeamInfo");

module.exports = async (interaction, awardID, teamID) => {
  const currentDate        = await getCurrentDate();
  const currentYear        = currentDate.split("-")[0];
  const awards             = await getAwards();
  const award              = await getAward(awardID);
  const nominations        = await awardsGetNominations(currentYear, awardID, teamID);
  const nominationsByAward = await awards.reduce(async (acc, nominationAward) => {
    const nominationAwardID = nominationAward.ID;
    const awardNominations  = await awardsGetNominations(currentYear, nominationAwardID, teamID);

    return { ...await acc, [nominationAwardID]: awardNominations };
  }, Promise.resolve({}));

  const awardEmbed = new EmbedBuilder()
    .setTitle(`${award.Name} (${parseInt(awardID, 10)}/${awards.length})`)
    .setDescription(`**${award.Description}**`)
    .setColor(0xF2A433);

  const nominationsEmbed = new EmbedBuilder()
    .setTitle("My Nominations")
    .setColor(0xF2A433);

  const progressEmbed = new EmbedBuilder()
    .setTitle("Completion Progress".toTitleCase())
    .setColor(0xF2A433);

  if (nominations.length === 0) {
    nominationsEmbed.setDescription("You don't have any nominations for this award.");
  } else {
    const nominationsString = await nominations.reduce(async (acc, nomination) => {
      if (nomination.PlayerID !== null) {
        const playerInfo = await getPlayerInfo({ playerID: nomination.PlayerID });
        const playerName = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;

        return `${await acc}\n${playerName} (Confirmed)`;
      }

      const teamInfo = await getTeamInfo({ discordID: nomination.DiscordID });
      const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;

      return `${await acc}\n${teamName} (Confirmed)`;
    }, Promise.resolve(""));

    nominationsEmbed.setDescription(nominationsString);
  }

  const completionString = await awards.reduce(async (acc, currentAward, index) => {
    const awardNominationsCount = nominationsByAward[currentAward.ID].length;
    const completed             = awardNominationsCount > 0;

    return `${await acc}${index > 0 ? "-" : ""}${completed ? "✅" : "❌"}`;
  }, Promise.resolve(""));

  const progressString = awards.reduce((acc, currentAward, index) => `${acc}${index > 0 ? "-" : ""}${parseInt(awardID, 10) === index + 1 ? "⚪" : "⚫"}`, "");

  progressEmbed.setFooter({ text: `${completionString}\n${progressString}` });

  return [awardEmbed, nominationsEmbed, progressEmbed];
};
