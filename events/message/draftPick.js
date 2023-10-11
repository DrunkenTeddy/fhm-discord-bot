const teams = require("../../static_data/teams.json");

const { draftPlayer } = require("../../commands/draft");
const getPlayerInfo   = require("../../helpers/getPlayerInfo");

module.exports = async (interaction) => {
  await interaction.delete();

  const channel      = interaction.guild.channels.cache.find((c) => c.name === "draft-log");
  const messages     = await channel.messages.fetch({ limit: 1 });
  const draftMessage = messages.first();

  if (draftMessage.size === 0 || draftMessage.embeds[0].title.includes("Pick on the clock:") === false) {
    await interaction.reply({
      content   : "No draft in progress",
      ephemeral : true,
    });
    return;
  }

  const draftPickMessage = interaction.content;
  const draftPicks       = draftPickMessage.split("\n");
  const pickPosition     = parseInt(draftMessage.embeds[0].title.split("Pick on the clock: ")[1], 10);

  for (let i = 0; i < draftPicks.length; i++) {
    const pick     = draftPicks[i];
    let pickTeam   = pick.split("(")[1].split(")")[0];
    const pickName = pick.replace(`${pickPosition}. `, "").replace(` (${pickTeam})`, "");

    // Check if pickPosition is a number
    if (Number.isNaN(pickPosition)) {
      await interaction.author.send(`Could not find the pick position in your draft pick (\`${pick}\`). Please use the following format: \`Connor Bedard (MTL)\``);
      break;
    }

    // Check if pickTeam is a string
    if (typeof pickTeam !== "string" || pickTeam.length !== 3) {
      await interaction.author.send(`Could not find the team in your draft pick (\`${pick}\`). Please use the following format: \`Connor Bedard (MTL)\``);
      break;
    }

    // Check if pickName is a string
    if (typeof pickName !== "string" || pickName.length < 3) {
      await interaction.author.send(`Could not find the player name in your draft pick (\`${pick}\`). Please use the following format: \`Connor Bedard (MTL)\``);
      break;
    }

    let teamInfo = teams.find((team) => team.abbreviation === pickTeam);

    if (teamInfo === undefined) {
    // Check if the team was specified but with the wrong abbreviation
      if (["ARI", "MON", "WSH"].includes(pickTeam.toUpperCase())) {
        if (pickTeam.toLowerCase() === "ari") pickTeam = "ARZ";
        if (pickTeam.toLowerCase() === "mon") pickTeam = "MTL";
        if (pickTeam.toLowerCase() === "wsh") pickTeam = "WAS";

        teamInfo = teams.find((team) => team.abbreviation === pickTeam);
      } else {
        await interaction.author.send("Could not find the team in your draft pick. Please use the following format: `Connor Bedard (MTL)`");
        break;
      }
    }

    const success = await draftPlayer(interaction, pickName, teamInfo.name);

    if (!success) { break; }
  }
};
