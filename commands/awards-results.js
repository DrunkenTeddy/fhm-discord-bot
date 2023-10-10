const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const awardsGetFinalists   = require("../helpers/awardsGetFinalists");
const awardsGetWinners     = require("../helpers/awardsGetWinners");
const getAwards            = require("../helpers/getAwards");
const getCurrentDate       = require("../helpers/getCurrentDate");
const getGoalieStats       = require("../helpers/getGoalieStats");
const getGoalieStatsString = require("../helpers/getGoalieStatsString");
const getPlayerInfo        = require("../helpers/getPlayerInfo");
const getPlayerStats       = require("../helpers/getPlayerStats");
const getPlayerStatsString = require("../helpers/getPlayerStatsString");
const getTeamIcon          = require("../helpers/getTeamIcon");
const getTeamInfo          = require("../helpers/getTeamInfo");
const getTeamRecord        = require("../helpers/getTeamRecord");
const getTeamRecordString  = require("../helpers/getTeamRecordString");

const announcementDelay = 1;

const getFinalistsString = async (interaction, currentYear, awardID) => {
  const finalists = await awardsGetFinalists(currentYear, awardID);

  let finalistString = "";

  for (const finalist of finalists) {
    if (finalist.PlayerID) {
      const playerID       = finalist.PlayerID;
      const playerInfo     = await getPlayerInfo({ playerID });
      const playerName     = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;
      const playerTeamInfo = await getTeamInfo({ teamID: playerInfo.TeamID });
      const playerTeamName = `${playerTeamInfo.Name} ${playerTeamInfo.Nickname}`;
      const playerTeamIcon = await getTeamIcon(playerTeamName, interaction.client.emojis.cache);

      finalistString += `${playerTeamIcon} ${playerName}\n`;
    } else {
      const finalistTeamInfo = await getTeamInfo({ discordID: finalist.DiscordID });
      if (finalistTeamInfo) {
        const finalistTeamName = `${finalistTeamInfo.Name} ${finalistTeamInfo.Nickname}`;
        const finalistTeamIcon = await getTeamIcon(finalistTeamName, interaction.client.emojis.cache);

        finalistString += `${finalistTeamIcon} ${finalistTeamName}\n`;
      }
    }
  }

  return finalistString;
};

const generatePlayerAwardText = (currentYear, playerName, awardName, stats) => {
  // let text = `${awardName}: 1 (2023)\nAward Nominations: 1 (2023)\n\n`;
  let text = "";

  if (stats.GP > 0) {
    if (stats.GP >= 70) { text += `He played in a total of **${stats.GP}** games. `; }
    else { text += `He played in a total of **${stats.GP}** games, demonstrating his commitment to the team. `; }
  }
  if (stats.G > 0) {
    if (stats.G >= 15) { text += `He scored a total of **${stats.G}** goals, demonstrating his offensive prowess. `; }
    else { text += `He scored a total of **${stats.G}** goals, showcasing his versatility in different areas of the game. `; }
  }
  if (stats.A > 0) {
    if (stats.A >= 40) { text += `He had **${stats.A}** assists, showcasing his playmaking ability. `; }
    else { text += `He had **${stats.A}** assists, demonstrating his unselfish play and ability to contribute in different ways. `; }
  }
  if (stats.PlusMinus > 0) {
    if (stats.PlusMinus >= 20) { text += `His plus-minus of **${stats.PlusMinus}** is a testament to his impact on the game. `; }
    else { text += `His plus-minus of **${stats.PlusMinus}** shows his consistency and dependability. `; }
  }
  if (stats.PIM > 0) {
    if (stats.PIM >= 60) { text += `He contributed **${stats.PIM}** penalty minutes, showing his physicality and willingness to defend his teammates. `; }
    else { text += `He contributed **${stats.PIM}** penalty minutes, displaying his discipline and focus on the game. `; }
  }
  if (stats.PPG > 0) {
    if (stats.PPG >= 3) { text += `He had **${stats.PPG}** power-play goals, highlighting his ability to take advantage of special teams opportunities. `; }
    else { text += `He had **${stats.PPG}** power-play goals, demonstrating his ability to contribute in all situations. `; }
  }
  if (stats.SHG > 0) {
    if (stats.SHG >= 2) { text += `He scored **${stats.SHG}** short-handed goals, demonstrating his versatility and skill. `; }
    else { text += `He scored **${stats.SHG}** short-handed goals, showing his defensive awareness and ability to contribute in all situations. `; }
  }
  if (stats.GWG > 0) {
    if (stats.GWG >= 3) { text += `He scored **${stats.GWG}** game-winning goals, showcasing his clutch performance in tight situations. `; }
    else { text += `He scored **${stats.GWG}** game-winning goals, demonstrating his ability to rise to the occasion and contribute in critical moments. `; }
  }
  if (stats.SOG > 0) {
    if (stats.SOG >= 250) { text += `He had **${stats.SOG}** shots on goal, showing his aggressiveness and offensive threat. `; }
    else { text += `He had **${stats.SOG}** shots on goal, demonstrating his ability to generate scoring opportunities for himself and his teammates. `; }
  }

  return text;
};

