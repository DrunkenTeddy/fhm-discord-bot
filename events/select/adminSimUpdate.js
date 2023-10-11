const {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");

const getSimInfo = require("../../helpers/getSimInfo");

module.exports = async (interaction) => {
  const simID   = interaction.values[0];
  const simInfo = await getSimInfo(simID);

  const modal = new ModalBuilder()
    .setCustomId(`admin-sim-update-${simID}`)
    .setTitle("Update Scheduled Sim".toTitleCase());

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-real-date")
        .setLabel("Real Date (YYYY-MM-DD HH:MM Eastern)")
        .setValue(simInfo.RealDate)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-date-start")
        .setLabel("Date Start (YYYY-MM-DD)")
        .setValue(simInfo.DateStart)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-date-end")
        .setLabel("Date End (YYYY-MM-DD)")
        .setValue(simInfo.DateEnd)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-simmer")
        .setLabel("Simmer")
        .setValue(simInfo.Simmer)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-notes")
        .setLabel("Notes")
        .setValue(simInfo.Notes)
        .setStyle(TextInputStyle.Paragraph),
    ),
  );

  await interaction.showModal(modal);
};
