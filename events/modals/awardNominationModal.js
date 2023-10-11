const awardsAddNomination      = require("../../helpers/awardsAddNomination");
const getAwardNominationEmbeds = require("../../helpers/getAwardNominationEmbeds");
const awardsResetNominations   = require("../../helpers/awardsResetNominations");
const getCurrentDate           = require("../../helpers/getCurrentDate");
const getDiscordInfo           = require("../../helpers/getDiscordInfo");
const getPlayerInfo            = require("../../helpers/getPlayerInfo");
const getTeamInfo              = require("../../helpers/getTeamInfo");

module.exports = async (interaction) => {
  await interaction.deferUpdate({ ephemeral: true });

  const currentDate      = await getCurrentDate();
  const currentYear      = currentDate.split("-")[0];
  const awardID          = interaction.customId.split("-")[2];
  const teamAwardsID     = [9, 10];
  const nominations      = interaction.fields.getTextInputValue("nominations");
  const discordID        = interaction.user.id;
  const teamInfo         = await getTeamInfo({ discordID });
  const teamID           = teamInfo.TeamID;
  const embeds           = interaction.message.embeds;
  const nominationsEmbed = embeds.find((embed) => embed.title === "My Nominations");

  nominationsEmbed.data.description = "Processing nominations...";
  await interaction.editReply({ embeds });

  if (teamAwardsID.includes(parseInt(awardID, 10))) {
    const nominatedTeams = nominations.split("\n").slice(0, 5)
      .map((nomination, index) => nomination
        .replaceAll("**", "")
        .replace(" (Confirmed)", "")
        .replace(" (Error)", "")
        .replace(" (Team not found)", "")
        .replace(`${index + 1}. `, "")
        .trim());

    if (nominatedTeams.length > 0) {
      await awardsResetNominations(currentYear, awardID, teamID);
    }

    for (const nomination of nominatedTeams) {
      const index                = nominatedTeams.indexOf(nomination);
      const nominatedDiscordInfo = await getDiscordInfo({ teamNameSearch: nomination });

      if (nominatedDiscordInfo) {
        const nominatedTeamDiscordID = nominatedDiscordInfo.DiscordID;
        const votes                  = 5 - index;

        try {
          const nominatedTeamInfo = await getTeamInfo({ discordID: nominatedTeamDiscordID });

          await awardsAddNomination(currentYear, awardID, null, nominatedTeamDiscordID, teamID, votes);
          nominatedTeams[index] = `${nominatedTeamInfo.Name} ${nominatedTeamInfo.Nickname} (Confirmed)`;
        } catch (error) {
          nominatedTeams[index] = `**${nominatedTeams[index]} (Error)**`;
        }
      } else {
        nominatedTeams[index] = `**${nominatedTeams[index]} (Team not found)**`;
      }
    }

    nominationsEmbed.data.description = nominatedTeams.map((nomination, index) => `${index + 1}. ${nomination}`).join("\n");
  } else {
    const nominatedPlayers = nominations.split("\n").slice(0, 5)
      .map((nomination, index) => nomination
        .replaceAll("**", "")
        .replace(" (Confirmed)", "")
        .replace(" (Error)", "")
        .replace(" (Player not found)", "")
        .replace(`${index + 1}. `, "")
        .trim());

    if (nominatedPlayers.length > 0) {
      await awardsResetNominations(currentYear, awardID, teamID);
    }

    for (const nomination of nominatedPlayers) {
      const index      = nominatedPlayers.indexOf(nomination);
      const playerInfo = await getPlayerInfo({ playerNameSearch: nomination });

      if (playerInfo) {
        const playerID = playerInfo.PlayerID;
        const votes    = 5 - index;

        try {
          await awardsAddNomination(currentYear, awardID, playerID, null, teamID, votes);
          nominatedPlayers[index] = `${nominatedPlayers[index]} (Confirmed)`;
        } catch (error) {
          nominatedPlayers[index] = `**${nominatedPlayers[index]} (Error)**`;
        }
      } else {
        nominatedPlayers[index] = `**${nominatedPlayers[index]} (Player not found)**`;
      }
    }

    nominationsEmbed.data.description = nominatedPlayers.map((nomination) => `${nomination}`).join("\n");
  }

  const nominationEmbeds = await getAwardNominationEmbeds(interaction, awardID, teamID);
  embeds[2]              = nominationEmbeds[2];

  await interaction.editReply({ embeds });
};
