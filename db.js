/** Database config for bookstore. */
const { Pool } = require("pg");
const { DB_URI } = require("./config");

let db = new Pool({
  connectionString: DB_URI
});

// Handling errors globally for your pool:
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = db;