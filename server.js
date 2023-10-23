/** Server for bookstore. */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require("./app");

// Start the server on port 3000
app.listen(3000, () => {
  console.log(`Server starting on port 3000`);
});