const generateGoalieAwardText = (playerName, awardName, stats) => {
  // let text = `${awardName}: 1 (2023)\nAward Nominations: 1 (2023)\n\n`;
  let text = "";

  if (stats.GP >= 60) { text += `He played in a total of **${stats.GP} games**. `; }
  else { text += `He played in a total of **${stats.GP} games**. `; }
  if (stats.Wins >= 30) { text += `He had **${stats.Wins} wins**, showcasing his ability to lead his team to victory. `; }
  else { text += `He had **${stats.Wins} wins**. `; }
  if (stats.Minutes >= 6000) { text += `He played a total of **${stats.Minutes} minutes**, demonstrating his durability and reliability. `; }
  else { text += `He played a total of **${stats.Minutes} minutes**. `; }
  if (stats.Saves >= 1500) { text += `He made **${stats.Saves} saves**, highlighting his quick reflexes and shot-stopping ability. `; }
  else { text += `He made **${stats.Saves} saves**. `; }
  if (stats.GoalsAgainst <= 150) { text += `He allowed only **${stats.GoalsAgainst} goals**, showing his ability to limit the opposing team's scoring opportunities. `; }
  else { text += `He allowed **${stats.GoalsAgainst} goals**. `; }
  if (stats.GAA <= 2.3) { text += `His goals against average of **${stats.GAA}** was one of the best in the league. `; }
  else { text += `His goals against average was **${stats.GAA}**. `; }
  if (stats.Shutouts > 0) {
    if (stats.Shutouts >= 5) { text += `He had **${stats.Shutouts} shutouts**, showcasing his ability to preserve a blank score sheet. `; }
    else { text += `He had **${stats.Shutouts} shutouts**. `; }
  }
  if (parseFloat(stats.SavePct) >= 0.910) { text += `His save percentage of **${stats.SavePct}** was among the league leaders. `; }
  else { text += `His save percentage was **${stats.SavePct}**. `; }

  return text;
};

const generateTeamAwardText = (teamName, awardName, stats) => {
  // let text = `${awardName}: 1 (2023)\nAward Nominations: 1 (2023)\n\n`;
  let text = "";

  if (stats.Wins >= 50) { text += `They had an impressive **${stats.Wins} wins**, showcasing their skill and determination on the ice. `; }
  else { text += `They had a solid season with **${stats.Wins} wins**. `; }
  if (stats.Points >= 100) { text += `They earned a total of **${stats.Points} points**, a testament to their hard work and success throughout the season. `; }
  else { text += `They earned a total of **${stats.Points} points**, demonstrating their competitiveness and determination. `; }
  if (stats.GF >= 270) { text += `They had a high-powered offense, scoring a total of **${stats.GF} goals**. `; }
  else { text += `They had a solid offensive performance, scoring a total of **${stats.GF} goals**. `; }
  if (stats.GA <= 190) { text += `They played strong defense, allowing only **${stats.GA} goals**. `; }
  else { text += `They had a solid defensive performance, allowing a total of **${stats.GA} goals**. `; }
  if (parseFloat(stats.PCT) >= 0.700) { text += `Their winning percentage of **${stats.PCT}** was a testament to their success throughout the season. `; }
  else { text += `Their winning percentage of **${stats.PCT}** demonstrates their competitiveness and determination. `; }

  return text;
};

