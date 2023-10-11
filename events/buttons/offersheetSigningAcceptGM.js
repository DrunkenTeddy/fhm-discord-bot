const { sendInsiderInfo } = require("../../commands/insider");
const getDiscordInfo = require("../../helpers/getDiscordInfo");

const getPlayerInfo       = require("../../helpers/getPlayerInfo");
const getTeamInfo         = require("../../helpers/getTeamInfo");
const getTeamNameWithIcon = require("../../helpers/getTeamNameWithIcon");

const insiders = require("../../static_data/insiders.json");

module.exports = async (interaction) => {
  const discordID         = interaction.user.id;
  const customID          = interaction.customId;
  const customIDArray     = customID.split("-");
  const playerID          = customIDArray[3];
  const teamID            = customIDArray[4];
  const rightsTeamID      = customIDArray[5];
  const salary            = customIDArray[6];
  const years             = customIDArray[7];
  const clauseIndex       = parseInt(customIDArray[8], 10);
  const compensationIndex = parseInt(customIDArray[9], 10);
  const salaryString      = `$${salary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  const yearsString       = years.endsWith("year") || years.endsWith("years") ? years : `${years} year${years > 1 ? "s" : ""}`;
  const insider           = insiders[Math.floor(Math.random() * insiders.length)];
  let clauseString        = "";

  if (clauseIndex === 1) {
    clauseString = " The contract includes a no-trade clause (NTC).";
  } else if (clauseIndex === 2) {
    clauseString = " The contract includes a no-movement clause (NMC).";
  }

  const playerInfo = await getPlayerInfo({ playerID });
  const playerName = `${playerInfo["First Name"]} ${playerInfo["Last Name"]}`;

  const teamInfo = await getTeamInfo({ teamID });
  const teamName = `${teamInfo.Name} ${teamInfo.Nickname}`;

  const rightsTeamInfo        = await getTeamInfo({ teamID: rightsTeamID });
  const rightsTeamName        = `${rightsTeamInfo.Name} ${rightsTeamInfo.Nickname}`;
  const rightsTeamDiscordInfo = await getDiscordInfo({ teamID: rightsTeamID });

  const commissionerRole    = interaction.guild.roles.cache.find((role) => role.name.includes("commissioners"));
  const hasCommissionerRole = interaction.member.roles.cache.has(commissionerRole.id);

  if (!commissionerRole) {
    return interaction.reply({
      content   : "The commissioners role does not exist.",
      ephemeral : true,
    });
  }

  // Make sure the GM accepting the offer sheet is the rights team's GM or a commissioner
  if (rightsTeamDiscordInfo.DiscordID !== discordID && !hasCommissionerRole) {
    return interaction.reply({
      content   : "You are not the GM of the team that owns this player's rights.",
      ephemeral : true,
    });
  }

  const channel = interaction.client.channels.cache.find((c) => c.name === "free-agent-tracker");
  await channel.send({
    content: `**${getTeamNameWithIcon(rightsTeamName, interaction.client.emojis.cache)}** signed RFA **${playerName}** for **${salaryString}/${yearsString}**.${clauseString}`,
  });

  const signingInfo = `${interaction.message.content}\n\n**<@${discordID}> has matched the offer sheet.**`;
  await interaction.message.edit({ content: signingInfo, components: [] });

  if (compensationIndex > 0) {
    const confirmationInsiderStrings = [
      "I'm hearing that (RightsTeam) has matched the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "Excited to announce that (RightsTeam) has matched the offer sheet from (Team) for (Player) and he will stay with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "My sources are telling me that (RightsTeam) has successfully matched the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "(RightsTeam) has just announced that they have matched the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "(Player) will remain with (RightsTeam) after they successfully matched the offer sheet from (Team). He will earn (Salary) AAV for the next (Years).",
      "Looks like (RightsTeam) has retained (Player) after matching the offer sheet from (Team). He will stay with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "Big news as (RightsTeam) matches the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "I can confirm that (RightsTeam) has matched the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "Rumors are true, (RightsTeam) has matched the offer sheet from (Team) for (Player). He will stay with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "Just heard the news that (RightsTeam) has matched the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "I'm hearing that (RightsTeam) has matched the offer sheet from (Team) for (Player). He will stay with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "Exciting news as (RightsTeam) matches the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "My sources are telling me that (RightsTeam) has matched the offer sheet from (Team) for (Player). He will stay with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
      "(RightsTeam) has just announced that they have matched the offer sheet from (Team) for (Player). He will remain with the (RightsTeam) for the next (Years) with a salary of (Salary) AAV.",
    ];

    let insiderString = confirmationInsiderStrings[Math.floor(Math.random() * confirmationInsiderStrings.length)]
      .replaceAll("(Team)", getTeamNameWithIcon(teamName, interaction.client.emojis.cache))
      .replaceAll("(RightsTeam)", getTeamNameWithIcon(rightsTeamName, interaction.client.emojis.cache))
      .replaceAll("(Player)", playerName)
      .replaceAll("(Salary)", salaryString)
      .replaceAll("(Years)", yearsString);

    if (clauseIndex > 0) {
      insiderString += clauseString;
    }

    await sendInsiderInfo(interaction, insider.name, `${insiderString}`);
  }
};
