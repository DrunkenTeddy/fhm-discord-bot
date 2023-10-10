const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} = require("discord.js");

const getCurrentDate = require("../helpers/getCurrentDate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("awards-nominations")
    .setDescription("Start the nomination phase of the awards ceremony."),

  async execute(interaction) {
    await this.startAwardsCeremony(interaction);
  },

  async startAwardsCeremony(interaction) {
    const currentDate = await getCurrentDate();
    const currentYear = currentDate.split("-")[0];

    const awardsCeremonyEmbed = new EmbedBuilder()
      .setTitle(`🏆\n\n${currentYear} iNHL Awards`)
      .setDescription(`The ${currentYear} iNHL Awards are now open for nominations.\nYou can nominate players for awards by clicking the button below.`)
      .setColor(0xF2A433);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("awards-nomination-start")
        .setLabel("Nominate Players")
        .setStyle(ButtonStyle.Success),
    );

    const channel = interaction.client.channels.cache.find((c) => c.name === "awards");
    await channel.send({ embeds: [awardsCeremonyEmbed], components: [buttons] });

    await interaction.reply({ content: "Nomination phase of awards ceremony started.", ephemeral: true });
  },
};
