module.exports = (tradeString) => {
  const tradeLines              = tradeString.split("\n").filter((line) => line !== "");
  const pickConditionsLineIndex = tradeLines.findIndex((line) => line.includes("Pick Conditions"));
  const pickConditionsLines     = pickConditionsLineIndex === -1 ? [] : tradeLines.slice(pickConditionsLineIndex + 1);
  const pickConditions          = pickConditionsLines.join("\n");
  const tradeAssetsLines        = pickConditionsLineIndex === -1 ? tradeLines : tradeLines.slice(0, pickConditionsLineIndex);
  const teamNameLines           = tradeLines.filter((line) => line.includes("receives") || line.includes("sends"));
  const teamNames               = teamNameLines.map((line) => line.replace(/(receives|sends):/, "").replaceAll("**", "").replace(/<:[a-z]+:[0-9]+>/g, "").trim());
  const teamNameLineIndexes     = [];

  teamNameLines.forEach((line) => {
    const lineIndex = tradeAssetsLines.findIndex((tradeLine) => tradeLine === line);
    teamNameLineIndexes.push(lineIndex);
  });

  const offersByTeamIndex = teamNameLineIndexes.map((lineIndex, index) => {
    const nextLineIndex = teamNameLineIndexes[index + 1];
    const offerLines    = tradeAssetsLines.slice(lineIndex + 1, nextLineIndex);

    return offerLines;
  });

  const offersByTeam = teamNames.reduce((acc, teamName, index) => {
    const offerLines = offersByTeamIndex[index];
    const picks      = offerLines.filter((line) => line.includes("Pick"));
    const players    = offerLines.filter((line) => !line.includes("Pick"));

    acc[teamName] = { picks, players };

    return acc;
  }, { "Pick Conditions": pickConditions });

  return offersByTeam;
};
