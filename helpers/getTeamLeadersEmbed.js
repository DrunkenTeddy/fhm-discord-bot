const { EmbedBuilder } = require("@discordjs/builders");

const getStatLeadersForTeam = require("./getStatLeadersForTeam");
const getTeamInfo           = require("./getTeamInfo");
const getTeamNameWithIcon   = require("./getTeamNameWithIcon");

module.exports = async (interaction, teamID) => {
  const teamInfo         = await getTeamInfo({ teamID });
  const teamLeaders      = await getStatLeadersForTeam(teamID);
  const teamName         = `${teamInfo.Name} ${teamInfo.Nickname}`;
  const teamNameWithIcon = getTeamNameWithIcon(teamName, interaction.client.emojis.cache);

  const goalLeadersString      = teamLeaders.goal.map((g) => `**${g.G}**-${g["First Name"]} ${g["Last Name"]}`).join("\n");
  const assistLeadersString    = teamLeaders.assist.map((a) => `**${a.A}**-${a["First Name"]} ${a["Last Name"]}`).join("\n");
  const pointLeadersString     = teamLeaders.point.map((p) => `**${p.P}**-${p["First Name"]} ${p["Last Name"]}`).join("\n");
  const GRLeadersString        = teamLeaders.GR.map((g) => `**${g.GR}**-${g["First Name"]} ${g["Last Name"]}`).join("\n");
  const OGRLeadersString       = teamLeaders.OGR.map((g) => `**${g.OGR}**-${g["First Name"]} ${g["Last Name"]}`).join("\n");
  const DGRLeadersString       = teamLeaders.DGR.map((s) => `**${s.DGR}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");
  const PlusMinusLeadersString = teamLeaders.PlusMinus.map((s) => `**${s.PlusMinus}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");
  const PPGLeadersString       = teamLeaders.PPG.map((s) => `**${s.PPG}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");
  const PPALeadersString       = teamLeaders.PPA.map((s) => `**${s.PPA}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");
  const GvALeadersString       = teamLeaders.GvA.map((s) => `**${s.GvA}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");
  const TkALeadersString       = teamLeaders.TkA.map((s) => `**${s.TkA}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");
  const SBLeadersString        = teamLeaders.SB.map((s) => `**${s.SB}**-${s["First Name"]} ${s["Last Name"]}`).join("\n");

  const teamLeadersEmbed = new EmbedBuilder()
    .setColor(parseInt(teamInfo.PrimaryColor.replace("#", ""), 16))
    .setTitle("Team Leaders")
    .setDescription(teamNameWithIcon);

  teamLeadersEmbed.addFields(
    { name: "Points", value: pointLeadersString, inline: true },
    { name: "Goals", value: goalLeadersString, inline: true },
    { name: "Assists", value: assistLeadersString, inline: true },
    { name: "GR", value: GRLeadersString, inline: true },
    { name: "OGR", value: OGRLeadersString, inline: true },
    { name: "DGR", value: DGRLeadersString, inline: true },
    { name: "+/-", value: PlusMinusLeadersString, inline: true },
    { name: "PPG", value: PPGLeadersString, inline: true },
    { name: "PPA", value: PPALeadersString, inline: true },
    { name: "GvA", value: GvALeadersString, inline: true },
    { name: "TkA", value: TkALeadersString, inline: true },
    { name: "SB", value: SBLeadersString, inline: true },
  );

  return teamLeadersEmbed;
};
