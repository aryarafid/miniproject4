const express = require("express");
const bodyParser = require("body-parser");
const historyRouter = require("./routes/historyRouter")
const path = require('path');
const session = require('express-session')
const {authenticateUser, checkAuth} = require('./middlewares/middlewares')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Set your templating engine

///////////////////////////////////////////////////////////

// use route
app.use("/history", historyRouter)

////////////////////////////////////////////////////////

// session setup
app.use(session({
  secret:'key',
  resave:false,
  saveUnitialized:true
}))

/////////////////////////////////////////////////////////////////////

// Your route to render the HTML form
app.get('/login', (req, res) => {
  res.render('login'); // Assuming you have a "form.ejs" file in your "views" directory
});

app.post('/login', authenticateUser, (req, res) => {
  res.redirect('dashboard');
  // console.log('swag')
});

app.get('/dashboard', checkAuth, (req, res) => {
  res.render('dashboard', {username: req.session.user.username}); // Assuming you have a "form.ejs" file in your "views" directory
});

app.get('/logout', (req, res) => {
  req.session.destroy((err)=>{
    if (err) {
      console.error('error destroying session:', err)
    } res.redirect('/login')
  })
});

////////////////////////////////////////////////////

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(port, '0.0.0.0',() => {
//   console.log(`Server running on 0.0.0.0:${port}`);
// });
