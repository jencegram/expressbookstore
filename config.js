/** Common config for bookstore. */


let DB_URI = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books-test`;
} else if (!DB_URI) {
  DB_URI = `postgresql://localhost/books`;
}

module.exports = { DB_URI };