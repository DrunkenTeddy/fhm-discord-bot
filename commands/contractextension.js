const {
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const autocomplete        = require("../helpers/autocomplete");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("contractextension")
    .setDescription("Send a new player contract extension to the review board.")
    .addStringOption((option) => option.setName("team")
      .setDescription("Team signing the player.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("player")
      .setDescription("Player from the team being signed.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("askedsalary")
      .setDescription("Salary asked by the player.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("askedyears")
      .setDescription("Years asked by the player.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("salary")
      .setDescription("Salary offered by the team.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("years")
      .setDescription("Years offered by the team.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("clause")
      .setDescription("NTC/NMC clause.")
      .setRequired(true)
      .setAutocomplete(true)),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  async execute(interaction) {
    const team             = interaction.options.getString("team");
    const player           = interaction.options.getString("player");
    const salary           = interaction.options.getString("salary");
    const years            = interaction.options.getString("years");
    const askedsalary      = interaction.options.getString("askedsalary");
    const askedyears       = interaction.options.getString("askedyears");
    const clause           = interaction.options.getString("clause");
    const yearsString      = years.endsWith("year") || years.endsWith("years") ? years : `${years} year${years > 1 ? "s" : ""}`;
    const askedyearsString = askedyears.endsWith("year") || askedyears.endsWith("years") ? askedyears : `${askedyears} year${askedyears > 1 ? "s" : ""}`;
    let clauseString       = "";

    if (clause === "No Trade Clause (NTC)") {
      clauseString = "\nThe contract also includes a no-trade clause (NTC).";
    } else if (clause === "No Movement Clause (NMC)") {
      clauseString = "\nThe contract also includes a no-movement clause (NMC).";
    }

    const signingString = `
**${getTeamNameWithIcon(team, interaction.client.emojis.cache)}** wants to extend **${player}** for **${salary}/${yearsString}**.${clauseString}
**${player}** asked for **${askedsalary}/${askedyearsString}**.
`;

    await interaction.reply({
      content   : "Player contract extension sent to the review board.",
      ephemeral : true,
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("contract-extension-accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("contract-extension-reject")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("contract-extension-edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Secondary),
    );

    const channel = interaction.client.channels.cache.find((c) => c.name === "contract-review-board");
    await channel.send({
      content    : `New player contract extension request from ${interaction.user.username}:\n${signingString}`,
      components : [buttons],
    });
  },
};
