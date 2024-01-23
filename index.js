const express = require("express");
const bodyParser = require("body-parser");
const historyRouter = require("./routes/historyRouter")
const login = require("./controllers/authController")
const logout = require("./controllers/authController")
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Set your templating engine

app.use("/history", historyRouter)
// app.use("/login", login)
// app.use("/logout", logout)

// Your route to render the HTML form
app.get('/login', (req, res) => {
  res.render('login'); // Assuming you have a "form.ejs" file in your "views" directory
});

const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  // Hardcoded credentials check
  if (username === 'admin' && password === 'admin') {
    // Authentication successful
    next();
  } else {
    // Authentication failed
    res.render('login', { error: 'Invalid username or password' });
  }
};
 
// Your route to handle form submission
// app.post('/login', (req, res) => {
//   const username = req.body.username; // Adjust "inputName" to match your input field name
//   const password = req.body.password; // Adjust "inputName" to match your input field name
 
//   console.log(username,password)

//   // Do something with the user input, e.g., send it back to the view
//   // res.render('result', { userInput });
// });

app.post('/login', authenticateUser, (req, res) => {
  // res.render('dashboard', { username: req.body.username });
  console.log('swag')
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(port, '0.0.0.0',() => {
//   console.log(`Server running on 0.0.0.0:${port}`);
// });
