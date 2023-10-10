const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");
const getCurrentDate = require("../helpers/getCurrentDate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("awards-voting")
    .setDescription("Start the voting phase of the awards ceremony."),

  async execute(interaction) {
    await this.startAwardsVoting(interaction);
  },

  async startAwardsVoting(interaction) {
    const channel     = interaction.client.channels.cache.find((c) => c.name === "awards");
    const messages    = await channel.messages.fetch({ limit: 1 });
    const message     = messages.first();
    const embed       = message.embeds[0];
    const description = embed.description;
    const currentDate = await getCurrentDate();
    const currentYear = currentDate.split("-")[0];

    if (description.startsWith(`The ${currentYear} iNHL Awards are now open for nominations`) === false) {
      await interaction.reply({ content: "You must first start the nomination phase of the awards ceremony.", ephemeral: true });
      return;
    }

    embed.data.description = `The ${currentYear} iNHL Awards are now open for voting.\nYou can vote for players by clicking the button below.`;

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("awards-voting-start")
        .setLabel("Start Voting")
        .setStyle(ButtonStyle.Success),
    );

    // Update message with new description and buttons
    await message.edit({
      embeds     : [embed],
      components : [buttons],
    });

    await interaction.reply({ content: "Voting phase of awards ceremony started.", ephemeral: true });
  },
};