const announcePlayerAward = async (interaction, award, winners) => {
  const currentDate       = await getCurrentDate();
  const currentYear       = currentDate.split("-")[0];
  const awardID           = award.ID;
  const winner            = winners[0];
  const winnerPlayerID    = winner.PlayerID;
  const winnerPlayerInfo  = await getPlayerInfo({ playerID: winnerPlayerID });
  const winnerName        = `${winnerPlayerInfo["First Name"]} ${winnerPlayerInfo["Last Name"]}`;
  const winnerTeamID      = winnerPlayerInfo.TeamID;
  const winnerTeamInfo    = await getTeamInfo({ teamID: winnerTeamID });
  const winnerTeamName    = `${winnerTeamInfo.Name} ${winnerTeamInfo.Nickname}`;
  const winnerTeamIcon    = await getTeamIcon(winnerTeamName, interaction.client.emojis.cache);
  const winnerPlayerStats = await getPlayerStats({ playerID: winnerPlayerID });
  const finalistString    = await getFinalistsString(interaction, currentYear, awardID);
  const totalVotes        = winners.reduce((total, finalist) => total + finalist.TotalVotes, 0);
  const winnerVotes       = winner.TotalVotes;
  const votesString       = `Votes: ${winnerVotes} (${Math.round((winnerVotes / totalVotes) * 100)}%)`;

  let awardText = "";

  if (winnerPlayerStats) {
    awardText  = generatePlayerAwardText(currentYear, winnerName, award.Name, winnerPlayerStats);
    awardText += `\n\n**${getPlayerStatsString(winnerPlayerStats)}**`;
    awardText += `\n${getPlayerStatsString(winnerPlayerStats, true)}`;
  } else {
    const winnerGoalieStats = await getGoalieStats({ playerID: winnerPlayerID });
    if (winnerGoalieStats) {
      awardText  = generateGoalieAwardText(winnerName, award.Name, winnerGoalieStats);
      awardText += `\n\n**${getGoalieStatsString(winnerGoalieStats)}**`;
      awardText += `\n${getGoalieStatsString(winnerGoalieStats, true)}`;
    }
  }

  const teaserEmbed = new EmbedBuilder()
    .setTitle(`The winner will be announced in ${announcementDelay} minutes.`)
    .setDescription(`**Finalists:**\n${finalistString}`)
    .setColor(0xF2A433)
    .setAuthor({ name: `${award.Name} - ${award.Description} (${currentYear})` });

  const winnerEmbed = new EmbedBuilder()
    .setTitle(`${winnerTeamIcon} ${winnerName}`)
    .setDescription(awardText)
    .setColor(parseInt(winnerTeamInfo.PrimaryColor.replace("#", "0x"), 16))
    .setFooter({ text: votesString })
    .setAuthor({ name: `${award.Name} - ${award.Description} (${currentYear})` });

  const channel = interaction.client.channels.cache.find((c) => c.name === "awards");
  const message = await channel.send({ embeds: [teaserEmbed] });

  for (let i = announcementDelay; i > 0; i--) {
    setTimeout(async () => {
      const embed      = message.embeds[0];
      embed.data.title = `The winner will be announced in ${i} minutes.`;
      await message.edit({ embeds: [embed] });
    }, (announcementDelay - i) * 60000);
  }

  setTimeout(async () => { await message.edit({ embeds: [winnerEmbed] }); }, announcementDelay * 60000);
};

