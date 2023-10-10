const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");

const draftProfiles = require("../static_data/draftProfiles.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Open admin panel."),

  async execute(interaction) {
    await this.showAdminPanel(interaction, true);
  },

  async showAdminPanel(interaction, reply = false) {
    const primaryButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin-register-gm")
        .setLabel("Register New GM".toTitleCase())
        .setStyle(ButtonStyle.Success),
    );

    const secondaryButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin-sim-schedule")
        .setLabel("Manage Sims".toTitleCase())
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("admin-league-announcement")
        .setLabel("New League Announcement".toTitleCase())
        .setStyle(ButtonStyle.Primary),
    );

    const awardsButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin-awards-start-nomination")
        .setLabel("Start Awards Nomination Phase".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin-awards-start-voting")
        .setLabel("Start Awards Voting Phase".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin-awards-end-voting")
        .setLabel("Start Awards Ceremony".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    const draftButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin-draft-start")
        .setLabel("Start New Draft".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin-draft-end")
        .setLabel("End Draft".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin-draft-rollback")
        .setLabel("Rollback Draft Position".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    const mockDraftButtons = new ActionRowBuilder();

    for (let i = 0; i < draftProfiles.length; i++) {
      mockDraftButtons.addComponents(
        new ButtonBuilder()
          .setCustomId(`admin-draft-mock-publish-${i}`)
          .setLabel(`Publish ${draftProfiles[i].name} Draft Ranking`)
          .setStyle(ButtonStyle.Secondary),
      );
    }

    // const testButtons = new ActionRowBuilder().addComponents(
    //   new ButtonBuilder()
    //     .setCustomId("test")
    //     .setLabel("Test Button (For Debug)".toTitleCase())
    //     .setStyle(ButtonStyle.Secondary),
    // );

    const message = {
      embeds     : [],
      components : [primaryButtons, secondaryButtons, awardsButtons, mockDraftButtons, draftButtons],
      ephemeral  : true,
    };

    if (reply) {
      await interaction.reply(message);
    } else {
      await interaction.update(message);
    }
  },
};
