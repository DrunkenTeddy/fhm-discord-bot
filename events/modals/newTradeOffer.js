const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle }                                   = require("discord.js");

const getPlayerInfo       = require("../../helpers/getPlayerInfo");
const isDraftPick         = require("../../helpers/isDraftPick");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");
const getNewTradeButtons  = require("../../helpers/getNewTradeButtons");

const teams = require("../../static_data/teams.json");

const formatDraftPick = (draftPick, teamName) => {
  let team  = "";
  let year  = "";
  let round = "";

  // Check if the draft pick contains a team abbreviation in teams.json
  const teamRegex = /\b[a-zA-Z]{3}\b/;
  if (teamRegex.test(draftPick) && draftPick.match(teamRegex)[0].toLowerCase() !== "rnd") {
    const teamMatch = draftPick.match(teamRegex);
    team            = teamMatch[0];
  }

  // Check if the draft pick contains a year
  const yearRegex = /(\d{4})|'(\d{2})/;
  if (yearRegex.test(draftPick)) {
    const yearMatch = draftPick.match(yearRegex);
    year            = yearMatch[0].replace("'", "20");
  }

  // Check if the draft pick contains a round
  const roundRegex = /(\d{1,2})(st|nd|rd|th)|((R|r)ound)|((P|p)ick)/;
  if (roundRegex.test(draftPick)) {
    const roundMatch       = draftPick.match(roundRegex);
    const roundNumberRegex = /(\d{1})/;
    const roundNumberMatch = roundMatch[0].match(roundNumberRegex);
    const roundNumber      = parseInt(roundNumberMatch[0], 10);
    round                  = roundNumberMatch[0];

    if (roundNumber === 1) {
      round += "st";
    } else if (roundNumber === 2) {
      round += "nd";
    } else if (roundNumber === 3) {
      round += "rd";
    } else {
      round += "th";
    }
  }

  // If the team is not found, assume it's the team that's making the offer
  if (team === "") {
    team = teams.find((t) => t.name === teamName).abbreviation;
  }

  if (year !== "" && round !== "" && team !== "") {
    if (team.toLowerCase() === "wsh") team = "WAS";
    if (team.toLowerCase() === "ari") team = "ARZ";

    return { pick: `${year} ${round} Round Pick (${team.toUpperCase()})`, matched: true };
  }

  return { pick: draftPick, matched: false };
};

const validateTeamOffers = async (teamOffers) => {
  const offers = await teamOffers.reduce(async (a, teamOffer) => {
    const teamName = teamOffer.teamName;

    const offer = await teamOffer.assets.reduce(async (b, asset) => {
      const { players, picks } = await b;

      if (isDraftPick(asset)) {
        picks.push(formatDraftPick(asset, teamOffer.teamName));
      } else if (asset !== "") {
        const salaryRetainedRegex = /\(([^)]+)\)/;
        let playerName            = asset;
        let salaryRetained        = "";

        if (salaryRetainedRegex.test(playerName)) {
          const salaryRetainedMatch        = playerName.match(salaryRetainedRegex);
          const salaryRetainedString       = salaryRetainedMatch[1];
          const salaryRetainedPercentRegex = /(\d{1,2})%/;
          const salaryRetainedPercentMatch = salaryRetainedString.match(salaryRetainedPercentRegex);
          if (salaryRetainedPercentMatch) {
            salaryRetained = salaryRetainedPercentMatch[1];
          }

          playerName = playerName.replace(salaryRetainedMatch[0], "").trim();
        }

        const playerInfo = await getPlayerInfo({ playerNameSearch: playerName });

        if (playerInfo && salaryRetained !== "") {
          players.push({ playerName: `${playerInfo["First Name"]} ${playerInfo["Last Name"]} (${salaryRetained}% Salary Retained)`, matched: true });
        } else if (playerInfo) {
          players.push({ playerName: `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`, matched: true });
        } else {
          players.push({ playerName, matched: false });
        }
      }

      return { players, picks };
    }, Promise.resolve({ players: [], picks: [] }));

    return [...(await a), { teamName, ...offer }];
  }, Promise.resolve([]));

  // Remove duplicate draft picks
  offers.forEach((offer) => {
    offer.picks = offer.picks.filter((pick, index, self) => index === self.findIndex((p) => p.pick === pick.pick));
  });

  return offers;
};

