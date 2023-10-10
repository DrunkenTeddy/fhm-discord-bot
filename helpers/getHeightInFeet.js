module.exports = (heightInInches) => {
  const feet = Math.floor(heightInInches / 12);
  const inch = heightInInches % 12;
  return `${feet}'${inch}"`;
};
