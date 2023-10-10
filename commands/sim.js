const { SlashCommandBuilder } = require("discord.js");

const updateSimDates = require("../helpers/updateSimDates");
const validateDates  = require("../helpers/validateDates");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sim")
    .setDescription("Register a simulation.")
    .addStringOption((option) => option.setName("start")
      .setDescription("Start date of the simulated week (YYYY-MM-DD).")
      .setRequired(true))
    .addStringOption((option) => option.setName("end")
      .setDescription("End date of the simulated week (YYYY-MM-DD).")
      .setRequired(true)),

  async execute(interaction) {
    const start      = interaction.options.getString("start");
    const end        = interaction.options.getString("end");
    const datesValid = await validateDates(start, end);

    if (datesValid) {
      await interaction.deferReply({ ephemeral: true });

      await updateSimDates(start, end);

      await interaction.editReply({
        content   : "Sim saved to database.",
        ephemeral : true,
      });
    } else {
      await interaction.reply({
        content   : "Invalid dates.",
        ephemeral : true,
      });
    }
  },
};
