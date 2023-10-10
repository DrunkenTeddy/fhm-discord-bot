const { EmbedBuilder } = require("discord.js");

const getLinesForTeam     = require("./getLinesForTeam");
const getTeamIcon         = require("./getTeamIcon");
const getTeamInfo         = require("./getTeamInfo");
const getTeamNameWithIcon = require("./getTeamNameWithIcon");

module.exports = async (interaction, teamID) => {
  const teamInfo = await getTeamInfo({ teamID });
  const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;
  const lines    = await getLinesForTeam(teamID);

  const LW = `${lines["ES L1 LW"]}\n${lines["ES L2 LW"]}\n${lines["ES L3 LW"]}\n${lines["ES L4 LW"]}`;
  const C  = `${lines["ES L1 C"]}\n${lines["ES L2 C"]}\n${lines["ES L3 C"]}\n${lines["ES L4 C"]}`;
  const RW = `${lines["ES L1 RW"]}\n${lines["ES L2 RW"]}\n${lines["ES L3 RW"]}\n${lines["ES L4 RW"]}`;
  const LD = `${lines["ES L1 LD"]}\n${lines["ES L2 LD"]}\n${lines["ES L3 LD"]}`;
  const RD = `${lines["ES L1 RD"]}\n${lines["ES L2 RD"]}\n${lines["ES L3 RD"]}`;
  const G  = `${lines["Goalie 1"]}\n${lines["Goalie 2"]}`;

  const PP5on4LW = `${lines["PP5on4 L1 LW"]}\n${lines["PP5on4 L2 LW"]}`;
  const PP5on4C  = `${lines["PP5on4 L1 C"]}\n${lines["PP5on4 L2 C"]}`;
  const PP5on4RW = `${lines["PP5on4 L1 RW"]}\n${lines["PP5on4 L2 RW"]}`;
  const PP5on4LD = `${lines["PP5on4 L1 LD"]}\n${lines["PP5on4 L2 LD"]}`;
  const PP5on4RD = `${lines["PP5on4 L1 RD"]}\n${lines["PP5on4 L2 RD"]}`;

  const PP5on3LW = `${lines["PP5on3 L1 LW"]}\n${lines["PP5on3 L2 LW"]}`;
  const PP5on3C  = `${lines["PP5on3 L1 C"]}\n${lines["PP5on3 L2 C"]}`;
  const PP5on3RW = `${lines["PP5on3 L1 RW"]}\n${lines["PP5on3 L2 RW"]}`;
  const PP5on3LD = `${lines["PP5on3 L1 LD"]}\n${lines["PP5on3 L2 LD"]}`;
  const PP5on3RD = `${lines["PP5on3 L1 RD"]}\n${lines["PP5on3 L2 RD"]}`;

  const PP4on3F1 = `${lines["PP4on3 L1 F1"]}\n${lines["PP4on3 L2 F1"]}`;
  const PP4on3F2 = `${lines["PP4on3 L1 F2"]}\n${lines["PP4on3 L2 F2"]}`;
  const PP4on3LD = `${lines["PP4on3 L1 LD"]}\n${lines["PP4on3 L2 LD"]}`;
  const PP4on3RD = `${lines["PP4on3 L1 RD"]}\n${lines["PP4on3 L2 RD"]}`;

  const PK4on5F1 = `${lines["PK4on5 L1 F1"]}\n${lines["PK4on5 L2 F1"]}\n${lines["PK4on5 L3 F1"]}`;
  const PK4on5F2 = `${lines["PK4on5 L1 F2"]}\n${lines["PK4on5 L2 F2"]}\n${lines["PK4on5 L3 F2"]}`;
  const PK4on5LD = `${lines["PK4on5 L1 LD"]}\n${lines["PK4on5 L2 LD"]}\n${lines["PK4on5 L3 LD"]}`;
  const PK4on5RD = `${lines["PK4on5 L1 RD"]}\n${lines["PK4on5 L2 RD"]}\n${lines["PK4on5 L3 RD"]}`;

  const PK3on5F1 = `${lines["PK3on5 L1 F1"]}\n${lines["PK3on5 L2 F1"]}`;
  const PK3on5LD = `${lines["PK3on5 L1 LD"]}\n${lines["PK3on5 L2 LD"]}`;
  const PK3on5RD = `${lines["PK3on5 L1 RD"]}\n${lines["PK3on5 L2 RD"]}`;

  const L4on4F1 = `${lines["4on4 L1 F1"]}\n${lines["4on4 L2 F1"]}`;
  const L4on4F2 = `${lines["4on4 L1 F2"]}\n${lines["4on4 L2 F2"]}`;
  const L4on4LD = `${lines["4on4 L1 LD"]}\n${lines["4on4 L2 LD"]}`;
  const L4on4RD = `${lines["4on4 L1 RD"]}\n${lines["4on4 L2 RD"]}`;

  const L3on3F1 = `${lines["3on3 L1 F1"]}\n${lines["3on3 L2 F1"]}`;
  const L3on3LD = `${lines["3on3 L1 LD"]}\n${lines["3on3 L2 LD"]}`;
  const L3on3RD = `${lines["3on3 L1 RD"]}\n${lines["3on3 L2 RD"]}`;

  const S = `1. ${lines["Shootout 1"]}\n2. ${lines["Shootout 2"]}\n3. ${lines["Shootout 3"]}\n4. ${lines["Shootout 4"]}\n5. ${lines["Shootout 5"]}`;

  const EA = `1. ${lines["Extra Attacker 1"]}\n2. ${lines["Extra Attacker 2"]}`;

  const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);
  const teamIcon         = getTeamIcon(teamName, interaction.client.emojis.cache);

  const ES = new EmbedBuilder().setTitle(teamNameWithIcon);
  ES.addFields(
    { name: "LW", value: LW, inline: true },
    { name: "C", value: C, inline: true },
    { name: "RW", value: RW, inline: true },
    { name: "LD", value: LD, inline: true },
    { name: "RD", value: RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "G", value: G },
  );

  const PP5on4 = new EmbedBuilder().setTitle(`${teamIcon} Powerplay - 5 on 4`);
  PP5on4.addFields(
    { name: "LW", value: PP5on4LW, inline: true },
    { name: "C", value: PP5on4C, inline: true },
    { name: "RW", value: PP5on4RW, inline: true },
    { name: "LD", value: PP5on4LD, inline: true },
    { name: "RD", value: PP5on4RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const PP5on3 = new EmbedBuilder().setTitle(`${teamIcon} Powerplay - 5 on 3`);
  PP5on3.addFields(
    { name: "LW", value: PP5on3LW, inline: true },
    { name: "C", value: PP5on3C, inline: true },
    { name: "RW", value: PP5on3RW, inline: true },
    { name: "LD", value: PP5on3LD, inline: true },
    { name: "RD", value: PP5on3RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const PP4on3 = new EmbedBuilder().setTitle(`${teamIcon} Powerplay - 4 on 3`);
  PP4on3.addFields(
    { name: "F1", value: PP4on3F1, inline: true },
    { name: "F2", value: PP4on3F2, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "LD", value: PP4on3LD, inline: true },
    { name: "RD", value: PP4on3RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const PK4on5 = new EmbedBuilder().setTitle(`${teamIcon} Penalty Kill - 4 on 5`);
  PK4on5.addFields(
    { name: "F1", value: PK4on5F1, inline: true },
    { name: "F2", value: PK4on5F2, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "LD", value: PK4on5LD, inline: true },
    { name: "RD", value: PK4on5RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const PK3on5 = new EmbedBuilder().setTitle(`${teamIcon} Penalty Kill - 3 on 5`);
  PK3on5.addFields(
    { name: "F1", value: PK3on5F1, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "LD", value: PK3on5LD, inline: true },
    { name: "RD", value: PK3on5RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const L4on4 = new EmbedBuilder().setTitle(`${teamIcon} 4 on 4`);
  L4on4.addFields(
    { name: "F1", value: L4on4F1, inline: true },
    { name: "F2", value: L4on4F2, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "LD", value: L4on4LD, inline: true },
    { name: "RD", value: L4on4RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const L3on3 = new EmbedBuilder().setTitle(`${teamIcon} 3 on 3`);
  L3on3.addFields(
    { name: "F1", value: L3on3F1, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
    { name: "LD", value: L3on3LD, inline: true },
    { name: "RD", value: L3on3RD, inline: true },
    { name: "\u200b", value: "\u200b", inline: true },
  );

  const EF = new EmbedBuilder().setTitle(`${teamIcon} Extra Lines`);
  EF.addFields(
    { name: "Shootout", value: S },
    { name: "Extra Attackers", value: EA },
  );

  const embeds = [ES, PP5on4, PP5on3, PP4on3, PK4on5, PK3on5, L4on4, L3on3, EF];

  return embeds;
};
