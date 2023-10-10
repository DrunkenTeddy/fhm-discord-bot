module.exports = (asset) => {
  const draftPickRegex = /(\d{4})|'(\d{2})|([A-Z]{3})|(\d{1,2})(st|nd|rd|th)|((R|r)ound)|((P|p)ick)/;

  return draftPickRegex.test(asset);
};
