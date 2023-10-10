module.exports = (a, b) => {
  const aPoints = parseInt(a.Points, 10);
  const bPoints = parseInt(b.Points, 10);
  const aWins   = parseInt(a.Wins, 10);
  const bWins   = parseInt(b.Wins, 10);
  const aLosses = parseInt(a.aLosses, 10);
  const bLosses = parseInt(b.bLosses, 10);
  const aOTL    = parseInt(a.OTL, 10);
  const bOTL    = parseInt(b.OTL, 10);
  const aSOW    = parseInt(a.SOW, 10);
  const bSOW    = parseInt(b.SOW, 10);
  const aGF     = parseInt(a.GF, 10);
  const bGF     = parseInt(b.GF, 10);
  const aGA     = parseInt(a.GA, 10);
  const bGA     = parseInt(b.GA, 10);
  const aGP     = aWins + aLosses;
  const bGP     = bWins + bLosses;

  if (aPoints > bPoints) { return -1; }
  if (aPoints < bPoints) { return 1; }
  if (aGP > bGP) { return 1; }
  if (aGP < bGP) { return -1; }
  if (aWins > bWins) { return -1; }
  if (aWins < bWins) { return 1; }
  if (aOTL > bOTL) { return -1; }
  if (aOTL < bOTL) { return 1; }
  if (aSOW > bSOW) { return -1; }
  if (aSOW < bSOW) { return 1; }
  if (aGF - aGA > bGF - bGA) { return -1; }
  if (aGF - aGA < bGF - bGA) { return 1; }
  if (aGF > bGF) { return -1; }
  if (aGF < bGF) { return 1; }
  return 0;
};