module.exports = async (interaction) => {
  await interaction.deferUpdate({ ephemeral: true });

  const fields = [...interaction.fields.fields];

  const teamOffers = fields.map((field) => {
    field           = field[1];
    const teamIndex = field.customId.split("-").pop();
    const team      = teams[teamIndex];
    const teamName  = team.name;
    const assets    = field.value.split("\n").map((asset) => asset.trim());

    return {
      teamName,
      assets,
    };
  });

  const tradeProcessingEmbed = new EmbedBuilder()
    .setTitle("New Trade".toTitleCase())
    .setColor(0x046c13)
    .setDescription("Processing trade...");

  await interaction.editReply({
    embeds: [tradeProcessingEmbed],
  });

  const offers = await validateTeamOffers(teamOffers);

  // Check if all players and picks were matched
  const allPlayersMatched = offers.every((offer) => offer.players.every((player) => player.matched));
  const allPicksMatched   = offers.every((offer) => offer.picks.every((pick) => pick.matched));

  // Sort picks by year and round
  offers.forEach((offer) => {
    offer.picks.sort((a, b) => {
      const aYear  = parseInt(a.pick.split(" ")[0], 10);
      const bYear  = parseInt(b.pick.split(" ")[0], 10);
      const aRound = parseInt(a.pick.split(" ")[1].slice(0, 1), 10);
      const bRound = parseInt(b.pick.split(" ")[1].slice(0, 1), 10);

      if (aRound < bRound) {
        return -1;
      } if (aRound > bRound) {
        return 1;
      }
      if (aYear < bYear) {
        return -1;
      } if (aYear > bYear) {
        return 1;
      }

      return 0;
    });
  });

  const tradeString = offers.reduce((acc, offer) => {
    const players          = offer.players.map((player) => player.playerName).join("\n");
    const picks            = offer.picks.map((pick) => pick.pick).join("\n");
    const teamNameWithIcon = getTeamNameWithIcon(offer.teamName, interaction.client.emojis.cache);

    return `${acc}\n\n**${teamNameWithIcon} ${offers.length === 3 ? "receives" : "sends"}:**${players.length > 0 ? `\n${players}` : ""}${picks.length > 0 ? `\n${picks}` : ""}`;
  }, "");

  if (allPlayersMatched && allPicksMatched) {
    const tradeEmbed = new EmbedBuilder()
      .setTitle("New Trade".toTitleCase())
      .setColor(0x046c13)
      .setDescription(tradeString);

    const tradeHelpEmbed = new EmbedBuilder()
      .setTitle("Trade Review Process".toTitleCase())
      .setColor(0x046c13)
      .setDescription("After you confirm the trade, each GM will receive a DM to confirm the trade. Once the trade is confirmed by all teams, the trade will be processed by the Trade Review Board.");

    const nbPicks = offers.reduce((acc, offer) => acc + offer.picks.length, 0);
    const buttons = await getNewTradeButtons(interaction, nbPicks > 0);

    await interaction.editReply({
      embeds     : [tradeEmbed, tradeHelpEmbed],
      components : [buttons],
    });
  } else {
    const unmatchedPlayers = offers.reduce((acc, offer) => {
      const unmatched = offer.players.filter((player) => !player.matched).map((player) => player.playerName).join("\n");

      return `${acc}${unmatched.length > 0 ? `\n${unmatched}` : ""}`;
    }, "");

    const unmatchedPicks = offers.reduce((acc, offer) => {
      const unmatched = offer.picks.filter((pick) => !pick.matched).map((pick) => pick.pick).join("\n");

      return `${acc}${unmatched.length > 0 ? `\n${unmatched}` : ""}`;
    }, "");

    const unmatchedString = `${unmatchedPlayers}${unmatchedPicks}
${unmatchedPlayers ? "\nMake sure the player names are spelled correctly." : ""}${unmatchedPicks ? "\nDraft picks should contain the year, round, and team abbreviation." : ""}
Please edit your trade offer to fix these issues.`;

    const tradeEmbed = new EmbedBuilder()
      .setTitle("New Trade".toTitleCase())
      .setColor(0xed1c24)
      .setDescription(tradeString);

    const errorsEmbed = new EmbedBuilder()
      .setTitle("Error: Some assets could not be matched".toTitleCase())
      .setColor(0xed1c24)
      .setDescription(unmatchedString);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new-trade-edit")
        .setLabel("Edit Trade Offer".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.editReply({
      embeds     : [tradeEmbed, errorsEmbed],
      components : [buttons],
    });
  }
};
