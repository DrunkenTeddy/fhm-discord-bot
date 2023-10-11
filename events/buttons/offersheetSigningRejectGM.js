const { sendInsiderInfo } = require("../../commands/insider");
const getCompensation     = require("../../helpers/getCompensation");
const getDiscordInfo      = require("../../helpers/getDiscordInfo");

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
  const salaryNumber      = parseInt(salary.replace(/,/g, "").replace("$", ""), 10);
  const years             = customIDArray[7];
  const yearsNumber       = parseInt(years, 10);
  const clauseIndex       = parseInt(customIDArray[8], 10);
  const compensationIndex = parseInt(customIDArray[9], 10);
  const salaryString      = `$${salary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  const yearsString       = `${yearsNumber} year${yearsNumber > 1 ? "s" : ""}`;
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
  const teamLogo = interaction.client.emojis.cache.find((emoji) => emoji.name === teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase());

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
    content: `**${getTeamNameWithIcon(teamName, interaction.client.emojis.cache)}** signed RFA **${playerName}** for **${salaryString}/${yearsString}**.${clauseString}`,
  });

  const signingInfo = `${interaction.message.content}\n\n**<@${discordID}> did not match the offer sheet.**`;
  await interaction.message.edit({ content: signingInfo, components: [] });

  if (compensationIndex > 0) {
    const { compensationText } = getCompensation(salaryNumber, years, teamLogo);

    const confirmationInsiderStrings = [
      "Breaking news: (RightsTeam) has decided not to match the offer sheet for (Player) from (Team). (Player) will be joining (Team) for the next (Years) at a salary of (Salary) AAV.",
      "It's official, (RightsTeam) has decided not to match the offer sheet for (Player) from (Team). (Player) is now officially a part of (Team) for the next (Years) with a salary of (Salary) AAV.",
      "Big news in the hockey world as (RightsTeam) decides not to match the offer sheet for (Player) from (Team). (Player) is now a part of (Team) for the next (Years) with a salary of (Salary) AAV.",
      "My sources are telling me that (RightsTeam) has decided not to match the offer sheet for (Player) from (Team). (Player) will be joining (Team) for the next (Years) with a salary of (Salary) AAV.",
      "(RightsTeam) has announced that they will not match the offer sheet for (Player) from (Team). (Player) will now be a part of (Team) for the next (Years) with a salary of (Salary) AAV.",
      "Exciting news for (Team) as they have successfully signed (Player) from (RightsTeam) after they decided not to match the offer sheet. (Player) will be with (Team) for the next (Years) with a salary of (Salary) AAV.",
      "I can confirm that (RightsTeam) has decided not to match the offer sheet for (Player) from (Team). (Player) will now be joining (Team) for the next (Years) with a salary of (Salary) AAV.",
      "It's official, (Player) is now a part of (Team) after (RightsTeam) decided not to match the offer sheet. (Player) will be with (Team) for the next (Years) with a salary of (Salary) AAV.",
      "Big move by (Team) as they have signed (Player) from (RightsTeam) after they decided not to match the offer sheet. (Player) will be with (Team) for the next (Years) with a salary of (Salary) AAV.",
      "(Player) is now officially a part of (Team) after (RightsTeam) decided not to match the offer sheet. (Player) will be with (Team) for the next (Years) with a salary of (Salary) AAV.",
      "Breaking news: (RightsTeam) has decided to not match the offer sheet for (Player) from (Team). (Player) will now be joining (Team) for the next (Years) with a salary of (Salary) AAV.",
      "Big news as (RightsTeam) has decided not to match the offer sheet for (Player) from (Team). (Player) is now officially a part of (Team) for the next (Years) with a salary of (Salary) AAV.",
      "Exciting news for (Team) as they have signed (Player) from (RightsTeam) after they decided not to match the offer sheet. (Player) will be with (Team) for the next (Years) with a salary of (Salary) AAV.",
    ];

    const compensationStrings = [
      "(RightsTeam) will receive the following compensation: \n\n(Compensation)",
      "As compensation, (RightsTeam) will receive the following: \n\n(Compensation)",
      "In return, (RightsTeam) will receive the following compensation: \n\n(Compensation)",
    ];

    let insiderString = confirmationInsiderStrings[Math.floor(Math.random() * confirmationInsiderStrings.length)]
      .replaceAll("(Team)", getTeamNameWithIcon(teamName, interaction.client.emojis.cache))
      .replaceAll("(RightsTeam)", getTeamNameWithIcon(rightsTeamName, interaction.client.emojis.cache))
      .replaceAll("(Player)", playerName)
      .replaceAll("(Salary)", salaryString)
      .replaceAll("(Years)", yearsString)
      .replaceAll("(Compensation)", compensationText);

    if (clauseIndex > 0) {
      insiderString += clauseString;
    }

    const compensationString = compensationStrings[Math.floor(Math.random() * compensationStrings.length)]
      .replaceAll("(Compensation)", compensationText)
      .replaceAll("(RightsTeam)", getTeamNameWithIcon(rightsTeamName, interaction.client.emojis.cache));

    insiderString += ` ${compensationString}`;

    await sendInsiderInfo(interaction, insider.name, `${insiderString}`);
  }
};
