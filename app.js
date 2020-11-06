require('dotenv').config()

let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser');
let express = require('express');
let favicon = require('serve-favicon')
let logger = require('morgan');
let path = require('path');
let cors = require('cors')
let mongoose = require('mongoose')
let passport = require('./helpers/passport')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)

mongoose.connect(process.env.DB, {useNewUrlParser: true})
  .then(db => console.log(`Connected to Mongo! DB Name: ${db.connections[0].name}`))
  .catch(err => console.log('Error connecting to mongo', err))

var app = express();

app.use(cors({
  credentials: true,
  origin: true
}))

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cookieParser());

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 1000*60*60*24 }
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public', 'static')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.locals.title = 'Punta Piedra APP'

let auth = require('./routes/auth')
let data = require('./routes/data')
let admin = require('./routes/admin')
let consults = require('./routes/consults')

app.use('/auth', auth)
app.use('/data', data)
app.use('/admin', admin)
app.use('/consults', consults)
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

module.exports = app;
