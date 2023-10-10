const { EmbedBuilder } = require("@discordjs/builders");
const getScheduledSims = require("./getScheduledSims");

module.exports = async () => {
  const simulations = await getScheduledSims();

  const progressEmbed = new EmbedBuilder().setTitle("Sim Schedule".toTitleCase());

  if (simulations === null) {
    progressEmbed.setDescription("No simulations are scheduled.");
  } else {
    simulations.forEach((sim) => {
      progressEmbed.addFields({
        name  : `${sim.RealDate} (${sim.Simmer})`,
        value : `Sim Dates: ${sim.DateStart} - ${sim.DateEnd}${sim.Notes !== null && sim.Notes.trim() !== "None" ? `\n${sim.Notes}` : ""}`,
      });
    });
  }

  return progressEmbed;
};
