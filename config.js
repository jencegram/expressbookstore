/** Common config for bookstore. */

// Decide which database URI to use
let DB_URI;
if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.TEST_DATABASE_URL;
} else {
  DB_URI = process.env.DATABASE_URL || `postgresql://localhost/books`;
}

module.exports = { DB_URI };