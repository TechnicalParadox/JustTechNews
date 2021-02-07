// --- Dependencies ---
// Load in environment variables from .env file using npm dotenv package
require('dotenv').config();
// Express
const express = require('express');
const routes = require('./controllers');
// Sequelize
const sequelize = require('./config/connection');
// Path
const path = require('path');
// Handlebars
const helpers = require('./utils/helpers');
const exhbs = require('express-handlebars');
const hbs = exhbs.create({ helpers });
// Session
const session = require('express-session');
// Sequelize Store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Express app and port
const app = express();
const PORT = process.env.PORT || 3001;

// Start/Use Session
const sess =
{
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUnitialized: true,
  store: new SequelizeStore(
  {
    db: sequelize
  })
};
app.use(session(sess));

// Handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars Template Engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
if (process.env.RESET_DB === "1")
{
  sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
  .then(() =>
  {
    sequelize.sync({ force: true }).then(() =>
    {
      app.listen(PORT, () => console.log('RESET DB, now listening'));
    });
  })
  .catch((err) => { console.log(err); });
}
else
{
  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });
}
