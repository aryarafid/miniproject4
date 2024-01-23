const express = require("express");
const bodyParser = require("body-parser");
const historyRouter = require("./routes/historyRouter")
const login = require("./controllers/authController")
const logout = require("./controllers/authController")
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

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
 
// Your route to handle form submission
app.post('/login', (req, res) => {
  const username = req.body.username; // Adjust "inputName" to match your input field name
  const password = req.body.password; // Adjust "inputName" to match your input field name
 
  
  // Do something with the user input, e.g., send it back to the view
  res.render('result', { userInput });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(port, '0.0.0.0',() => {
//   console.log(`Server running on 0.0.0.0:${port}`);
// });
