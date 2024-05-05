// Server Dependencies
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('./config/winston');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');



// Init Express
const app = express();
require('dotenv').config();




app.use(session({
  secret: `${process.env.SESSION_SECRET}`, // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  page:null,
  cookie: {
    secure: true, // Use HTTPS for secure cookies
    httpOnly: true, // Prevent client-side access to cookies
    maxAge: 60 * 60 // 1 day expiration
  },
 // store: new MongoStore({ mongooseConnection: db }), // Use MongoDB for session storage
}));

// DB Connection
mongoose.Promise = global.Promise;
let dev = process.env.DEV;
mongoose.connect(
  dev
    ? `${process.env.LOCAL_DB}`
    : `mongodb://${process.env.PROD_DB}`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (e) => {
    if (e) {
      const dbError = {
        error: e,
        msg: 'Error Connecting to Database. Please check MongoDB is running',
      };
      console.log(dbError);
    } else {
      console.log(`Connected to ${dev ? 'Development' : 'Prod'} Database`);
    }
  }
);

// Server Config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: winston.stream }));
app.use(helmet());

// Cors Controls
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());





const requireAuth = (req, res, next) => {
  
    if(!req.session.page)
       return res.json({"d":"no"})
  next();
};

app.get('/profile', requireAuth, (req, res) => {
  console.log(req.session.page)
  res.status(200).json({ message: 'Welcome to your profile', data:req.session.page });
});
app.post('/logout', requireAuth, (req, res) => {
  // Destroy session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});
// Routes Definitions
const adminRoutes = require('./api/routes/adminRoutes');
const userRoutes = require('./api/routes/userRoutes');
const taskRoutes = require('./api/routes/todoListRoutes');
const parkingRoutes = require('./api/routes/parkingRoutes');

adminRoutes(app);
userRoutes(app);
parkingRoutes(app);
taskRoutes(app);


// 404 Handling
app.use((req, res) => {
  winston.error(`'Hit 404' - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Server Port Controls
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
