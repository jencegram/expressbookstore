/** Server for bookstore. */

require('dotenv').config();

const app = require("./app");

app.listen(3000, () => {
  console.log(`Server starting on port 3000`);
});
