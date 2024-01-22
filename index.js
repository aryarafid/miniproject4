const express = require("express");
const bodyParser = require("body-parser");
const historyRouter = require("./routes/historyRouter")

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/history", historyRouter)

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


