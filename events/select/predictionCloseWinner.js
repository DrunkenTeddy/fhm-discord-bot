module.exports = async (interaction) => {
  const messageID  = interaction.customId.split("-").slice(-1)[0];
  const message    = await interaction.channel.messages.fetch(messageID);
  const embed      = message.embeds[0];
  const embedText  = embed.data.description;
  const embedLines = embedText.split("\n").filter((line) => line.trim() !== "" && !line.includes("Make your prediction below"));
  const winner     = interaction.values[0];

  embed.data.description = embedLines.map((line) => {
    if (line === winner) { return `**${line}** ✅`; }
    return line;
  }).join("\n");

  const reaction  = message.reactions.cache.find((r) => r.emoji.name === winner.split(" ")[0]);
  const users     = await reaction.users.fetch();
  const realUsers = users.filter((user) => !user.bot);

  const winnersString = `**Prediction winners:** ${realUsers.size === 0 ? "No winners." : realUsers.map((user) => `<@${user.id}>`).join(", ")}`;

  embed.data.description += `\n\n${winnersString}`;

  await message.reactions.removeAll();
  await message.edit({ embeds: [embed] });

  await interaction.update({
    content    : "Prediction closed.",
    components : [],
    ephemeral  : true,
  });
};
