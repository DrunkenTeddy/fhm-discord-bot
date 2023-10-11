const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("@discordjs/builders");
const { TextInputStyle }                                   = require("discord.js");

module.exports = async (interaction) => {
  const messageID    = interaction.message.id;
  const signingInfo  = interaction.message.content.split("\n").slice(1).join("\n").replace("wants to ", "");
  const staffName    = signingInfo.split("sign")[1].trim().split("for")[0].replaceAll("**", "").trim();
  const salaryString = signingInfo.split(" for ")[1].trim().replaceAll("**", "").trim();
  const salary       = salaryString.split("/")[0].trim();
  const years        = salaryString.split("/")[1].replace(".", "").trim();

  const modal = new ModalBuilder()
    .setCustomId(`staff-signing-edit-${messageID}`)
    .setTitle(`${staffName} Contract Extension`);

  const salaryInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("salary")
      .setLabel("Salary:")
      .setValue(salary)
      .setStyle(TextInputStyle.Short),
  );

  const yearsInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("years")
      .setLabel("Years:")
      .setValue(years)
      .setStyle(TextInputStyle.Short),
  );

  modal.addComponents(salaryInput, yearsInput);

  await interaction.showModal(modal);
};
