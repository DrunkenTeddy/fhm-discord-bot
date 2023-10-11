const { sendInsiderInfo } = require("../../commands/insider");

const insiders = require("../../static_data/insiders.json");

module.exports = async (interaction) => {
  const channel      = interaction.client.channels.cache.find((c) => c.name === "contract-extensions");
  const messageLines = interaction.message.content.split("\n").slice(1).slice(0, -1);
  const signingInfo  = messageLines.join("\n").replace("wants to ", "");
  const teamName     = signingInfo.split("extend")[0].split("\n").slice(1).join("\n").replaceAll("**", "").trim();
  const playerName   = signingInfo.split("extend")[1].trim().split("for")[0].replaceAll("**", "").trim();
  const salaryString = signingInfo.split("extend")[1].trim().split("for")[1].replaceAll("**", "").trim();
  const salary       = salaryString.split("/")[0].trim();
  const years        = salaryString.split("/")[1].replace(".", "").split("\n")[0].trim();
  const insider      = insiders[Math.floor(Math.random() * insiders.length)];

  const confirmationInsiderStrings = [
    "I'm hearing that the (Team) just signed (Player) for (Salary) AAV for the next (Years). This is a great signing for the team.",
    "Excited to be the first to break the news of the (Team) signing (Player) for (Salary) AAV for the next (Years).",
    "My sources are telling me that the (Team) just signed (Player) for (Salary) AAV for the next (Years).",
    "(Team) just announced that (Player) will stay with the team for the next (Years). He will get paid (Salary) per year.",
    "(Player) just signed a new contract with the (Team). He will get paid (Salary) per year for the next (Years). I'm sure the fans are excited!",
    "Great news for the (Team) as (Player) has decided to extend his stay with the team for the next (Years), with a (Salary) AAV contract. Loyalty to the team is key.",
    "It's official, (Player) will continue to wear the (Team) jersey for the next (Years), earning (Salary) AAV. A sign of his commitment to the team.",
    "The (Team) is thrilled to announce that (Player) has agreed to stay with the team for the next (Years), earning (Salary) AAV. A key player in the team's future.",
    "The (Team) secures the services of (Player) for the next (Years), with a (Salary) AAV contract. A sign of his loyalty to the team.",
    "The (Team) fans can breathe a sigh of relief as (Player) has decided to extend his stay with the team for the next (Years), earning (Salary) AAV. A true team player.",
    "Great news for the (Team) and (Player) as they have reached a new contract agreement for the next (Years), (Salary) AAV. Both parties worked hard to come to this decision, and are happy with the outcome.",
    "The (Team) and (Player) have reached a mutual agreement for the next (Years), (Salary) AAV. Both parties are excited to continue working together.",
    "It's official, (Player) will remain with the (Team) for the next (Years), (Salary) AAV. Both parties have been in negotiations for some time and are happy with the final outcome.",
    "The (Team) and (Player) come to an agreement for the next (Years), (Salary) AAV. Both have worked hard to reach this deal and are happy to continue working together.",
    "The (Team) and (Player) have come to an agreement on a new contract for the next (Years), (Salary) AAV. Both sides are pleased to have reached a deal and are looking forward to the future.",
    "The (Team) and (Player) have agreed on a new contract extension, (Player) will be earning (Salary) AAV for the next (Years) years, both parties are excited for the future.",
    "The (Team) has secured the services of (Player) for the next (Years) years, with a new contract of (Salary) AAV. Both parties are happy to continue working together.",
    "The (Team) and (Player) have come to an agreement on a new contract, (Player) will stay with the team for the next (Years), earning (Salary) AAV per year. Both sides are excited for the future.",
    "Its official, (Player) will remain with the (Team) for the next (Years), (Salary) AAV. Both parties have been working hard to reach this agreement and are happy with the outcome.",
    "The (Team) and (Player) have come to an agreement, (Player) will stay with the team for the next (Years), earning (Salary) AAV per year. Both sides are excited to continue working together.",
    "The (Team) and (Player) have reached a new contract agreement, (Player) will be earning (Salary) AAV for the next (Years) years, it's a win-win situation for both parties.",
    "The (Team) is thrilled to announce that (Player) has agreed to stay with the team for the next (Years), earning (Salary) AAV per year. Both sides have worked hard to reach this agreement.",
    "The (Team) has made a key move by extending the contract of (Player) for the next (Years), (Salary) AAV. Both parties are excited for the future and the fans should be too.",
    "The (Team) and (Player) have come to a mutual agreement, (Player) will stay with the team for the next (Years), earning (Salary) AAV. It's a great news for both parties and the fans.",
    "The (Team) and (Player) have agreed on a new contract, (Player) will remain with the team for the next (Years) and will earn (Salary) AAV. Both sides are happy with the outcome and looking forward to the future.",
    "(Player) has agreed to extend his stay with the (Team) for the next (Years), with a salary of (Salary) AAV per year. Both sides worked hard to reach this agreement.",
    "The (Team) has made a solid move by signing (Player) for the next (Years) at (Salary) AAV. Both parties are excited to continue working together.",
    "In a major signing, (Player) has committed to the (Team) for the next (Years), earning (Salary) AAV per year. Both the team and the player are thrilled with the outcome.",
    "The (Team) has locked in (Player) for the next (Years) at (Salary) AAV, solidifying the team's future. Both sides are happy with the agreement.",
    "The (Team) has secured the services of (Player) for the next (Years), with a salary of (Salary) AAV per year. Both parties have worked hard to reach this agreement.",
  ];

  const insiderString = confirmationInsiderStrings[Math.floor(Math.random() * confirmationInsiderStrings.length)]
    .replaceAll("(Team)", teamName)
    .replaceAll("(Player)", playerName)
    .replaceAll("(Salary)", salary)
    .replaceAll("(Years)", years);

  await channel.send({ content: `${signingInfo}` });

  // Send the insider info if the contract is at least 3m AAV or 5 years
  if (parseInt(salary.replace("$", "").replaceAll(",", ""), 10) >= 3000000 || years >= 5) {
    await sendInsiderInfo(interaction, insider.name, `${insiderString}`);
  }

  // await interaction.message.delete();
};