const announceTeamAward = async (interaction, award, winners) => {
  const currentDate      = await getCurrentDate();
  const currentYear      = currentDate.split("-")[0];
  const awardID          = award.ID;
  const winner           = winners[0];
  const winnerDiscordID  = winner.DiscordID;
  const winnerTeamInfo   = await getTeamInfo({ discordID: winnerDiscordID });
  const winnerTeamName   = `${winnerTeamInfo.Name} ${winnerTeamInfo.Nickname}`;
  const winnerTeamIcon   = await getTeamIcon(winnerTeamName, interaction.client.emojis.cache);
  const winnerTeamRecord = await getTeamRecord({ teamID: winnerTeamInfo.TeamID });
  const finalistString   = await getFinalistsString(interaction, currentYear, awardID);
  const totalVotes       = winners.reduce((total, finalist) => total + finalist.TotalVotes, 0);
  const winnerVotes      = winner.TotalVotes;
  const votesString      = `Votes: ${winnerVotes} (${Math.round((winnerVotes / totalVotes) * 100)}%)`;

  let awardText = generateTeamAwardText(winnerTeamName, award.Name, winnerTeamRecord);

  awardText += `\n\n**${getTeamRecordString(winnerTeamRecord)}**`;
  awardText += `\n${getTeamRecordString(winnerTeamRecord, true)}`;

  const teaserEmbed = new EmbedBuilder()
    .setTitle(`The winner will be announced in ${announcementDelay} minutes.`)
    .setDescription(`**Finalists:**\n${finalistString}`)
    .setColor(0xF2A433)
    .setAuthor({ name: `${award.Name} - ${award.Description} (${currentYear})` });

  const winnerEmbed = new EmbedBuilder()
    .setTitle(`${winnerTeamIcon} ${winnerTeamName}`)
    .setDescription(awardText)
    .setColor(parseInt(winnerTeamInfo.PrimaryColor.replace("#", "0x"), 16))
    .setFooter({ text: votesString })
    .setAuthor({ name: `${award.Name} - ${award.Description} (${currentYear})` });

  const channel = interaction.client.channels.cache.find((c) => c.name === "awards");
  const message = await channel.send({ embeds: [teaserEmbed] });

  for (let i = announcementDelay; i > 0; i--) {
    setTimeout(async () => {
      const embed      = message.embeds[0];
      embed.data.title = `The winner will be announced in ${i} minutes.`;
      await message.edit({ embeds: [embed] });
    }, (announcementDelay - i) * 60000);
  }

  setTimeout(async () => { await message.edit({ embeds: [winnerEmbed] }); }, announcementDelay * 60000);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("awards-results")
    .setDescription("Post the results and end the awards ceremony."),

  async execute(interaction) {
    await this.endAwardsCeremony(interaction);
  },

  async endAwardsCeremony(interaction) {
    const channel     = interaction.client.channels.cache.find((c) => c.name === "awards");
    const messages    = await channel.messages.fetch({ limit: 1 });
    const message     = messages.first();
    const embeds      = message.embeds;
    const awardsEmbed = embeds[0];
    const currentDate = await getCurrentDate();
    const currentYear = currentDate.split("-")[0];
    const awards      = await getAwards();

    awardsEmbed.data.description = "The awards ceremony is going to start shortly.";

    for (const award of awards) {
      const index   = awards.indexOf(award);
      const awardID = award.ID;
      const winners = await awardsGetWinners(currentYear, awardID);
      const winner  = winners[0];
      const timeout = (index) * announcementDelay * 60 * 1000;

      if (winner !== null) {
        if (winner.PlayerID) {
          setTimeout(async () => { await announcePlayerAward(interaction, award, winners); }, timeout);
        } else {
          setTimeout(async () => { await announceTeamAward(interaction, award, winners); }, timeout);
        }
      }
    }

    await message.edit({
      embeds     : [awardsEmbed],
      components : [],
    });

    await interaction.reply({ content: "Awards ceremony ended.", ephemeral: true });
  },
};
