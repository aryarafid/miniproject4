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
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const Chart = require("chart.js");

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

const width = 800; // px
const height = 600; // px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

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

app.get("/input", checkAuth, (req, res) => {
  res.render("to-do"); // Assuming you have a "form.ejs" file in your "views" directory
});

app.post("/input", (req, res) => {
  historyController.createHistory(req, res, (successMessage) => {
    res.render("to-do", { successMessage });
    // res.render("template/successalert");
    // res.redirect("history");
  });
});

app.get("/edit/:Id", (req, res) => {
  const Id = req.params.Id;
  historyController.getHistory(Id, (workLog) => {
    res.render("to-do-edit", { workLog });
  });
});

app.post("/edit/:Id", (req, res) => {
  historyController.updateHistory2(req, res, (successMessage) => {
    // workLogController.getWorkLogById(Id, (workLog) => {
    res.render("history", { successMessage });
    // });
  });
});

app.get("/history", checkAuth, (req, res) => {
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
    res.render("history4", { history: results });
  });
});

//////////////////////////////////////////////////////
app.get(
  "/chart2",
  // checkAuth,
  async (req, res) => {
    // Query to fetch and group data by nama_Tugas and workDate (monthly)
    const query = `SELECT nama_Tugas,
                        DATE_FORMAT(workDate, '%Y-%m') as Month,
                        COUNT(*) as TaskCount
                 FROM history
                 GROUP BY nama_Tugas, Month
                 ORDER BY Month, nama_Tugas`;

    pool.query(query, async (err, result) => {
      if (err) {
        throw err;
      }

      const data = {
        labels: [],
        datasets: [],
      };

      // Helper function to find or create dataset
      const getOrCreateDataset = (name) => {
        let dataset = data.datasets.find((ds) => ds.label === name);
        if (!dataset) {
          dataset = {
            label: name,
            data: [],
            borderWidth: 1,
            backgroundColor: "rgba(0, 123, 255, 0.5)", // Set your preferred color
          };
          data.datasets.push(dataset);
        }
        return dataset;
      };

      let monthLabels = new Set();

      // Populate chart data
      result.forEach((row) => {
        monthLabels.add(row.Month);
        const dataset = getOrCreateDataset(row.nama_Tugas);
        dataset.data.push({ x: row.Month, y: row.TaskCount });
      });

      data.labels = Array.from(monthLabels).sort();

      // res.json(data); // Send JSON response
      res.render("chart", { chartData: data });
    });
  }
);

app.get("/chart", (req, res) => {
  // Query to fetch and group data by nama_Tugas and workDate (monthly)
  const query = ` SELECT nama_Tugas, DATE_FORMAT(workDate, '%Y-%m') as Month, COUNT(*) as TaskCount FROM history GROUP BY nama_Tugas, Month ORDER BY Month, nama_Tugas; `;
  pool.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    // Transform query result into a format suitable for Chart.js
    const data = {
      labels: [],
      datasets: [],
    };
    // Helper function to find or create dataset
    const getOrCreateDataset = (name) => {
      let dataset = data.datasets.find((ds) => ds.label === name);
      if (!dataset) {
        dataset = {
          label: name,
          data: [],
          borderWidth: 1,
          backgroundColor: "rgba(0, 123, 255, 0.5)", // Set your preferred color
        };
        data.datasets.push(dataset);
      }
      return dataset;
    };
    let monthLabels = new Set();
    // Populate chart data
    result.forEach((row) => {
      monthLabels.add(row.Month);
      const dataset = getOrCreateDataset(row.nama_Tugas);
      dataset.data.push({ x: row.Month, y: row.TaskCount });
    });
    data.labels = Array.from(monthLabels).sort();
    // Get the view name from the query parameter
    // const view = req.query.view;
    // Send data to the view

    // res.render('chart', {cdata: data});
    // res.render("chart", { data: JSON.stringify(data) });
    res.render("chart", { data: JSON.stringify(data).replace(/'/g, "\\'") });
  });
});

app.get('test/history4', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
 
// Handle AJAX requests from the index.html file
app.get('/history4', (req, res) => {
  const express = require('express');
  const mysql = require('mysql');
  const app = express();
  const connection = mysql.createConnection({
    host: 'localhost', // Change this to your host
    user: 'root', // Change this to your user
    password: 'root', // Change this to your password
    database: 'attendance' // Change this to your database name
  });
  // Get the query parameters
  const month = req.query.month;
  const year = req.query.year;
 
  // Create a SQL query to get the data from the history table
  let sql = 'SELECT nama_Tugas, workDate, workStart, workEnd, prioritas, description, CASE WHEN DATE(workDate) = CURDATE() THEN true ELSE false END AS editable FROM history';
  // Add a WHERE clause if the month and year are specified
  if (month && year) {
    sql += ` WHERE MONTH(workDate) = ${month} AND YEAR(workDate) = ${year}`;
  }
  // Execute the query and send the results as JSON
  console.log(sql);
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err.stack);
      return;
    }
    res.json(results);
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
