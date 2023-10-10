const query = require("./query");

module.exports = (date) => query(`SELECT * FROM injuries WHERE Date='${date}'`);
