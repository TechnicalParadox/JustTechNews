const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
