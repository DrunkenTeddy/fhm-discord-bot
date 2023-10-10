module.exports = (rating, emojis) => {
  const ratingValue = parseInt(rating, 10);
  let emojiName     = "";

  if (ratingValue <= 5) {
    emojiName = "ratingslowest";
  } else if (ratingValue <= 7) {
    emojiName = "ratingslow";
  } else if (ratingValue <= 10) {
    emojiName = "ratingsmedium";
  } else if (ratingValue <= 13) {
    emojiName = "ratingsgood";
  } else if (ratingValue <= 15) {
    emojiName = "ratingsbetter";
  } else if (ratingValue <= 17) {
    emojiName = "ratingsbest";
  } else {
    emojiName = "ratingselite";
  }

  const ratingEmoji = emojis.find((emoji) => emoji.name === emojiName);
  return `${ratingEmoji}${rating}`;
};
