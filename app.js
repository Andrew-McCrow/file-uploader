// install dependencies
const express = require("express");
const app = express();

// routes
app.get("/", (req, res) => res.send("Hello, world!"));

// start the server
const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});
