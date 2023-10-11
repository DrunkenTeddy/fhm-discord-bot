const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
} = require("discord.js");

const getStandings           = require("../helpers/getStandings");
const getTeamInfo            = require("../helpers/getTeamInfo");
const getTeamNameWithIcon    = require("../helpers/getTeamNameWithIcon");
const getTeamRecord          = require("../helpers/getTeamRecord");
const sortTeams              = require("../helpers/sortTeams");
const getScheduledSims       = require("../helpers/getScheduledSims");
const getTeamFileStatus      = require("../helpers/getTeamFileStatus");
const getConferenceStandings = require("../helpers/getConferenceStandings");
//const getStatLeadersForTeam  = require("../helpers/getStatLeadersForTeam");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gm")
    .setDescription("Open your GM Hub."),

  async execute(interaction) {
    await this.showGMHub(interaction, true);
  },

  async showGMHub(interaction, reply = false) {
    const discordID = interaction.user.id;
    const teamInfo  = await getTeamInfo({ discordID });

    if (!teamInfo) {
      await interaction.reply({
        content   : "You are not currently registered as a GM.",
        ephemeral : true,
      });
      return;
    }

    const teamID                    = teamInfo.TeamID;
    const teamName                  = `${teamInfo.Name} ${teamInfo.Nickname}`;
    const teamNameWithIcon          = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
    const teamRecord                = await getTeamRecord({ teamID });
    const simulations               = await getScheduledSims();
    const standings                 = await getStandings();
    const conferenceStandings       = await getConferenceStandings(teamInfo.ConferenceID);
    const sortedStandings           = standings.sort(sortTeams);
    const sortedConferenceStandings = conferenceStandings.sort(sortTeams);
    const teamFileStatus            = getTeamFileStatus(teamID);
    //const teamLeaders               = await getStatLeadersForTeam(teamID);
    //const goalLeadersString         = teamLeaders.goal.slice(0, 3).map((g) => `**${g.G}**-${g["First Name"]} ${g["Last Name"]}`).join("\n");
    //const pointLeadersString        = teamLeaders.point.slice(0, 3).map((p) => `**${p.P}**-${p["First Name"]} ${p["Last Name"]}`).join("\n");

    const displayedTeams = 2;

    const standingsTeamIndex = sortedStandings.findIndex((s) => s.TeamID === teamID);
    const startIndex         = standingsTeamIndex - displayedTeams < 0 ? 0 : standingsTeamIndex - displayedTeams;
    const endIndex           = standingsTeamIndex + displayedTeams + 1 > sortedStandings.length ? sortedStandings.length : standingsTeamIndex + displayedTeams + 1;
    const standingsSlice     = sortedStandings.slice(startIndex, endIndex);

    const conferenceStandingsTeamIndex = sortedConferenceStandings.findIndex((s) => s.TeamID === teamID);
    const conferenceStartIndex         = conferenceStandingsTeamIndex - displayedTeams < 0 ? 0 : conferenceStandingsTeamIndex - displayedTeams;
    const conferenceEndIndex           = conferenceStandingsTeamIndex + displayedTeams + 1 > sortedConferenceStandings.length ? sortedConferenceStandings.length : conferenceStandingsTeamIndex + displayedTeams + 1;
    const conferenceStandingsSlice     = sortedConferenceStandings.slice(conferenceStartIndex, conferenceEndIndex);

    const teamStatsEmbed = new EmbedBuilder()
      .setColor(teamInfo.PrimaryColor)
      .setTitle(teamNameWithIcon);

    teamStatsEmbed.addFields({
      name   : "Team Record",
      value  : `${teamRecord.Wins}-${teamRecord.Losses}-${teamRecord.OTL + teamRecord.SOL} (${teamRecord.Points} pts)`,
      inline : true,
    },/* {
      name   : "Goal Leaders",
      value  : goalLeadersString,
      inline : true,
    }, {
      name   : "Point Leaders",
      value  : pointLeadersString,
      inline : true,
    }*/);

    const nextSimEmbed = new EmbedBuilder()
      .setColor(teamInfo.PrimaryColor)
      .setTitle(" ");

    if (simulations !== null && simulations.length > 0) {
      const nextSim          = simulations[0];
      const nextSimLocale    = nextSim.RealDate.toLocaleString("en-US", { timeZone: "America/New_York", format: "short" });
      const nextSimCountdown = new Date(nextSim.RealDate) - new Date();
      const nextSimHours     = Math.floor(nextSimCountdown / 1000 / 60 / 60);

      nextSimEmbed.addFields({
        name   : "Next Sim",
        value  : `${nextSimLocale}\n(in ${nextSimHours} hours)`,
        inline : true,
      }, {
        name   : "Next Sim Start",
        value  : `${nextSim.DateStart}`,
        inline : true,
      }, {
        name   : "Next Sim End",
        value  : `${nextSim.DateEnd}`,
        inline : true,
      });

      if (nextSim.Notes !== "None" && nextSim.Notes !== "") {
        nextSimEmbed.addFields({
          name   : "Notes",
          value  : `${nextSim.Notes}`,
          inline : false,
        });
      }
    } else {
      nextSimEmbed.setDescription("No scheduled sims");
    }

    const teamFileEmbed = new EmbedBuilder()
      .setColor(teamFileStatus ? 0x046c13 : 0xed1c24)
      .setTitle("Team File Status")
      .setDescription(teamFileStatus ? "You team file is uploaded and ready for the next sim." : "You have not uploaded your team file for the next sim.");

    const standingsEmbed = new EmbedBuilder()
      .setColor(teamInfo.PrimaryColor)
      .setTitle(" ")
      .setDescription("**League Standings**");

    for (let i = 0; i < standingsSlice.length; i += 1) {
      const team            = standingsSlice[i];
      const teamPosition    = sortedStandings.findIndex((s) => s.TeamID === team.TeamID) + 1;
      const currentTeamInfo = await getTeamInfo({ teamID: team.TeamID });
      const currentTeamName = getTeamNameWithIcon(`${currentTeamInfo.Name} ${currentTeamInfo.Nickname}`, interaction.client.emojis.cache);

      standingsEmbed.addFields({
        name  : `${teamPosition}. ${currentTeamName} (${team.Points} pts)`,
        value : `Record: ${team.Wins}-${team.Losses}-${team.OTL + team.SOL} (${team.Wins + team.Losses + team.OTL + team.SOL} GP)`,
      });
    }

    const conferenceStandingsEmbed = new EmbedBuilder()
      .setColor(teamInfo.PrimaryColor)
      .setTitle(" ")
      .setDescription("**Conference Standings**");

    for (let i = 0; i < conferenceStandingsSlice.length; i += 1) {
      const team            = conferenceStandingsSlice[i];
      const teamPosition    = sortedConferenceStandings.findIndex((s) => s.TeamID === team.TeamID) + 1;
      const currentTeamInfo = await getTeamInfo({ teamID: team.TeamID });
      const currentTeamName = getTeamNameWithIcon(`${currentTeamInfo.Name} ${currentTeamInfo.Nickname}`, interaction.client.emojis.cache);

      conferenceStandingsEmbed.addFields({
        name  : `${teamPosition}. ${currentTeamName} (${team.Points} pts)`,
        value : `Record: ${team.Wins}-${team.Losses}-${team.OTL + team.SOL} (${team.Wins + team.Losses + team.OTL + team.SOL} GP)`,
      });
    }

    const successButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sim-recap-team-report-card")
        .setLabel("Sim Report Card".toTitleCase())
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("view-sim-schedule")
        .setLabel("Sim Schedule".toTitleCase())
        .setStyle(ButtonStyle.Success),
      /*new ButtonBuilder()
        .setCustomId("view-team-stat-leaders")
        .setLabel("Team Stat Leaders".toTitleCase())
        .setStyle(ButtonStyle.Success),*/
      new ButtonBuilder()
        .setCustomId("view-team-lines")
        .setLabel("View My Lines".toTitleCase())
        .setStyle(ButtonStyle.Success),
    );

    const primaryButtons = new ActionRowBuilder().addComponents(
      /*new ButtonBuilder()
        .setCustomId("trade-block-open")
        .setLabel("Update my Trade Block".toTitleCase())
        .setStyle(ButtonStyle.Primary),*/
      new ButtonBuilder()
        .setCustomId("send-new-insider-info")
        .setLabel("Send Insider Info".toTitleCase())
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("send-new-trade")
        .setLabel("New Trade".toTitleCase())
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("prediction-new")
        .setLabel("New Prediction".toTitleCase())
        .setStyle(ButtonStyle.Primary),
    );

    const secondaryButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("notification-settings-open")
        .setLabel("Notification Settings".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("help-discord-bot-update")
        .setLabel("Discord Bot Help".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("send-test-dm")
        .setLabel("Send Test DM".toTitleCase())
        .setStyle(ButtonStyle.Secondary),
    );

    if (reply) {
      await interaction.reply({
        content    : `You are currently registered as the GM of the **${teamNameWithIcon}**`,
        embeds     : [teamStatsEmbed, nextSimEmbed, standingsEmbed, conferenceStandingsEmbed, teamFileEmbed],
        components : [successButtons, primaryButtons, secondaryButtons],
        ephemeral  : true,
      });
    } else {
      await interaction.update({
        content    : `You are currently registered as the GM of the **${teamNameWithIcon}**`,
        embeds     : [teamStatsEmbed, nextSimEmbed, standingsEmbed, conferenceStandingsEmbed, teamFileEmbed],
        components : [successButtons, primaryButtons, secondaryButtons],
      });
    }
  },
};
