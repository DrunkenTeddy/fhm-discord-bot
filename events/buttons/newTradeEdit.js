const {
  ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle,
} = require("discord.js");

const teams = require("../../static_data/teams.json");

module.exports = async (interaction) => {
  const tradeString = interaction.message.embeds[0].description;
  const tradeLines  = tradeString.split("\n").filter((line) => line !== "");
  const teamNames   = tradeLines
    .filter((line) => line.includes("receives") || line.includes("sends"))
    .map((line) => line.replace(/(receives|sends):/, "").replaceAll("**", "").trim())
    .map((teamName) => {
      const emojiRegex = /<:.+?:\d+>/g;
      const emojiMatch = teamName.match(emojiRegex);

      if (emojiMatch) {
        return teamName.replace(emojiMatch[0], "").trim();
      }

      return teamName;
    });

  const tradeAssetsByTeam = tradeLines.reduce((acc, line) => {
    const teamLine = line.includes("receives") || line.includes("sends");
    if (teamLine) {
      acc.push([]);
    } else {
      acc[acc.length - 1].push(line);
    }

    return acc;
  }, []);

  const tradeObject = tradeAssetsByTeam.reduce((acc, teamAssets, index) => {
    const teamName = teamNames[index];
    acc[teamName]  = teamAssets;

    return acc;
  }, {});

  const selectedTeams = teamNames.map((teamName) => {
    const teamData = teams.find((data) => data.name === teamName);

    return {
      name         : teamData.name,
      abbreviation : teamData.abbreviation,
    };
  });

  let getInputLabel = () => "";

  let customId     = "new-trade-offer";
  const components = [];

  if (selectedTeams.length === 3) {
    getInputLabel = (teamName) => `${teamName} receives (1 per line):`;
  } else {
    getInputLabel = (teamName) => `${teamName} sends (1 per line):`;
  }

  selectedTeams.map((selectedTeam) => {
    const teamName  = selectedTeam.name;
    const teamIndex = teams.findIndex((team) => team.name === teamName);
    const input     = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(`trade-offer-team-${teamIndex}`)
        .setLabel(getInputLabel(teamName))
        .setValue(tradeObject[teamName].join("\n"))
        .setStyle(TextInputStyle.Paragraph),
    );

    customId += `-${teamIndex}`;
    components.push(input);

    return input;
  });

  const modal = new ModalBuilder()
    .setCustomId(customId)
    .setTitle("Trade");

  modal.addComponents(...components);

  await interaction.showModal(modal);
};
