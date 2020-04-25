const express = require('express');
const bodyParser = require('body-parser');

// db connection config
const sequelize = require('./util/database');

// routes
const serviceRoutes = require('./routes/service-request');
const userRoutes = require('./routes/user');
const pwdRoutes = require('./routes/password');
const authRoutes = require('./routes/auth');

// tables
const User = require('./models/user');
const Token = require('./models/token');

const app = express();

app.use(bodyParser.json());

// app.use('/service-request', serviceRoutes);
app.use('/user', userRoutes);
app.use('/password', pwdRoutes);
app.use('/auth', authRoutes);


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST ,GET ,OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type ,Cache-Control, multipart/form-data , application/json ,text/plain, text/html');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


const PORT = process.env.PORT || 3000;

// defining table relations
Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Token);


// sequelize.sync({ force: true })
sequelize.sync()
.then(() => { 
  app.listen(PORT, console.log(`started server on port ${ PORT }`));
  console.log('synced to azure srdb')
}).catch(err => console.log(err))
