const express = require("express");
const bodyParser = require("body-parser");
const historyRouter = require("./routes/historyRouter");
const path = require("path");
const session = require("express-session");
const { authenticateUser, checkAuth } = require("./middlewares/middlewares");
const historyController = require("./controllers/historyController");
const router = express.Router();
const pool = require("./config");
const moment = require("moment");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // Set your templating engine

///////////////////////////////////////////////////////////

// use route
// app.use("/api/history", historyRouter)

////////////////////////////////////////////////////////

// session setup
app.use(
  session({
    secret: "key",
    resave: false,
    saveUnitialized: true,
  })
);

/////////////////////////////////////////////////////////////////////

// Your route to render the HTML form
app.get("/login", (req, res) => {
  res.render("login"); // Assuming you have a "form.ejs" file in your "views" directory
});

app.post("/login", authenticateUser, (req, res) => {
  res.redirect("home");
  // console.log('swag')
});

app.get("/home", checkAuth, (req, res) => {
  res.render("land", { username: req.session.user.username });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("error destroying session:", err);
    }
    res.redirect("/login");
  });
});

app.get("/input", (req, res) => {
  res.render("to-do"); // Assuming you have a "form.ejs" file in your "views" directory
});


app.post("/input", (req, res) => {
  historyController.createHistory(req, res, (successMessage) => {
    res.render('to-do',{successMessage})
    // res.render("template/successalert");
    // res.redirect("history");
  });
});

app.get("/history", (req, res) => {
  // Run a query to get all history data
  const query =
    "SELECT *, CASE WHEN DATE(workDate) = CURDATE() THEN true ELSE false END AS perbandingan FROM history";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Pass the history data to the view
    // res.render('history2', { history: results });
    res.render("history3", { history: results });
  });
});

////////////////////////////////////////////////////

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(port, '0.0.0.0',() => {
//   console.log(`Server running on 0.0.0.0:${port}`);
// });
