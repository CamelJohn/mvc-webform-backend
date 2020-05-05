const express = require('express');
const bodyParser = require('body-parser');

// db connection config
const sequelize = require('./util/database');

// routes
const crudSRRoutes = require('./routes/crud-service-request');
const userSRRoutes = require('./routes/user-service-request');
const bulkSRRoutes = require('./routes/bulk-service-request');
const userRoutes = require('./routes/user');
const pwdRoutes = require('./routes/password');
const authRoutes = require('./routes/auth');

// tables
const User = require('./models/user');
const Token = require('./models/token');
const SSR = require('./models/sysaid-service-request');
const ASR = require('./models/azure-service-request');
const Blob = require('./models/blob');

const app = express();

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/password', pwdRoutes);
app.use('/auth', authRoutes);
app.use('/crud-service-request', crudSRRoutes);
app.use('/user-service-request',userSRRoutes);
app.use('/bulk-service-request', bulkSRRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST ,GET ,OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type ,Cache-Control, multipart/form-data , application/json ,text/plain, text/html');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT || 8080;

// defining table relations
// Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// User.hasMany(Token);
// SSR.hasOne(Blob);
// Blob.belongsTo(ASR);

// sequelize.sync({ force: true })
sequelize.sync()
.then(() => { 
  app.listen(PORT, console.log(`started server on port ${ PORT }`));
  console.log('synced to azure srdb')
}).catch(err => console.log(err))
