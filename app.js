require('dotenv').config();
const PORT = global.process.env.PORT;
const express = require('express');
require('./database/config');
const app = express();
const ErrorRouter = require('./routes/404');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const authentication = require('./middleware/authentication ');
app.use(express.json());

// Routes
app.get('/', authentication, (req, res, next) => {
  res.send(`<h1>Home</h1>`);
});
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('*', ErrorRouter);

app.listen(PORT, (error) => {
  console.log(error || `Server is running on port ${PORT}`);
});
