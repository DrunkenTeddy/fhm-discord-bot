const { EmbedBuilder } = require("@discordjs/builders");
const getScheduledSims = require("./getScheduledSims");

module.exports = async () => {
  const simulations = await getScheduledSims();

  if (simulations === null) {
    const titleEmbed = new EmbedBuilder().setTitle("Sim Schedule".toTitleCase());
    titleEmbed.setDescription("No simulations are scheduled.");

    return [titleEmbed];
  }

  const nextSim       = simulations[0];
  const scheduledSims = simulations.slice(1);

  const titleEmbed = new EmbedBuilder()
    .setTitle("Next Scheduled Sim".toTitleCase())
    .setDescription(`**${nextSim.RealDate} (${nextSim.Simmer})**\nSim Dates: ${nextSim.DateStart} - ${nextSim.DateEnd}${nextSim.Notes !== null && nextSim.Notes.trim() !== "None" ? `\n${nextSim.Notes}` : ""}`)
    .setColor(0x046c13);

  const scheduleEmbed = new EmbedBuilder().setTitle("Scheduled Sims".toTitleCase());

  if (scheduledSims.length === 0) {
    scheduleEmbed.setDescription("There are no other scheduled sims.");

    return [titleEmbed, scheduleEmbed];
  }

  scheduledSims.forEach((sim) => {
    scheduleEmbed.addFields({
      name  : `${sim.RealDate} (${sim.Simmer})`,
      value : `Sim Dates: ${sim.DateStart} - ${sim.DateEnd}${sim.Notes !== null && sim.Notes.trim() !== "None" ? `\n${sim.Notes}` : ""}`,
    });
  });

  return [titleEmbed, scheduleEmbed];
};
