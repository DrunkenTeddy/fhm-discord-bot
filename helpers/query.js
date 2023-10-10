const mysql = require("mysql");
const {
  dbHost, dbUser, dbPassword, dbDatabase,
} = require("../config.json");

module.exports = (query) => new Promise((resolve, reject) => {
  const connection = mysql.createConnection({
    host     : dbHost,
    user     : dbUser,
    password : dbPassword,
    database : dbDatabase,
  });

  const sql = query.replaceAll("\n", "");

  connection.connect();
  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      connection.end();
      reject(error);
    } else {
      connection.end();
      resolve(results);
    }
  });
});
