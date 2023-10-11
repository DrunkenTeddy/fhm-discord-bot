const {
  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle,
} = require("discord.js");
const getLastScheduledSim = require("../../helpers/getLastScheduledSim");
const generateNextSimInfo = require("../../helpers/generateNextSimInfo");

module.exports = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("admin-sim-new")
    .setTitle("Schedule a New Sim".toTitleCase());

  const now             = new Date();
  const year            = now.getFullYear();
  const month           = (`0${now.getMonth() + 1}`).slice(-2);
  const day             = (`0${now.getDate()}`).slice(-2);
  const formattedDate   = `${year}-${month}-${day} 04:00`;
  const lastScheduleSim = await getLastScheduledSim();

  let nextSimInfo = {
    DateStart : "",
    DateEnd   : "",
    RealDate  : formattedDate,
    Simmer    : "Björn",
    Notes     : "None",
  };

  if (lastScheduleSim) {
    nextSimInfo = generateNextSimInfo(lastScheduleSim);
  }

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-real-date")
        .setLabel("Real Date (YYYY-MM-DD HH:MM Eastern)")
        .setValue(nextSimInfo.RealDate)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-date-start")
        .setLabel("Date Start (YYYY-MM-DD)")
        .setValue(nextSimInfo.DateStart)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-date-end")
        .setLabel("Date End (YYYY-MM-DD)")
        .setValue(nextSimInfo.DateEnd)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-simmer")
        .setLabel("Simmer")
        .setValue(nextSimInfo.Simmer)
        .setStyle(TextInputStyle.Short),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("admin-sim-new-notes")
        .setLabel("Notes")
        .setValue(nextSimInfo.Notes)
        .setStyle(TextInputStyle.Paragraph),
    ),
  );

  await interaction.showModal(modal);
};
