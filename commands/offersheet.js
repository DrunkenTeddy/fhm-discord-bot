const {
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const autocomplete        = require("../helpers/autocomplete");
const getCompensation     = require("../helpers/getCompensation");
const getDiscordInfo      = require("../helpers/getDiscordInfo");
const getPlayerInfo       = require("../helpers/getPlayerInfo");
const getTeamInfo         = require("../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("offersheet")
    .setDescription("Send a new offer sheet.")
    .addStringOption((option) => option.setName("team")
      .setDescription("Team signing the offer sheet.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("player")
      .setDescription("Player being signed.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("rights")
      .setDescription("Team that holds the player's rights.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("salary")
      .setDescription("Salary of the player.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("years")
      .setDescription("Years of the contract.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("clause")
      .setDescription("NTC/NMC clause.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("deadline")
      .setDescription("Deadline date to match the offer.")),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  async execute(interaction) {
    const team         = interaction.options.getString("team");
    const player       = interaction.options.getString("player");
    const rights       = interaction.options.getString("rights");
    const salary       = interaction.options.getString("salary");
    const years        = interaction.options.getString("years");
    const clause       = interaction.options.getString("clause");
    const yearsNumber  = parseInt(years, 10);
    const deadline     = interaction.options.getString("deadline");
    const salaryNumber = parseInt(salary.replace(/,/g, "").replace("$", ""), 10);
    const yearsString  = years.endsWith("year") || years.endsWith("years") ? years : `${years} year${years > 1 ? "s" : ""}`;

    const playerInfo = await getPlayerInfo({ playerName: player });
    const playerID   = playerInfo.PlayerID;

    const teamInfo = await getTeamInfo({ teamName: team });
    const teamID   = teamInfo.TeamID;

    const rightsTeamInfo = await getTeamInfo({ teamName: rights });
    const rightsTeamID   = rightsTeamInfo.TeamID;

    const teamNameWithLogo   = getTeamNameWithIcon(team, interaction.client.emojis.cache);
    const rightsNameWithLogo = getTeamNameWithIcon(rights, interaction.client.emojis.cache);

    const teamLogo       = interaction.client.emojis.cache.find((emoji) => emoji.name === team.replaceAll(" ", "").replaceAll(".", "").toLowerCase());
    const rightsTeamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === rights.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

    const rightsTeamDiscord   = await getDiscordInfo({ teamName: rights });
    const rightsTeamDiscordID = rightsTeamDiscord.DiscordID;

    const { compensationText, compensationIndex } = getCompensation(salaryNumber, yearsNumber, teamLogo);

    let clauseString    = "";
    const clauseChoices = ["No clause", "No Trade Clause (NTC)", "No Movement Clause (NMC)"];
    const clauseIndex   = clauseChoices.findIndex((choice) => choice === clause);

    if (clause === "No Trade Clause (NTC)") {
      clauseString = "\nThe contract includes a no-trade clause (NTC).";
    } else if (clause === "No Movement Clause (NMC)") {
      clauseString = "\nThe contract includes a no-movement clause (NMC).";
    }

    const signingString = `
**${rightsTeamLogo} ${player}** signed an offer sheet with the **${teamNameWithLogo}** for **${salary}/${yearsString}**.${clauseString}
**If the offer is not matched, the ${teamNameWithLogo} will have to send the following:**

${compensationText}

**${rightsNameWithLogo}** (<@${rightsTeamDiscordID}>) have until **${deadline !== null ? deadline : "next sim"}** to match the offer.
    `;

    await interaction.reply({
      content   : "Offer sheet sent.",
      ephemeral : true,
    });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`os-gm-accept-${playerID}-${teamID}-${rightsTeamID}-${salaryNumber}-${yearsNumber}-${clauseIndex}-${compensationIndex}`)
          .setLabel("Match Offer")
          .setStyle(ButtonStyle.Success),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`os-gm-reject-${playerID}-${teamID}-${rightsTeamID}-${salaryNumber}-${yearsNumber}-${clauseIndex}-${compensationIndex}`)
          .setLabel("Don't Match Offer")
          .setStyle(ButtonStyle.Secondary),
      );

    const channel = interaction.client.channels.cache.find((c) => c.name === "offer-sheets");
    await channel.send({ content: signingString, components: [buttons] });
  },
};
