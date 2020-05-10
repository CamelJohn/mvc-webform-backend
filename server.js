require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const serviceRequestRoutes = require('./routes/service-request');

const app = express();

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/service-request', serviceRequestRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST ,GET ,OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization ,Cache-Control, multipart/form-data , application/json ,text/plain, text/html');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT || 8080;

// sequelize.sync({ force: true })
sequelize.sync()
.then(() => { 
  app.listen(PORT, console.log(`started server on port ${ PORT }`));
  console.log('synced to azure srdb')
}).catch(err => console.log(err))