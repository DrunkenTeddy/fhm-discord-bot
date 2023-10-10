module.exports = (teamName, emojis) => {
  const emojiName = teamName.replaceAll(" ", "").replaceAll(".", "").toLowerCase();
  const teamEmoji = emojis.find((emoji) => emoji.name === emojiName);

  if (!teamEmoji) return teamName;

  return `${teamEmoji} ${teamName}`;
};
