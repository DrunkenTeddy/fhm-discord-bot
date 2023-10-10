const {
  SlashCommandBuilder, EmbedBuilder,
} = require("discord.js");
const getDiscordIds       = require("../helpers/getDiscordIds");
const getTeamInfo         = require("../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../helpers/getTeamNameWithIcon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listgm")
    .setDescription("List every GM and their team."),

  async execute(interaction) {
    await this.listGMs(interaction);
  },

  async listGMs(interaction) {
    const discordIDs = await getDiscordIds();

    const gmListString = await discordIDs.reduce(async (acc, discordInfo) => {
      const teamInfo = await getTeamInfo({ discordID: discordInfo.DiscordID });

      const teamName         = `${teamInfo.Name} ${teamInfo.Nickname}`;
      const teamNameWithLogo = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
      const string           = `${teamNameWithLogo}: <@${discordInfo.DiscordID}>\n`;

      return await acc + string;
    }, Promise.resolve(""));

    const gmListEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("GM List")
      .setDescription(gmListString);

    await interaction.reply({
      ephemeral : true,
      embeds    : [gmListEmbed],
    });
  },
};
