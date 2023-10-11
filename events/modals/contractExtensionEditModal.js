module.exports = async (interaction) => {
  const messageID = interaction.customId.split("-")[3];
  const salary    = interaction.fields.getTextInputValue("salary");
  const years     = interaction.fields.getTextInputValue("years");

  const channel = interaction.client.channels.cache.find((c) => c.name === "contract-review-board");
  const message = await channel.messages.fetch(messageID);

  const messageLines     = message.content.split("\n");
  const salaryLine       = messageLines.find((line) => line.includes("wants to extend"));
  const editedSalaryLine = `${salaryLine.split("for")[0].trim()} for **${salary}**/**${years}**.`;

  await interaction.update({
    content: message.content.replace(salaryLine, editedSalaryLine),
  });
};
