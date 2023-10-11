module.exports = async (interaction) => {
  const channel     = interaction.client.channels.cache.find((c) => c.name === "staff-signings");
  const signingInfo = interaction.message.content.split("\n").slice(1).join("\n").replace("wants to ", "");
  await channel.send({ content: `${signingInfo}` });

  await interaction.message.delete();
};
