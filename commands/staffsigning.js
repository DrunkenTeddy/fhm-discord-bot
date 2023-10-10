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
    .setName("staffsigning")
    .setDescription("Send a new staff signing to the review board.")
    .addStringOption((option) => option.setName("team")
      .setDescription("Team signing the staff member.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("name")
      .setDescription("Name of the staff member being signed.")
      .setRequired(true))
    .addStringOption((option) => option.setName("staffposition")
      .setDescription("Position of the staff member.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("staffsalary")
      .setDescription("Salary of the staff member.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("years")
      .setDescription("Years of the contract.")
      .setRequired(true)
      .setAutocomplete(true))
    .addStringOption((option) => option.setName("firedstaff")
      .setDescription("Staff to fire to make room for the new signing.")),

  async autocomplete(interaction) {
    await autocomplete(interaction);
  },

  async execute(interaction) {
    const team        = interaction.options.getString("team");
    const name        = interaction.options.getString("name");
    const position    = interaction.options.getString("staffposition");
    const salary      = interaction.options.getString("staffsalary");
    const years       = interaction.options.getString("years");
    const fireStaff   = interaction.options.getString("firedstaff");
    const yearsString = years.endsWith("year") || years.endsWith("years") ? years : `${years} year${years > 1 ? "s" : ""}`;

    let signingString = `**${getTeamNameWithIcon(team, interaction.client.emojis.cache)}** wants to sign **${name} (${position})** for **${salary}/${yearsString}**.`;

    if (fireStaff) {
      signingString += ` They will fire **${fireStaff}** to make room.`;
    }

    await interaction.reply({
      content   : "Staff signing sent to the review board.",
      ephemeral : true,
    });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("staff-signing-accept")
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("staff-signing-reject")
          .setLabel("Reject")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("staff-signing-edit")
          .setLabel("Edit")
          .setStyle(ButtonStyle.Secondary),
      );

    const channel = interaction.client.channels.cache.find((c) => c.name === "contract-review-board");
    await channel.send({
      content    : `New staff signing request from ${interaction.user.username}:\n\n${signingString}`,
      components : [buttons],
    });
  },
};
