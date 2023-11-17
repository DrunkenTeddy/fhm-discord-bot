const { sendInsiderInfo } = require("../../commands/insider");

const insiders = require("../../static_data/insiders.json");

const newTrade               = require("../../helpers/newTrade");
const getPlayerInfo          = require("../../helpers/getPlayerInfo");
const getPickID              = require("../../helpers/getPickID");
const getTeamInfo            = require("../../helpers/getTeamInfo");
const transformTradeString   = require("../../helpers/transformTradeString");

const delay = 5;

module.exports = async (interaction) => {
  interaction.deferUpdate({ ephemeral: true });

  const insider       = insiders[Math.floor(Math.random() * insiders.length)];
  const tradeInfo     = interaction.message.content.split("\n").slice(1).slice(0, -3).join("\n");
  const tradeObject   = transformTradeString(tradeInfo);
  const teamNameLines = tradeInfo.split("\n").filter((line) => line.includes("sends:") || line.includes("receives:"));
  const teamNames     = teamNameLines.map((line) => line.replace(/(receives|sends):/, "").replaceAll("**", "").replace(/<:[a-z]+:[0-9]+>/g, "").trim());
  const is3Way        = teamNameLines.length === 3;
  const teamIDs       = [];
  const tradeItems    = [];

  for (const teamName of teamNames) {
    const teamInfo  = await getTeamInfo({ teamName });
    const teamID    = teamInfo.TeamID;
    const teamOffer = tradeObject[teamName];

    for (const pick of teamOffer.picks) {
      const pickID = await getPickID(pick);

      tradeItems.push({ teamID, pickID });
    }

    for (const player of teamOffer.players) {
      const playerName = player.split("(")[0];
      const playerInfo = await getPlayerInfo({ playerName });
      const playerID   = playerInfo.PlayerID;

      tradeItems.push({ teamID, playerID });
    }

    teamIDs.push(teamID);
  }

  await newTrade(teamIDs, tradeItems);

  if (is3Way) {
    const team1Name = teamNameLines[0].replaceAll("**", "").replaceAll(" receives:", "");
    const team2Name = teamNameLines[1].replaceAll("**", "").replaceAll(" receives:", "");
    const team3Name = teamNameLines[2].replaceAll("**", "").replaceAll(" receives:", "");
    /*
    const insiderStrings = [
      "Nothing official yet, but I'm hearing that a 3 way deal between the (Team A), (Team B) and (Team C) is in the works. Details to come.",
      "I'm hearing that the (Team A) and (Team B) are working on a deal. (Team C) could also be involved. Details to come.",
      "Rumblings out of (Team A) organisation suggest that a trade with the (Team B) could be finalized within the day. I'm hearing the trade might also involve a third team. Stay tuned for further details.",
      "My sources are telling me that a 3-way trade is in the works between the (Team A), (Team B) and (Team C). Details to come soon.",
      "The trade rumor mill is buzzing with talk of a potential 3-way deal between the (Team A), (Team B) and (Team C). Stay tuned for official confirmation.",
      "I'm getting word that a 3-way trade is being discussed between (Team A), (Team B) and (Team C). More information to come soon.",
      "It looks like a big trade could be on the horizon with (Team A) and (Team B) involved, I'm hearing that a third team could be involved too. More details to follow.",
      "I've heard whispers that a 3-way trade is being discussed between (Team A), (Team B) and (Team C), stay tuned for confirmation.",
      "The trade winds are blowing with rumors of a major 3-way deal between (Team A), (Team B) and (Team C). Stay tuned for more information.",
      "My sources are suggesting that a major 3-way trade is in the works between (Team A), (Team B) and (Team C). Stand by for more details.",
      "I'm hearing that a 3-way deal between (Team A), (Team B) and (Team C) could be in the works. More information to come soon.",
      "Rumors of a big trade are circulating with (Team A), (Team B) and (Team C) potentially involved. Stand by for confirmation.",
      "A big trade could be in the works with (Team A), (Team B) and (Team C) potentially involved, stay tuned for more information.",
    ];

    const insiderString = insiderStrings[Math.floor(Math.random() * insiderStrings.length)]
      .replaceAll("(Team A)", team1Name)
      .replaceAll("(Team B)", team2Name)
      .replaceAll("(Team C)", team3Name);

    await sendInsiderInfo(interaction, insider.name, insiderString);*/

    setTimeout(async () => {
      const channel = interaction.client.channels.cache.find((c) => c.name === "trade-center");
      await channel.send({ content: `**We have a trade to announce!**\n${tradeInfo}` });
      /*
      const confirmationInsiderStrings = [
        "I'm hearing that the 3 way trade between the (Team A), (Team B) and (Team C) is now official.",
        "The league just announced a 3 way trade involving the (Team A), (Team B) and (Team C). Here are the details.",
        "The 3 way trade between the (Team A), (Team B) and (Team C) is now official. What a blockbuster!",
        "It's official! The (Team A), (Team B) and (Team C) have just announced a 3-way trade that will shake things up in the league. This trade will have a big impact on the future of all three teams. ",
        "Breaking news! The (Team A), (Team B) and (Team C) have just confirmed a 3-way trade that will have fans of all teams excited to see the outcome. This trade will bring new faces to all three teams",
        "The league has just announced a 3-way trade between the (Team A), (Team B) and (Team C). This one is sure to shake things up and change the landscape of the league",
        "The rumors were true! The (Team A), (Team B) and (Team C) have just confirmed a 3-way trade that will have a big impact on the teams and the league. This trade will bring new dynamics to all three teams",
        "It's official! The (Team A), (Team B) and (Team C) have just announced a 3-way trade that will have a big impact on the league. This trade will bring new opportunities for all three teams to build for the future",
        "The (Team A), (Team B) and (Team C) have just made a big move by finalizing a 3-way trade. This trade will bring a fresh start for all three teams",
        "It's official! The (Team A), (Team B) and (Team C) have just announced a 3-way trade that will change the landscape of the league. Fans of all teams will be excited to see the outcome",
        "A big shakeup in the league as the (Team A), (Team B) and (Team C) have confirmed a 3-way trade. This trade will bring new faces and new dynamics to all three teams",
        "The league just announced a 3-way trade involving the (Team A), (Team B) and (Team C). This trade will have a significant impact on the future of all three teams",
        "Trade alert! The (Team A), (Team B) and (Team C) have just confirmed a 3-way trade that will bring new opportunities for all three teams",
        "The (Team A), (Team B) and (Team C) have just made a bold move by finalizing a 3-way trade. This trade will bring new challenges and new chances for all three teams",
        "The (Team A), (Team B) and (Team C) have just made a trade that will bring new faces to all three teams. Fans of all teams will be excited to see the outcome",
        "It's official! The (Team A), (Team B) and (Team C) have just announced a 3-way trade that will bring new dynamics to the league. It's always exciting to see teams make moves to improve their roster.",
        "A trade has been confirmed between the (Team A), (Team B) and (Team C), Fans of all teams will be eager to see how this trade will play out.",
        "The league just announced a 3-way trade involving the (Team A), (Team B) and (Team C). Trades always bring excitement to the league, and this one is no exception.",
      ];

      const confirmationInsiderString = confirmationInsiderStrings[Math.floor(Math.random() * confirmationInsiderStrings.length)]
        .replaceAll("(Team A)", team1Name)
        .replaceAll("(Team B)", team2Name)
        .replaceAll("(Team C)", team3Name);

      sendInsiderInfo(interaction, insider.name, `${confirmationInsiderString}\n${tradeInfo}`);*/
    }, delay);
  } else {
    const team1Name = teamNameLines[0].replaceAll("**", "").replaceAll(" sends:", "");
    const team2Name = teamNameLines[1].replaceAll("**", "").replaceAll(" sends:", "");
    /*
    const insiderStrings = [
      "Nothing official yet, but I'm hearing that a deal between the (Team A) and (Team B) is in the works. Details to come.",
      "I'm hearing that the (Team A) and (Team B) are working on a deal. Details to come.",
      "Rumblings out of (Team A) organisation suggest that a trade with the (Team B) could be finalized within the day. Stay tuned for further details.",
      "My sources from the (Team A) organisation are telling me that the team is concluding negotiations with the (Team B) and that a trade could be on the way.",
      "My sources are telling me that a deal between the (Team A) and (Team B) is in the works. Details to come.",
      "Trade talks between the (Team A) and (Team B) are heating up. Stay tuned for further details.",
      "Apparently the (Team A) and (Team B) have been in talks for a while now. I'm hearing that a deal could be finalized within the next few days.",
      "Rumour out of the (Team A) organisation is that a trade with the (Team B) could be on the way.",
      "Sounds like the (Team A) are putting the finishing touches on a trade with the (Team B) Hopefully this works out better than the last one.",
      "I'm hearing that the (Team A) and (Team B) have agreed to make a trade. My sources within the league are telling me that Trade Review Board is already preparing to meet in anticipation.",
      "Per my sources, the (Team A) and (Team B) are in the process of finalizing a trade. Stay tuned for more details.",
      "People around the league are buzzing about a potential trade between the (Team A) and (Team B).",
      "The league is buzzing about a potential trade between the (Team A) and (Team B).",
      "Nothing to confirm yet, but I'm hearing that a trade between the (Team A) and (Team B) is in the works. Details to come.",
      "People close to the (Team A) are telling me that the team is in the process of finalizing a trade with the (Team B).",
      "I'm getting word that a trade between (Team A) and (Team B) is being discussed. More information to come soon.",
      "Rumors are swirling of a potential trade between the (Team A) and (Team B). Stand by for confirmation.",
      "The trade rumor mill is buzzing with talk of a deal between the (Team A) and (Team B). Stay tuned for official confirmation.",
      "The (Team A) and (Team B) are in negotiations for a trade, more details to follow.",
      "It looks like a trade is in the works between (Team A) and (Team B), stay tuned for more information.",
      "I've heard whispers that a trade between (Team A) and (Team B) is being discussed, stand by for confirmation.",
      "The trade winds are blowing with rumors of a deal between the (Team A) and (Team B). More details to come soon.",
      "My sources are suggesting that a trade between (Team A) and (Team B) is in the works. Stand by for more details.",
      "The (Team A) and (Team B) have been in talks for a potential trade, stay tuned for confirmation.",
      "The trade winds are blowing and it looks like the (Team A) and (Team B) could be making a move. Fans of both teams are eagerly waiting to see what the future holds as teams look to shake up their rosters and build for the future. More details to come soon.",
      "The league is buzzing with excitement as rumors of a trade between the (Team A) and (Team B) start to circulate. Both teams are looking to shake up their rosters and build for the future, and this trade could be a step in the right direction. Stay tuned for more information.",
      "I'm hearing that the (Team A) and (Team B) are in talks for a trade, and it's got fans and analysts alike buzzing with excitement. This trade could be a significant move for both teams as they look to solidify their rosters and build for the future. More details to come soon.",
      "The (Team A) and (Team B) have been in talks for a trade, and it's got the league buzzing with excitement. This trade could be a significant move for both teams as they look to shake up their rosters and build for the future. Stay tuned for more information.",
      "The trade winds are blowing and it looks like the (Team A) and (Team B) could be making a move. Fans of both teams are eagerly waiting to see what the future holds as teams look to shake up their rosters and build for the future. More details to come soon.",
      "The anticipation is building as the (Team A) and (Team B) are in talks for a trade. Both teams are looking to make moves to solidify their rosters and build for the future. More details to come soon.",
      "The league is buzzing with excitement as rumors of a trade between the (Team A) and (Team B) start to circulate. Fans of both teams are eagerly waiting to see how this trade will impact their favorite team. Stay tuned for more information.",
      "I'm hearing that the (Team A) and (Team B) are in talks for a trade, and it's got fans of both teams on the edge of their seats. The anticipation is building as everyone waits to see what this trade will bring. More details to come soon.",
      "The (Team A) and (Team B) have been in talks for a trade, and fans of both teams are eagerly waiting to see what the outcome will be. The anticipation is high as everyone waits for more information.",
      "The trade winds are blowing and it looks like the (Team A) and (Team B) could be making a move. Fans of both teams are eagerly waiting to see what this trade means for their favorite team. More details to come soon.",
      "The anticipation is building as the (Team A) and (Team B) are in talks for a trade. Fans are eagerly waiting to see the outcome and how it will impact their favorite team. More details to come soon.",
    ];

    const insiderString = insiderStrings[Math.floor(Math.random() * insiderStrings.length)]
      .replaceAll("(Team A)", team1Name)
      .replaceAll("(Team B)", team2Name);

    await sendInsiderInfo(interaction, insider.name, insiderString);*/

    setTimeout(async () => {
      const channel = interaction.client.channels.cache.find((c) => c.name === "trade-center");
      await channel.send({ content: `**We have a trade to announce!**\n${tradeInfo}` });
      /*
      const confirmationInsiderStrings = [
        "I'm hearing that the trade between the (Team A) and (Team B) has been approved by the Trade Review Board. Here are the details:",
        "Excited to be the first to break the news of the deal between the (Team A) and (Team B)!",
        "I'm hearing that the deal between the (Team A) and (Team B) is official. Here are the details.",
        "My sources prove trustworthy once again... The trade between the (Team A) and (Team B) is now official.",
        "I'm hearing that the trade between the (Team A) and (Team B) is now official.",
        "The deal between the (Team A) and (Team B) is official. I wonder how this one will age?",
        "Trade Alert! The rumours of a deal between the (Team A) and (Team B) have been proven true!",
        "The trade between the (Team A) and (Team B) is now official. What a blockbuster!",
        "The trade between the (Team A) and (Team B) is now official. I'm sure the fans are excited!",
        "The talks between the (Team A) and (Team B) have been finalized. Here are the details.",
        "The rumours were true! The trade between the (Team A) and (Team B) is now official.",
        "The rumblings of a trade between the (Team A) and (Team B) have been confirmed. Here are the details.",
        "The league will be talking about this one for a while. The trade between the (Team A) and (Team B) is now official.",
        "This one is going to be a doozy. The trade between the (Team A) and (Team B) is now official.",
        "This is an exciting one. The trade between the (Team A) and (Team B) is now official.",
        "I have had my eye on this one for a while. The trade between the (Team A) and (Team B) is now official.",
        "There is a lot of excitement around this one. The trade between the (Team A) and (Team B) is now official. Here are the details.",
        "Trade Alert! The (Team A) and (Team B) have agreed to a deal. Here are the details.",
        "The league just announced a trade between the (Team A) and (Team B). Here are the details.",
        "Breaking news! The (Team A) and (Team B) have just made a trade and I'm excited to be bringing you the details!",
        "I have the inside scoop! The (Team A) and (Team B) have just made a trade and I'm excited to share the details with you.",
        "It's official! The (Team A) and (Team B) have just announced a trade and I'm excited to be the first to bring you the details.",
        "The league is buzzing and I have the exclusive details! The (Team A) and (Team B) have just made a trade.",
        "Hold onto your seats, folks! The (Team A) and (Team B) have just made a trade and I'm thrilled to bring you the details.",
        "As a NHL analyst, it's always exciting to break the news of a new trade, The (Team A) and (Team B) have just made a trade and I'm thrilled to share the details with you.",
        "Breaking news! The (Team A) and (Team B) have just made a trade and I'm bringing you the details now.",
        "I have the inside scoop! The (Team A) and (Team B) have just made a trade and here are the details.",
        "It's official! The (Team A) and (Team B) have just announced a trade and I'm the first to bring you the details.",
        "The league is buzzing and I have the exclusive details! The (Team A) and (Team B) have just made a trade, here are the details.",
        "Hold onto your seats, folks! The (Team A) and (Team B) have just made a trade and here are the details.",
        "As a NHL analyst, it's always exciting to break the news of a new trade, The (Team A) and (Team B) have just made a trade and here are the details.",
        "It's official! The (Team A) and (Team B) have just announced a trade and I'm thrilled to be the first to bring you the details. This trade could have a major impact on both teams' future and I can't wait to see how it plays out.",
        "The league is buzzing and I have the exclusive details! The (Team A) and (Team B) have just made a trade that will shake up both teams' rosters. This trade could be a game changer for both teams and I'm excited to see how it plays out.",
        "Hold onto your seats, folks! The (Team A) and (Team B) have just made a trade that has the potential to change the dynamic of the league. I have all the details and I'm excited to share them with you.",
        "As a NHL analyst, it's always exciting to break the news of a new trade, The (Team A) and (Team B) have just made a trade that will have fans on the edge of their seats. Both teams have made moves to build for the future, this trade could be a major step towards a championship run and I can't wait to see how it plays out.",
        "The (Team A) and (Team B) just made a trade that will be talked about for a long time. I have all the details and I'm excited to share them with you. This trade could change the fate of both teams and I'm excited to see how it plays out.",
        "Breaking news! The (Team A) and (Team B) have just made a trade that will shake up the league. This trade could have a big impact on both teams' future and I'm excited to be bringing you the details.",
      ];

      const confirmationInsiderString = confirmationInsiderStrings[Math.floor(Math.random() * confirmationInsiderStrings.length)]
        .replaceAll("(Team A)", team1Name)
        .replaceAll("(Team B)", team2Name);

      sendInsiderInfo(interaction, insider.name, `${confirmationInsiderString}\n${tradeInfo}`);*/
    }, delay);
  }

  // Post the pick conditions
  const pickConditions = tradeObject["Pick Conditions"];

  if (pickConditions !== "") {
    setTimeout(() => {
      const channel = interaction.client.channels.cache.find((c) => c.name === "conditional-picks");

      channel.send(pickConditions);
    }, delay);
  }

  await interaction.editReply({ content: "Trade processed.", ephemeral: true });
  await interaction.message.delete();
};
