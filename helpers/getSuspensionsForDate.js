const query = require("./query");

module.exports = (date) => query(`SELECT * FROM suspensions WHERE Date='${date}'`);
