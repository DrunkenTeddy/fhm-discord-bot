const getPlayerNames = require("./getPlayerNames");

const insiders = require("../static_data/insiders.json");
const teams    = require("../static_data/teams.json");

module.exports = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true);
  const focusedValue  = interaction.options.getFocused().toLowerCase();

  let choices = [];
  let filtered;

  if (focusedOption.name === "duration") {
    choices  = ["Day to day", "1-2 weeks", "2-3 weeks", "1-2 months", "2-3 months", "3-4 months", "Indefinite"];
    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "years" || focusedOption.name === "askedyears") {
    choices  = ["1 year", "2 years", "3 years", "4 years", "5 years", "6 years", "7 years", "8 years"];
    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "staffposition") {
    choices  = ["Assistant Coach", "Scout", "Trainer"];
    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "status") {
    choices  = ["UFA", "RFA"];
    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "clause") {
    choices  = ["No clause", "No Trade Clause (NTC)", "No Movement Clause (NMC)"];
    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "insider") {
    choices  = insiders.map((insider) => insider.name);
    filtered = choices;
  } else if (focusedOption.name === "player") {
    if (focusedValue.length === 0) {
      choices = ["Start typing a player name..."];
    } else {
      const playerNames = await getPlayerNames(focusedValue);

      choices = playerNames !== null ? playerNames : ["No players found."];
    }

    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "teamplayer") {
    const teamOption = interaction.options.get("team");

    if (teamOption && teamOption.value !== "") {
      const playerNames = await getPlayerNames(focusedValue, { teamName: teamOption.value });

      choices = playerNames !== null ? playerNames : ["No players found."];
    } else if (focusedValue.length === 0) {
      choices = ["Start typing a player name..."];
    } else {
      choices = await getPlayerNames(focusedValue);
    }

    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  } else if (focusedOption.name === "salary" || focusedOption.name === "askedsalary") {
    let salaryNumber = focusedValue === "" ? 750 : parseInt(focusedValue.replaceAll(",", "").replaceAll(".", ""), 10);

    while (salaryNumber < 700000) { salaryNumber *= 10; }

    const formattedSalary = salaryNumber.toLocaleString("en-US", {
      style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0,
    });

    if (formattedSalary === "$NaN") {
      choices = ["Enter a valid salary number..."];
    } else {
      choices = [formattedSalary];
    }

    filtered = choices;
  } else if (focusedOption.name === "staffsalary") {
    let salaryNumber = focusedValue === "" ? 1 : parseInt(focusedValue.replaceAll(",", "").replaceAll(".", ""), 10);

    while (salaryNumber < 10000) { salaryNumber *= 10; }

    const formattedSalary = salaryNumber.toLocaleString("en-US", {
      style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0,
    });

    if (formattedSalary === "$NaN") {
      choices = ["Enter a valid salary number..."];
    } else {
      choices = [formattedSalary];
    }

    filtered = choices;
  } else {
    choices  = teams.map((team) => team.name);
    filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue));
  }

  return interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25),
  );
};
