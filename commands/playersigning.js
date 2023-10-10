const { SlashCommandBuilder } = require("discord.js");

const autocomplete        = require("../helpers/autocomplete");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

const insiders = require("../static_data/insiders.json");

const { sendInsiderInfo } = require("./insider");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playersigning")
    .setDescription("Announce a player signing.")
    .addStringOption((option) => option.setName("team")
      .setDescription("Team who signed the player.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("player")
      .setDescription("Player signed.")
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
    .addStringOption((option) => option.setName("status")
      .setDescription("Status of the contract (UFA/RFA).")
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
    const team        = interaction.options.getString("team");
    const player      = interaction.options.getString("player");
    const salary      = interaction.options.getString("salary");
    const years       = interaction.options.getString("years");
    const status      = interaction.options.getString("status");
    const clause      = interaction.options.getString("clause");
    const insider     = insiders[Math.floor(Math.random() * insiders.length)];
    const yearsString = years.endsWith("year") || years.endsWith("years") ? years : `${years} year${years > 1 ? "s" : ""}`;
    let clauseString  = "";

    if (clause === "No Trade Clause (NTC)") {
      clauseString = " The contract includes a no-trade clause (NTC).";
    } else if (clause === "No Movement Clause (NMC)") {
      clauseString = " The contract includes a no-movement clause (NMC).";
    }

    const channel = interaction.client.channels.cache.find((c) => c.name === "free-agent-tracker");
    await channel.send({
      content: `**${getTeamNameWithIcon(team, interaction.client.emojis.cache)}** signed ${status} **${player}** for **${salary}/${yearsString}**.${clauseString}`,
    });

    const confirmationInsiderStrings = [
      "I'm hearing that (Team) just signed (Status) (Player) for (Salary) AAV for the next (Years). This is a great signing for the team.",
      "Excited to be the first to break the news of (Team) signing (Status) (Player) for (Salary) AAV for the next (Years).",
      "My sources are telling me that (Team) just signed (Status) (Player) for (Salary) AAV for the next (Years).",
      "(Team) just announced that (Status) (Player) signed with the team for the next (Years). He will get paid (Salary) per year.",
      "(Player) just signed a new contract with (Team). He will get paid (Salary) per year for the next (Years). I'm sure the fans are excited!",
      "Looks like (Team) has made a big move by signing (Status) (Player) for (Salary) AAV for the next (Years). This should help solidify their lineup.",
      "Big news just broke that (Team) has signed (Status) (Player) for (Salary) AAV for the next (Years). This is a huge acquisition for the team.",
      "I can confirm that (Team) has signed (Status) (Player) for the next (Years) at (Salary) AAV. This is a great pickup for the team.",
      "Rumors are true, (Team) has signed (Status) (Player) for (Salary) AAV for the next (Years). This is a strong move for the team.",
      "Just heard the news that (Team) has signed (Status) (Player) for (Salary) AAV for the next (Years). This is a solid addition to the team's roster.",
      "I'm hearing that (Team) just signed (Status) (Player) for (Salary) AAV for the next (Years). This is a significant move for the team as they look to solidify their roster.",
      "Exciting news for (Team) as they have just signed (Status) (Player) for (Salary) AAV for the next (Years). This signing adds depth to the team's roster.",
      "My sources are telling me that (Team) just signed (Status) (Player) for (Salary) AAV for the next (Years). This signing is a major step for the team as they continue to build their roster.",
      "(Team) has just announced the signing of (Status) (Player) for the next (Years) at a salary of (Salary) AAV. This move solidifies the team's roster for the upcoming season.",
      "It's official, (Status) (Player) has just signed a new contract with (Team). He will be earning (Salary) AAV for the next (Years). This signing adds another piece to the team's puzzle.",
      "Big news in the hockey world as (Status) (Player) signs a new contract with (Team) for (Years) at (Salary) AAV. This acquisition adds depth and skill to the team's roster.",
      "Rumors are confirmed as (Team) officially announces the signing of (Status) (Player) for (Years) at (Salary) AAV. This is a great move for the team as they add a solid player to their line up.",
      "The hockey world is buzzing as (Status) (Player) signs a new contract with (Team) for (Years) at (Salary) AAV. This is a key acquisition for the team as they continue to build a competitive roster.",
      "Its official, (Status) (Player) joins (Team) on a (Years) year deal at (Salary) AAV. An important addition to the team's roster.",
      "The (Team) has made a significant move by signing (Status) (Player) for (Years) at (Salary) AAV, adding depth and skill to the team's line up.",
    ];

    let insiderString = confirmationInsiderStrings[Math.floor(Math.random() * confirmationInsiderStrings.length)]
      .replaceAll("(Team)", getTeamNameWithIcon(team, interaction.client.emojis.cache))
      .replaceAll("(Player)", player)
      .replaceAll("(Salary)", `${salary}`)
      .replaceAll("(Years)", yearsString)
      .replaceAll("(Status)", status);

    if (clauseString !== "") {
      insiderString += clauseString;
    }

    // Send the insider info if the contract is at least 3m AAV or 5 years
    if (parseInt(salary.replace("$", "").replaceAll(",", ""), 10) >= 3000000 || years >= 5) {
      await sendInsiderInfo(interaction, insider.name, `${insiderString}`);
      await interaction.editReply({
        content   : "Player signing announced.",
        ephemeral : true,
      });
    } else {
      await interaction.reply({
        content   : "Player signing announced.",
        ephemeral : true,
      });
    }
  },
};
